// server.ts
// 使用 Deno 原生 API，无需 import，更稳定

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function callModelScope(apiKey: string, prompt: string, modelId: string): Promise<string> {
  const baseUrl = 'https://api-inference.modelscope.cn/';
  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "X-ModelScope-Async-Mode": "true"
  };

  console.log(`[Server] 任务启动: ${modelId}`);

  // 1. 提交任务
  const submitRes = await fetch(`${baseUrl}v1/images/generations`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: modelId,
      prompt: prompt,
      n: 1,
      size: "1024x1024"
    }),
  });

  if (!submitRes.ok) {
    const errText = await submitRes.text();
    console.error(`[ModelScope Error] 提交失败: ${submitRes.status} - ${errText}`);
    throw new Error(`ModelScope 提交失败: ${errText}`);
  }

  const { task_id } = await submitRes.json();
  console.log(`[Server] 任务ID: ${task_id}`);

  // 2. 轮询状态 (最多等待 3 分钟)
  for (let i = 0; i < 90; i++) {
    await sleep(2000);
    const statusRes = await fetch(`${baseUrl}v1/tasks/${task_id}`, {
      method: "GET",
      headers: { ...headers, "X-ModelScope-Task-Type": "image_generation" }
    });

    if (!statusRes.ok) continue;

    const data = await statusRes.json();
    
    if (data.task_status === "SUCCEED") {
      console.log("[Server] 生成成功");
      // 兼容各种返回格式
      if (data.output?.images?.[0]?.url) return data.output.images[0].url;
      if (data.output_images?.[0]) return data.output_images[0];
      if (data.output?.results?.[0]?.url) return data.output.results[0].url;
    }

    if (data.task_status === "FAILED") {
      throw new Error(`生成失败: ${data.message}`);
    }
  }
  throw new Error("生成超时");
}

// Deno 原生服务启动方式
Deno.serve(async (req) => {
  const url = new URL(req.url);

  // 处理 CORS 预检请求
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }

  // API 路由
  if (url.pathname === "/api/generate-invitation" && req.method === "POST") {
    try {
      const { prompt, model } = await req.json();
      
      // 读取 Key (兼容两种变量名)
      const apiKey = Deno.env.get("VITE_API_KEY") || Deno.env.get("MODELSCOPE_API_KEY");
      
      if (!apiKey) {
        return new Response(JSON.stringify({ error: "API Key 未配置" }), { 
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      const targetModel = model || 'Qwen/Qwen-Image';
      const imageUrl = await callModelScope(apiKey, prompt, targetModel);

      return new Response(JSON.stringify({ url: imageUrl }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });

    } catch (error: any) {
      console.error("[Server Crash Prevented]", error);
      return new Response(JSON.stringify({ error: error.message || "服务器内部错误" }), { 
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
  }

  // 静态文件服务 (手动实现最基础版本，防止 std 库版本冲突)
  // Deno Deploy 会自动处理静态文件，如果路径不匹配 API，通常返回 404
  // 这里我们简单回退到 index.html 以支持 SPA 路由
  try {
    const serveFile = async (path: string, type: string) => {
      const file = await Deno.readFile(`./dist${path}`);
      return new Response(file, { headers: { "Content-Type": type } });
    };

    if (url.pathname === "/" || url.pathname === "/index.html") return await serveFile("/index.html", "text/html");
    if (url.pathname.endsWith(".js")) return await serveFile(url.pathname, "application/javascript");
    if (url.pathname.endsWith(".css")) return await serveFile(url.pathname, "text/css");
    if (url.pathname.endsWith(".svg")) return await serveFile(url.pathname, "image/svg+xml");
    
    // 默认返回 index.html
    return await serveFile("/index.html", "text/html");
  } catch {
    return new Response("Not Found", { status: 404 });
  }
});