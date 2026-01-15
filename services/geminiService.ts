export class GeminiService {
  // 必须使用 import.meta.env 读取注入的环境变量
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

    try {
      const response = await fetch('https://api-inference.modelscope.cn/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'AI-ModelScope/stable-diffusion-v2-1', 
          prompt: `Invitation for ${params.eventType}, ${params.style} style, ${params.description}`,
          n: 1,
          size: "1024x1024"
        }),
      });

      const result = await response.json();
      return result.data?.[0]?.url || null;
    } catch (error) {
      console.error("生成失败:", error);
      return null;
    }
  }
}