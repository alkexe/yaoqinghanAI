export class GeminiService {
  // 必须使用 import.meta.env 才能读取到 Vite 注入的环境变量
  private static apiKey = import.meta.env.VITE_API_KEY || ''; 

  static async generateInvitation(params: {
    eventType: string;
    description: string;
    style: string;
  }): Promise<string | null> {
    
    if (!this.apiKey) {
      console.error("API key is missing! 请检查 Deno 项目内部 Settings 里的 Environment Variables");
      return null;
    }

    const prompt = `A professional invitation background for ${params.eventType}. Style: ${params.style}. Details: ${params.description}. High resolution, 4K, artistic.`;

    try {
      // 使用 ModelScope 最稳的 OpenAI 兼容接口地址
      const response = await fetch('https://api-inference.modelscope.cn/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'AI-ModelScope/stable-diffusion-v2-1', 
          prompt: prompt,
          n: 1,
          size: "1024x1024"
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("ModelScope 报错:", result);
        return null;
      }

      return result.data?.[0]?.url || null;

    } catch (error) {
      console.error("网络请求异常:", error);
      return null;
    }
  }
}