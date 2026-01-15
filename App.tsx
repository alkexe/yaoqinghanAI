import React, { useState } from 'react';
import { GeminiService } from './services/geminiService';

// 定义支持的模型列表
const AI_MODELS = [
  { name: '通义万相', id: 'Qwen/Qwen-Image' },
  { name: 'Flux', id: 'MusePublic/FLUX.1-dev' },
  { name: 'Kontext', id: 'MusePublic/FLUX.1-Kontext-Dev' },
  { name: 'Krea', id: 'black-forest-labs/FLUX.1-Krea-dev' }
];

function App() {
  const [eventType, setEventType] = useState('Wedding Ceremony');
  const [style, setStyle] = useState('Minimalist');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  // 默认选中通义万相
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].id);

  const handleGenerate = async () => {
    setLoading(true);
    setImageUrl(null);
    const url = await GeminiService.generateInvitation({
      eventType,
      style,
      description,
      model: selectedModel 
    });
    setImageUrl(url);
    setLoading(false);
  };

  // --- 样式定义 (内联样式确保样式不丢失) ---
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100vh',
      backgroundColor: '#0f172a', // 深色背景
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    header: {
      padding: '16px 32px',
      borderBottom: '1px solid #1e293b',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      background: 'linear-gradient(to right, #a78bfa, #2dd4bf)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    main: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden',
      flexDirection: 'row' as const, // 桌面端左右布局
    },
    previewSection: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#020617', // 更深的预览区背景
      padding: '20px',
      position: 'relative' as const,
    },
    previewBox: {
      maxWidth: '100%',
      maxHeight: '100%',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    configPanel: {
      width: '400px', // 固定宽度的侧边栏
      backgroundColor: '#1e293b', // 侧边栏背景
      padding: '32px',
      display: 'flex',
      flexDirection: 'column' as const,
      borderLeft: '1px solid #334155',
      overflowY: 'auto' as const,
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '24px',
      color: 'white',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      color: '#94a3b8',
      marginBottom: '8px',
      marginTop: '20px',
      fontWeight: 500,
    },
    input: {
      width: '100%',
      backgroundColor: '#0f172a',
      border: '1px solid #334155',
      borderRadius: '8px',
      padding: '12px 16px',
      color: 'white',
      fontSize: '16px',
      outline: 'none',
      boxSizing: 'border-box' as const,
      transition: 'border-color 0.2s',
    },
    textarea: {
      width: '100%',
      backgroundColor: '#0f172a',
      border: '1px solid #334155',
      borderRadius: '8px',
      padding: '12px 16px',
      color: 'white',
      fontSize: '16px',
      minHeight: '100px',
      outline: 'none',
      boxSizing: 'border-box' as const,
      resize: 'vertical' as const,
    },
    button: {
      marginTop: '40px',
      width: '100%',
      padding: '16px',
      background: 'linear-gradient(to right, #4f46e5, #7c3aed)', // 紫色渐变按钮
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: loading ? 'wait' : 'pointer',
      opacity: loading ? 0.7 : 1,
      boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.5)',
      transition: 'transform 0.1s',
    },
    modelBtnContainer: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap' as const,
    },
    modelBtn: (isActive: boolean) => ({
      flex: 1,
      padding: '8px 12px',
      borderRadius: '6px',
      border: isActive ? '1px solid #6366f1' : '1px solid #334155',
      backgroundColor: isActive ? 'rgba(99, 102, 241, 0.2)' : '#0f172a',
      color: isActive ? '#818cf8' : '#cbd5e1',
      fontSize: '13px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textAlign: 'center' as const,
      whiteSpace: 'nowrap' as const,
    })
  };

  return (
    <div style={styles.container}>
      {/* 顶部导航 */}
      <div style={styles.header}>
        <div style={styles.headerTitle}>✨ AI Workspace</div>
        <div style={{fontSize: '14px', color: '#64748b'}}>Deno Deploy Edition</div>
      </div>

      <div style={styles.main}>
        {/* 左侧：预览区域 */}
        <div style={styles.previewSection}>
          {loading ? (
            <div style={{textAlign: 'center', color: '#94a3b8'}}>
              <div className="spinner" style={{marginBottom: '20px', fontSize: '40px'}}>🎨</div>
              <div>正在请求 {AI_MODELS.find(m => m.id === selectedModel)?.name} 作画...</div>
            </div>
          ) : imageUrl ? (
            <div style={styles.previewBox}>
              <img src={imageUrl} alt="Generated Invitation" style={{maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain'}} />
            </div>
          ) : (
            <div style={{color: '#475569', textAlign: 'center'}}>
              <div style={{fontSize: '48px', marginBottom: '16px'}}>🖼️</div>
              <div>预览区域</div>
            </div>
          )}
        </div>

        {/* 右侧：配置面板 */}
        <div style={styles.configPanel}>
          <div style={styles.sectionTitle}>Configure Invitation</div>

          {/* 1. 模型选择器 (新功能) */}
          <div>
            <label style={styles.label}>AI Model (画师)</label>
            <div style={styles.modelBtnContainer}>
              {AI_MODELS.map(model => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  style={styles.modelBtn(selectedModel === model.id)}
                >
                  {model.name}
                </button>
              ))}
            </div>
          </div>

          {/* 2. 原有输入框 */}
          <div>
            <label style={styles.label}>Event Type</label>
            <input
              style={styles.input}
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              placeholder="e.g. Wedding, Birthday"
            />
          </div>

          <div>
            <label style={styles.label}>Visual Style</label>
            <input
              style={styles.input}
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="e.g. Minimalist, Floral, Cyberpunk"
            />
          </div>

          <div>
            <label style={styles.label}>Description & Details</label>
            <textarea
              style={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter specific details about colors, mood, or elements..."
            />
          </div>

          {/* 生成按钮 */}
          <button style={styles.button} onClick={handleGenerate} disabled={loading}>
            {loading ? 'Generating...' : '✨ Generate Invitation'}
          </button>
        </div>
      </div>
      
      {/* 移动端适配 (简单处理) */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="flex-direction: row"] { flex-direction: column !important; }
          div[style*="width: 400px"] { width: 100% !important; border-left: none !important; border-top: 1px solid #334155; }
          div[style*="height: 100vh"] { height: auto !important; min-height: 100vh; }
        }
      `}</style>
    </div>
  );
}

export default App;