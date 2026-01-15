export class GeminiService {
  // 确保这里读取的是你在 Deno 设置的环境变量名
  private static apiKey = import.meta.env.VITE_API_KEY || ''; 

  static async generateInvitation(params: {
    eventType: string;
    description: string;
    style: string;
  }): Promise<string | null> {
    
    // 检查 Key 是否成功注入
    if (!this.apiKey) {
      console.error("API key is missing! 请检查 Deno Deploy 的 Settings -> Environment Variables 是否配置了 VITE_API_KEY");
      return null;
    }

    // 构建提示词：英文提示词在 ModelScope 模型上成功率更高
    const prompt = `A professional invitation card background for ${params.eventType}. Style: ${params.style}. Details: ${params.description}. High quality, artistic composition, no text.`;

    try {
      // 使用 ModelScope 最稳的 OpenAI 兼容接口地址
      const response = await fetch('https://api-inference.modelscope.cn/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'AI-ModelScope/stable-diffusion-v2-1', // 这是目前 API 响应最快的模型
          prompt: prompt,
          n: 1,
          size: "1024x1024"
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("ModelScope 接口返回错误:", result);
        return null;
      }

      // 提取生成的图片链接
      if (result.data && result.data[0] && result.data[0].url) {
        return result.data[0].url;
      }
      
      return null;

    } catch (error) {
      console.error("生成邀请函请求异常:", error);
      return null;
    }
  }
}