export class GeminiService {
  // Vite 项目必须通过 import.meta.env 读取环境变量
  private static apiKey = import.meta.env.VITE_API_KEY || ''; 

  static async generateInvitation(params: {
    eventType: string;
    description: string;
    style: string;
  }): Promise<string | null> {
    
    if (!this.apiKey) {
      console.error("API key is missing! 请检查 Deno 项目 Settings 中的 Environment Variables 变量名是否为 VITE_API_KEY");
      return null;
    }

    const prompt = `A professional invitation card background for ${params.eventType}. Style: ${params.style}. Details: ${params.description}. High quality.`;

    try {
      // 使用 ModelScope 最稳的通用生成路径
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
        console.error("ModelScope 接口报错:", result);
        return null;
      }

      return result.data?.[0]?.url || null;

    } catch (error) {
      console.error("请求异常:", error);
      return null;
    }
  }
}