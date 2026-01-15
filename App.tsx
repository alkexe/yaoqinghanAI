import React, { useState } from 'react';
import { GeminiService } from './services/geminiService';
import './App.css'; // 假设你有这个css，如果没有可以忽略

// 定义支持的 4 个模型 ID
const AI_MODELS = [
  { name: 'Qwen-Image', id: 'Qwen/Qwen-Image' },
  { name: 'Flux', id: 'MusePublic/FLUX.1-dev' }, // 使用社区最稳的 Flux Dev 版本
  { name: 'Kontext', id: 'MusePublic/FLUX.1-Kontext-Dev' },
  { name: 'Krea', id: 'black-forest-labs/FLUX.1-Krea-dev' }
];

function App() {
  const [eventType, setEventType] = useState('Wedding');
  const [style, setStyle] = useState('Elegant');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  // [新增] 默认选中 Qwen
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].id);

  const handleGenerate = async () => {
    setLoading(true);
    setImageUrl(null);
    
    // [修改] 传入 selectedModel
    const url = await GeminiService.generateInvitation({
      eventType,
      style,
      description,
      model: selectedModel 
    });
    
    setImageUrl(url);
    setLoading(false);
  };

  return (
    <div className="app-container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>AI 邀请函生成器</h1>
      
      {/* 预览区域 */}
      <div className="preview-box" style={{ 
        width: '100%', height: '400px', backgroundColor: '#1e1e1e', 
        borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', overflow: 'hidden' 
      }}>
        {loading ? (
          <div style={{ color: 'white' }}>✨ 正在使用 {AI_MODELS.find(m => m.id === selectedModel)?.name} 绘制中...</div>
        ) : imageUrl ? (
          <img src={imageUrl} alt="Invitation" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        ) : (
          <div style={{ color: '#666' }}>生成的图片将显示在这里</div>
        )}
      </div>

      {/* 模型选择器 [新增] */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>选择 AI 画师:</label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {AI_MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedModel === model.id ? '#6366f1' : '#e5e7eb',
                color: selectedModel === model.id ? 'white' : 'black',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              {model.name}
            </button>
          ))}
        </div>
      </div>

      {/* 表单区域 */}
      <div className="form-group" style={{ marginBottom: '15px' }}>
        <label>活动类型:</label>
        <input 
          value={eventType} 
          onChange={(e) => setEventType(e.target.value)} 
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>

      <div className="form-group" style={{ marginBottom: '15px' }}>
        <label>风格:</label>
        <input 
          value={style} 
          onChange={(e) => setStyle(e.target.value)} 
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>

      <div className="form-group" style={{ marginBottom: '20px' }}>
        <label>详细描述:</label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          style={{ width: '100%', padding: '8px', marginTop: '5px', minHeight: '80px' }}
          placeholder="例如：淡雅的花朵边框，金色字体..."
        />
      </div>

      <button 
        onClick={handleGenerate} 
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#4f46e5',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? '生成中...' : '开始生成'}
      </button>
    </div>
  );
}

export default App;