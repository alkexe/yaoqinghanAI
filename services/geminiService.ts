export class GeminiService {
  static async generateInvitation(params: {
    eventType: string;
    description: string;
    style: string;
  }): Promise<string | null> {
    
    // 构建提示词
    const prompt = `A professional invitation card background for ${params.eventType}. Style: ${params.style}. Details: ${params.description}. High quality, no text.`;

    try {
      // 请求我们自己的 Deno 后端 (server.ts)
      const response = await fetch('/api/generate-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: prompt }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        console.error("生成失败:", result.error);
        return null;
      }

      return result.url;

    } catch (error) {
      console.error("网络请求异常:", error);
      return null;
    }
  }
}