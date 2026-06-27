import React, { useState } from 'react';
import { useCustomizationContext } from './CustomizationProvider';
import { THEME_COLORS, FONT_STYLES, BACKGROUND_STYLES, ACCENT_COLORS } from '../types/customization';
import { ArrowLeftIcon, PaletteIcon, TypeIcon, ImageIcon, SaveIcon, RefreshCwIcon, EyeIcon } from 'lucide-react';

interface BlogCustomizationPageProps {
  navigate: (route: '/' | '/profile' | '/leaderboard' | '/customize' | '/article', params?: any) => void;
}

export default function BlogCustomizationPage({ navigate }: BlogCustomizationPageProps) {
  const { customization, updateCustomization, resetCustomization } = useCustomizationContext();
  const [previewMode, setPreviewMode] = useState(false);
  const [tempCustomization, setTempCustomization] = useState(customization);

  const handleBack = () => {
    navigate('/');
  };

  const handlePreviewToggle = () => {
    if (previewMode) {
      // Apply changes
      updateCustomization(tempCustomization);
    }
    setPreviewMode(!previewMode);
  };

  const handleReset = () => {
    resetCustomization();
    setTempCustomization(customization);
  };

  const handleTempUpdate = (updates: Partial<typeof tempCustomization>) => {
    const newTemp = { ...tempCustomization, ...updates };
    setTempCustomization(newTemp);
    if (previewMode) {
      updateCustomization(newTemp);
    }
  };

  const handleSaveAndExit = () => {
    updateCustomization(tempCustomization);
    navigate('/');
  };

  const currentTheme = THEME_COLORS.find(t => t.value === tempCustomization.themeColor) || THEME_COLORS[0];
  const currentFont = FONT_STYLES.find(f => f.value === tempCustomization.fontStyle) || FONT_STYLES[0];
  const currentBackground = BACKGROUND_STYLES.find(b => b.value === tempCustomization.backgroundStyle) || BACKGROUND_STYLES[0];
  const currentAccent = ACCENT_COLORS.find(a => a.value === tempCustomization.accentColor) || ACCENT_COLORS[0];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Panel */}
        <div className="lg:col-span-2">
          <div className="bg-dark-card backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-gray-500">
            {/* Header */}
            <div className="p-6 border-b-4 border-gray-500 bg-gradient-to-r from-dark-surface to-dark-muted rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleBack}
                    className="p-3 hover:bg-dark-hover rounded-full transition-all duration-300 border-2 border-gray-500 bg-dark-card shadow-lg hover:shadow-xl hover:scale-110"
                  >
                    <ArrowLeftIcon size={20} className="text-dark-text" />
                  </button>
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-r from-theme-primary to-theme-secondary rounded-full flex items-center justify-center shadow-lg">
                        <PaletteIcon size={24} className="text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-dark-text">
                        自定义
                      </h2>
                    </div>
                    <p className="text-dark-text-secondary font-medium">个性化您的博客外观和风格</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handlePreviewToggle}
                    className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-2 ${
                      previewMode 
                        ? 'bg-gradient-to-r from-dark-success to-dark-primary text-white' 
                        : 'bg-gradient-to-r from-theme-primary to-theme-secondary text-white'
                    }`}
                  >
                    <EyeIcon size={16} />
                    <span>{previewMode ? '应用更改' : '实时预览'}</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-gradient-to-r from-dark-warning to-dark-error text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-2"
                  >
                    <RefreshCwIcon size={16} />
                    <span>重置</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Settings Content */}
            <div className="p-8 space-y-8">
              {/* Blog Title */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-theme-accent to-theme-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">⚔️</span>
                  </div>
                  <h3 className="text-xl font-bold text-dark-text">博客标题</h3>
                </div>
                <input
                  type="text"
                  value={tempCustomization.blogTitle}
                  onChange={(e) => handleTempUpdate({ blogTitle: e.target.value })}
                  className="w-full px-6 py-4 border-3 border-gray-500 rounded-2xl focus:outline-none focus:ring-4 focus:ring-theme-primary/30 focus:border-theme-primary bg-dark-surface text-lg font-medium shadow-lg text-dark-text"
                  placeholder="输入您的博客标题"
                />
              </div>

              {/* Theme Colors */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-theme-primary to-theme-secondary rounded-full flex items-center justify-center">
                    <PaletteIcon size={16} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-dark-text">主题色彩</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {THEME_COLORS.map((theme) => (
                    <button
                      key={theme.value}
                      onClick={() => handleTempUpdate({ themeColor: theme.value })}
                      className={`p-4 rounded-2xl border-3 transition-all duration-300 hover:scale-105 ${
                        tempCustomization.themeColor === theme.value
                          ? 'border-theme-accent bg-theme-primary/20'
                          : 'border-gray-500 bg-dark-surface hover:border-theme-primary/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div 
                          className="w-6 h-6 rounded-full shadow-lg"
                          style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                        />
                        <span className="text-dark-text font-bold text-sm">{theme.name}</span>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.primary }} />
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.secondary }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Styles */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-theme-secondary to-theme-accent rounded-full flex items-center justify-center">
                    <TypeIcon size={16} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-dark-text">字体风格</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {FONT_STYLES.map((font) => (
                    <button
                      key={font.value}
                      onClick={() => handleTempUpdate({ fontStyle: font.value })}
                      className={`p-4 rounded-2xl border-3 transition-all duration-300 hover:scale-105 text-center ${
                        tempCustomization.fontStyle === font.value
                          ? 'border-theme-accent bg-theme-primary/20'
                          : 'border-gray-500 bg-dark-surface hover:border-theme-primary/50'
                      }`}
                    >
                      <div className="mb-2">
                        <span className="text-dark-text font-bold">{font.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Styles */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-theme-accent to-theme-secondary rounded-full flex items-center justify-center">
                    <ImageIcon size={16} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-dark-text">背景样式</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {BACKGROUND_STYLES.map((bg) => (
                    <button
                      key={bg.value}
                      onClick={() => handleTempUpdate({ backgroundStyle: bg.value })}
                      className={`p-4 rounded-2xl border-3 transition-all duration-300 hover:scale-105 text-left ${
                        tempCustomization.backgroundStyle === bg.value
                          ? 'border-theme-accent bg-theme-primary/20'
                          : 'border-gray-500 bg-dark-surface hover:border-theme-primary/50'
                      }`}
                    >
                      <div className="mb-2">
                        <span className="text-dark-text font-bold">{bg.name}</span>
                      </div>
                      <div className="text-dark-text-secondary text-sm">{bg.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Colors */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-theme-primary to-theme-accent rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✨</span>
                  </div>
                  <h3 className="text-xl font-bold text-dark-text">强调色彩</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {ACCENT_COLORS.map((accent) => (
                    <button
                      key={accent.value}
                      onClick={() => handleTempUpdate({ accentColor: accent.value })}
                      className={`px-4 py-3 rounded-xl border-3 transition-all duration-300 hover:scale-105 flex items-center space-x-2 ${
                        tempCustomization.accentColor === accent.value
                          ? 'border-theme-accent bg-theme-primary/20'
                          : 'border-gray-500 bg-dark-surface hover:border-theme-primary/50'
                      }`}
                    >
                      <div 
                        className="w-4 h-4 rounded-full shadow-lg"
                        style={{ backgroundColor: accent.color }}
                      />
                      <span className="text-dark-text font-medium text-sm">{accent.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <div className="bg-dark-card backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-gray-500 sticky top-8">
            <div className="p-6 border-b-4 border-gray-500 bg-gradient-to-r from-dark-surface to-dark-muted rounded-t-3xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-theme-primary to-theme-secondary rounded-full flex items-center justify-center">
                  <EyeIcon size={16} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-dark-text">实时预览</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Blog Title Preview */}
              <div className="bg-dark-surface rounded-2xl p-4 border-2 border-gray-500">
                <div className="flex items-center space-x-3 mb-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})` }}
                  >
                    <span className="text-white text-sm">⚔️</span>
                  </div>
                  <h4 
                    className="text-lg font-bold text-dark-text"
                    style={{ fontFamily: currentFont.fontFamily }}
                  >
                    {tempCustomization.blogTitle}
                  </h4>
                </div>
                <p className="text-dark-text-secondary text-sm">博客标题预览</p>
              </div>

              {/* Theme Preview */}
              <div className="bg-dark-surface rounded-2xl p-4 border-2 border-gray-500">
                <div className="mb-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: currentTheme.primary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: currentTheme.secondary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: currentAccent.color }}
                    />
                  </div>
                  <p className="text-dark-text font-bold text-sm">{currentTheme.name}</p>
                </div>
                <p className="text-dark-text-secondary text-xs">主题色彩预览</p>
              </div>

              {/* Font Preview */}
              <div className="bg-dark-surface rounded-2xl p-4 border-2 border-gray-500">
                <div 
                  className="text-dark-text mb-2"
                  style={{ fontFamily: currentFont.fontFamily }}
                >
                  <div className="font-bold text-lg mb-1">文章标题示例</div>
                  <div className="text-sm">这是正文内容的字体预览效果。</div>
                </div>
                <p className="text-dark-text-secondary text-xs">{currentFont.name}</p>
              </div>

              {/* Background Preview */}
              <div className="bg-dark-surface rounded-2xl p-4 border-2 border-gray-500">
                <div className="mb-2">
                  <div className={`w-full h-12 rounded-lg bg-${tempCustomization.backgroundStyle} border border-gray-500`} />
                </div>
                <p className="text-dark-text font-bold text-sm">{currentBackground.name}</p>
                <p className="text-dark-text-secondary text-xs">{currentBackground.description}</p>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveAndExit}
                className="w-full bg-gradient-to-r from-theme-primary to-theme-secondary hover:from-theme-primary/80 hover:to-theme-secondary/80 text-white py-3 px-6 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center space-x-2"
              >
                <SaveIcon size={16} />
                <span>保存设置</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
