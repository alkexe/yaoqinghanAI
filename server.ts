import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

// 辅助函数：延迟等待
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 核心逻辑：调用 ModelScope (异步轮询模式，参考自 main.ts)
async function callModelScope(apiKey: string, prompt: string): Promise<string> {
  const baseUrl = 'https://api-inference.modelscope.cn/';
  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "X-ModelScope-Async-Mode": "true" // 关键：开启异步模式
  };

  console.log("[Server] 正在提交任务...");
  
  // 1. 提交生成任务
  const submitResponse = await fetch(`${baseUrl}v1/images/generations`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      model: 'AI-ModelScope/stable-diffusion-v2-1', // 使用稳定的 SD 模型
      prompt: prompt,
      n: 1,
      size: "1024x1024"
    }),
  });

  if (!submitResponse.ok) {
    const err = await submitResponse.text();
    throw new Error(`任务提交失败: ${submitResponse.status} - ${err}`);
  }

  const { task_id } = await submitResponse.json();
  console.log(`[Server] 任务已提交，ID: ${task_id}`);

  // 2. 轮询任务状态 (参考 main.ts 的逻辑)
  const maxRetries = 60; // 最多等待 60 次
  for (let i = 0; i < maxRetries; i++) {
    await sleep(2000); // 每 2 秒查一次

    const statusResponse = await fetch(`${baseUrl}v1/tasks/${task_id}`, {
      method: "GET",
      headers: { ...headers, "X-ModelScope-Task-Type": "image_generation" }
    });

    if (!statusResponse.ok) continue;

    const data = await statusResponse.json();
    
    if (data.task_status === "SUCCEED") {
      console.log("[Server] 生成成功！");
      // 兼容不同模型返回格式
      if (data.output?.images?.[0]?.url) return data.output.images[0].url;
      if (data.output_images?.[0]) return data.output_images[0];
    }

    if (data.task_status === "FAILED") {
      throw new Error(`生成失败: ${data.message}`);
    }
  }

  throw new Error("生成超时");
}

// 启动服务器
serve(async (req) => {
  const url = new URL(req.url);

  // === API 路由：前端请求这个接口 ===
  if (url.pathname === "/api/generate-invitation" && req.method === "POST") {
    try {
      const { prompt } = await req.json();
      
      // 从 Deno 环境变量获取 Key (兼容 VITE_API_KEY)
      const apiKey = Deno.env.get("VITE_API_KEY") || Deno.env.get("MODELSCOPE_API_KEY");
      
      if (!apiKey) {
        return new Response(JSON.stringify({ error: "API Key 未配置" }), { status: 500 });
      }

      const imageUrl = await callModelScope(apiKey, prompt);

      return new Response(JSON.stringify({ url: imageUrl }), {
        headers: { "Content-Type": "application/json" }
      });

    } catch (error: any) {
      console.error("[Server Error]", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }

  // === 静态资源路由：服务 React 打包后的文件 ===
  // 这里指向 dist 文件夹
  return serveDir(req, {
    fsRoot: "dist",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});