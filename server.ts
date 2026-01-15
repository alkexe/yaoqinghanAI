import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

// 辅助函数：延迟等待
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 核心逻辑：调用 ModelScope (使用 Qwen/Qwen-Image 模型)
async function callModelScope(apiKey: string, prompt: string): Promise<string> {
  const baseUrl = 'https://api-inference.modelscope.cn/';
  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "X-ModelScope-Async-Mode": "true" // 必须开启异步模式
  };

  console.log("[Server] 正在提交 Qwen 任务...");
  
  // 1. 提交生成任务
  // 使用 OpenAI 兼容格式，但模型换成 Qwen/Qwen-Image
  const submitResponse = await fetch(`${baseUrl}v1/images/generations`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      model: 'Qwen/Qwen-Image', // [修改] 切换到通义万相模型，这个更稳
      prompt: prompt,
      n: 1,
      size: "1024x1024" 
    }),
  });

  if (!submitResponse.ok) {
    const err = await submitResponse.text();
    console.error(`[ModelScope Error] Status: ${submitResponse.status}, Body: ${err}`);
    throw new Error(`任务提交失败: ${err}`);
  }

  const { task_id } = await submitResponse.json();
  console.log(`[Server] 任务已提交，ID: ${task_id}`);

  // 2. 轮询任务状态 (Qwen 生成通常需要 10-30 秒)
  const maxRetries = 90; // 给它 3 分钟时间
  for (let i = 0; i < maxRetries; i++) {
    await sleep(2000); // 每 2 秒查一次

    const statusResponse = await fetch(`${baseUrl}v1/tasks/${task_id}`, {
      method: "GET",
      headers: { ...headers, "X-ModelScope-Task-Type": "image_generation" }
    });

    if (!statusResponse.ok) continue;

    const data = await statusResponse.json();
    
    // 打印状态以便调试
    if (i % 5 === 0) console.log(`[Server] 任务状态: ${data.task_status}`);

    if (data.task_status === "SUCCEED") {
      console.log("[Server] 生成成功！");
      // 兼容不同的返回结构
      if (data.output?.images?.[0]?.url) return data.output.images[0].url;
      if (data.output_images?.[0]) return data.output_images[0];
      // 有时候 Qwen 会直接返回 url 字符串在 results 里
      if (data.output?.results?.[0]?.url) return data.output.results[0].url;
    }

    if (data.task_status === "FAILED") {
      console.error("[Server] 任务失败详情:", data);
      throw new Error(`生成失败: ${data.message || '未知错误'}`);
    }
  }

  throw new Error("生成超时，请重试");
}

// 启动服务器
serve(async (req) => {
  const url = new URL(req.url);

  // === API 路由 ===
  if (url.pathname === "/api/generate-invitation" && req.method === "POST") {
    try {
      const { prompt } = await req.json();
      
      // 读取我们在 Deno Settings 里设置好的 VITE_API_KEY
      // 这里增加一个容错：也可以读取 MODELSCOPE_API_KEY
      const apiKey = Deno.env.get("VITE_API_KEY") || Deno.env.get("MODELSCOPE_API_KEY");
      
      if (!apiKey) {
        console.error("[Server] 缺少 API Key");
        return new Response(JSON.stringify({ error: "服务器端缺少 API Key 配置" }), { status: 500 });
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

  // === 静态资源路由 ===
  // 确保这里指向 dist 目录
  return serveDir(req, {
    fsRoot: "dist",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});