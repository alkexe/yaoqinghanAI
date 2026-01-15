export class GeminiService {
  static async generateInvitation(params: {
    eventType: string;
    description: string;
    style: string;
    model: string;
  }): Promise<string | null> {
    
    const prompt = `Invitation card for ${params.eventType}. Style: ${params.style}. ${params.description}. High quality, 8k resolution.`;

    try {
      // 这里的路径必须和 server.ts 里的 pathname 一致
      const response = await fetch('/api/generate-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt, model: params.model }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        console.error("生成失败:", result.error);
        return null;
      }
      return result.url;
    } catch (error) {
      console.error("请求异常:", error);
      return null;
    }
  }
}