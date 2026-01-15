export class GeminiService {
  static async generateInvitation(params: {
    eventType: string;
    description: string;
    style: string;
    model: string; // [新增] 接收模型参数
  }): Promise<string | null> {
    
    // 针对 Flux 系列模型，提示词需要优化为英文且更具描述性
    const prompt = `A professional invitation card background for ${params.eventType}. Style: ${params.style}. Details: ${params.description}. High quality, no text, artistic composition, 8k resolution.`;

    try {
      const response = await fetch('/api/generate-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // [修改] 将选中的模型 ID 传给后端
        body: JSON.stringify({ 
          prompt: prompt,
          model: params.model 
        }),
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