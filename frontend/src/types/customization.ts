export interface BlogCustomization {
  themeColor: string;
  fontStyle: string;
  backgroundStyle: string;
  blogTitle: string;
  accentColor: string;
  textSize: string;
  borderRadius: string;
}

export const DEFAULT_CUSTOMIZATION: BlogCustomization = {
  themeColor: 'blue-purple',
  fontStyle: 'serif',
  backgroundStyle: 'gradient',
  blogTitle: 'Sword Wind Legends',
  accentColor: 'none',
  textSize: 'medium',
  borderRadius: 'rounded',
};

export const THEME_COLORS = [
  { name: '经典蓝紫', value: 'blue-purple', primary: '#6366f1', secondary: '#8b5cf6' },
  { name: '粉红梦幻', value: 'pink-purple', primary: '#ec407a', secondary: '#9c27b0' },
  { name: '绿色清新', value: 'green-blue', primary: '#10b981', secondary: '#6366f1' },
  { name: '橙色活力', value: 'orange-red', primary: '#f59e0b', secondary: '#ef4444' },
  { name: '紫色神秘', value: 'purple-pink', primary: '#8b5cf6', secondary: '#ec407a' },
  { name: '青色科技', value: 'cyan-blue', primary: '#06b6d4', secondary: '#3b82f3' },
];

export const FONT_STYLES = [
  { name: '默认', value: 'default', description: '标准字体', fontFamily: 'system-ui' },
  { name: '衬线', value: 'serif', description: '优雅字体', fontFamily: 'Georgia, serif' },
  { name: '无衬线', value: 'sans', description: '现代字体', fontFamily: 'Inter, sans-serif' },
  { name: '等宽', value: 'mono', description: '代码字体', fontFamily: 'JetBrains Mono, monospace' },
];

export const BACKGROUND_STYLES = [
  { name: '深色渐变', value: 'gradient', description: '柔和的深色渐变背景' },
  { name: '纯色背景', value: 'solid', description: '简洁的纯色背景' },
  { name: '几何图案', value: 'pattern', description: '精美的几何图案背景' },
  { name: '星空背景', value: 'starry', description: '梦幻的星空背景' },
];

export const ACCENT_COLORS = [
  { name: '无色', value: 'none', color: 'transparent' },
  { name: '琥珀金', value: 'amber', color: '#f59e0b' },
  { name: '翡翠绿', value: 'emerald', color: '#10b981' },
  { name: '玫瑰红', value: 'rose', color: '#f43f5e' },
  { name: '紫罗兰', value: 'violet', color: '#8b5cf6' },
  { name: '天空蓝', value: 'sky', color: '#0ea5e9' },
];
