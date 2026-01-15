import React, { useState } from 'react';
import { GeminiService } from './services/geminiService';
// 移除 css import，直接使用内联样式，防止 404

const AI_MODELS = [
  { name: '通义万相', id: 'Qwen/Qwen-Image' },
  { name: 'Flux', id: 'MusePublic/FLUX.1-dev' },
  { name: 'Kontext', id: 'MusePublic/FLUX.1-Kontext-Dev' },
  { name: 'Krea', id: 'black-forest-labs/FLUX.1-Krea-dev' }
];

function App() {
  const [eventType, setEventType] = useState('Wedding');
  const [style, setStyle] = useState('Elegant');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].id);

  const handleGenerate = async () => {
    setLoading(true);
    setImageUrl(null);
    const url = await GeminiService.generateInvitation({
      eventType, style, description, model: selectedModel 
    });
    setImageUrl(url);
    setLoading(false);
  };

  return (
    <div style={{ 
      padding: '40px 20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif',
      backgroundColor: '#f9fafb', minHeight: '100vh', boxSizing: 'border-box'
    }}>
      <h1 style={{ textAlign: 'center', color: '#111827', marginBottom: '30px' }}>AI 邀请函设计室</h1>
      
      {/* 预览窗口 */}
      <div style={{ 
        width: '100%', height: '400px', backgroundColor: '#e5e7eb', 
        borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', 
        marginBottom: '30px', overflow: 'hidden', border: '2px dashed #d1d5db',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        {loading ? (
          <div style={{ color: '#4b5563', fontSize: '18px', fontWeight: '500' }}>
             🎨 {AI_MODELS.find(m => m.id === selectedModel)?.name} 正在绘制中...
          </div>
        ) : imageUrl ? (
          <img src={imageUrl} alt="Result" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          <div style={{ color: '#9ca3af' }}>预览图将显示在这里</div>
        )}
      </div>

      {/* 模型选择按钮 (重点) */}
      <div style={{ marginBottom: '25px', padding: '20px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <label style={{ display: 'block', marginBottom: '15px', fontWeight: 'bold', color: '#374151' }}>选择 AI 风格模型:</label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {AI_MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              style={{
                flex: '1',
                minWidth: '100px',
                padding: '10px 16px',
                borderRadius: '8px',
                border: selectedModel === model.id ? '2px solid #6366f1' : '1px solid #d1d5db',
                cursor: 'pointer',
                backgroundColor: selectedModel === model.id ? '#eef2ff' : 'white',
                color: selectedModel === model.id ? '#4f46e5' : '#374151',
                fontWeight: selectedModel === model.id ? 'bold' : 'normal',
                transition: 'all 0.2s',
              }}
            >
              {model.name}
            </button>
          ))}
        </div>
      </div>

      {/* 输入表单 */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>活动类型</label>
          <input value={eventType} onChange={(e) => setEventType(e.target.value)} 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>设计风格</label>
          <input value={style} onChange={(e) => setStyle(e.target.value)} 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>详细描述</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', minHeight: '80px', boxSizing: 'border-box' }} />
        </div>

        <button onClick={handleGenerate} disabled={loading}
          style={{
            width: '100%', padding: '14px', backgroundColor: '#4f46e5', color: 'white',
            border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}>
          {loading ? '生成中...' : '开始生成邀请函'}
        </button>
      </div>
    </div>
  );
}

export default App;