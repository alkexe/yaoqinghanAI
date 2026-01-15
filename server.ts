import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 核心逻辑：接收 model 参数
async function callModelScope(apiKey: string, prompt: string, modelId: string): Promise<string> {
  const baseUrl = 'https://api-inference.modelscope.cn/';
  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "X-ModelScope-Async-Mode": "true"
  };

  console.log(`[Server] 正在提交任务，使用模型: ${modelId}`);
  
  // 1. 提交任务
  const submitResponse = await fetch(`${baseUrl}v1/images/generations`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      model: modelId, // [修改] 使用传入的模型 ID
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

  // 2. 轮询状态
  const maxRetries = 90; 
  for (let i = 0; i < maxRetries; i++) {
    await sleep(2000); 

    const statusResponse = await fetch(`${baseUrl}v1/tasks/${task_id}`, {
      method: "GET",
      headers: { ...headers, "X-ModelScope-Task-Type": "image_generation" }
    });

    if (!statusResponse.ok) continue;

    const data = await statusResponse.json();
    
    if (data.task_status === "SUCCEED") {
      console.log("[Server] 生成成功！");
      if (data.output?.images?.[0]?.url) return data.output.images[0].url;
      if (data.output_images?.[0]) return data.output_images[0];
      if (data.output?.results?.[0]?.url) return data.output.results[0].url;
    }

    if (data.task_status === "FAILED") {
      throw new Error(`生成失败: ${data.message || '未知错误'}`);
    }
  }
  throw new Error("生成超时");
}

serve(async (req) => {
  const url = new URL(req.url);

  if (url.pathname === "/api/generate-invitation" && req.method === "POST") {
    try {
      // [修改] 从前端获取 prompt 和 model
      const { prompt, model } = await req.json();
      
      const apiKey = Deno.env.get("VITE_API_KEY");
      if (!apiKey) {
        return new Response(JSON.stringify({ error: "API Key 未配置" }), { status: 500 });
      }

      // 默认使用 Qwen，防止前端没传参数
      const targetModel = model || 'Qwen/Qwen-Image';
      const imageUrl = await callModelScope(apiKey, prompt, targetModel);

      return new Response(JSON.stringify({ url: imageUrl }), {
        headers: { "Content-Type": "application/json" }
      });

    } catch (error: any) {
      console.error("[Server Error]", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }

  return serveDir(req, {
    fsRoot: "dist",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});