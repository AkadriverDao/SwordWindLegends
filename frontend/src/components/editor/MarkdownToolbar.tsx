import React from 'react';
import { BoldIcon, ItalicIcon, CodeIcon, LinkIcon, QuoteIcon, Heading1Icon, Heading2Icon, Heading3Icon, StrikethroughIcon, FileCodeIcon } from 'lucide-react';

interface MarkdownButton {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  action: () => void;
  shortcut?: string;
}

interface MarkdownToolbarProps {
  onInsertMarkdown: (before: string, after?: string, placeholder?: string) => void;
  onInsertAtLineStart: (prefix: string) => void;
  onInsertCodeBlock: () => void;
}

export default function MarkdownToolbar({ onInsertMarkdown, onInsertAtLineStart, onInsertCodeBlock }: MarkdownToolbarProps) {
  const markdownButtons: MarkdownButton[] = [
    {
      icon: BoldIcon,
      label: '粗体',
      shortcut: 'Ctrl+B',
      action: () => onInsertMarkdown('**', '**', '粗体文本'),
    },
    {
      icon: ItalicIcon,
      label: '斜体',
      shortcut: 'Ctrl+I',
      action: () => onInsertMarkdown('*', '*', '斜体文本'),
    },
    {
      icon: StrikethroughIcon,
      label: '删除线',
      action: () => onInsertMarkdown('~~', '~~', '删除线文本'),
    },
    {
      icon: CodeIcon,
      label: '行内代码',
      shortcut: 'Ctrl+`',
      action: () => onInsertMarkdown('`', '`', '代码'),
    },
    {
      icon: FileCodeIcon,
      label: '代码块',
      shortcut: 'Ctrl+Shift+C',
      action: () => onInsertCodeBlock(),
    },
    {
      icon: Heading1Icon,
      label: '一级标题',
      action: () => onInsertAtLineStart('# '),
    },
    {
      icon: Heading2Icon,
      label: '二级标题',
      action: () => onInsertAtLineStart('## '),
    },
    {
      icon: Heading3Icon,
      label: '三级标题',
      action: () => onInsertAtLineStart('### '),
    },
    {
      icon: LinkIcon,
      label: '链接',
      shortcut: 'Ctrl+K',
      action: () => onInsertMarkdown('[', '](https://)', '链接文本'),
    },
    {
      icon: QuoteIcon,
      label: '引用',
      action: () => onInsertAtLineStart('> '),
    },
  ];

  return (
    <div className="bg-dark-surface rounded-t-2xl border-3 border-b-0 border-gray-500 p-3">
      <div className="flex items-center space-x-1 flex-wrap gap-2">
        <div className="flex items-center space-x-1 mr-3">
          <span className="text-dark-text-secondary text-sm font-medium">Markdown:</span>
        </div>
        {markdownButtons.map((button, index) => {
          const IconComponent = button.icon;
          return (
            <button
              key={index}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                button.action();
              }}
              className="p-2 hover:bg-dark-hover rounded-lg transition-all duration-300 border border-gray-500 bg-dark-card shadow-sm hover:shadow-md hover:scale-105 group"
              title={`${button.label}${button.shortcut ? ` (${button.shortcut})` : ''}`}
            >
              <IconComponent size={16} className="text-dark-text group-hover:text-theme-primary" />
            </button>
          );
        })}
      </div>
      
      {/* Markdown Help */}
      <div className="mt-3 pt-3 border-t border-gray-500">
        <div className="flex items-center space-x-4 text-xs text-dark-text-secondary flex-wrap gap-2">
          <span>💡 快捷键:</span>
          <span>Ctrl+B 粗体</span>
          <span>Ctrl+I 斜体</span>
          <span>Ctrl+K 链接</span>
          <span>Ctrl+` 行内代码</span>
          <span>Ctrl+Shift+C 代码块</span>
        </div>
      </div>
    </div>
  );
}
