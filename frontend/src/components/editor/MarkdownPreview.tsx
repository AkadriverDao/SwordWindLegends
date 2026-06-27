import React from 'react';
import { parseMarkdown } from '../../utils/markdown';

interface MarkdownPreviewProps {
  content: string;
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="w-full px-6 py-4 border-3 border-t-0 border-gray-500 rounded-b-2xl bg-dark-surface min-h-[500px] overflow-auto shadow-lg">
      <div className="prose prose-lg max-w-none">
        {content ? parseMarkdown(content) : (
          <p className="text-dark-text-secondary italic">预览区域 - 开始输入以查看渲染效果</p>
        )}
      </div>
    </div>
  );
}
