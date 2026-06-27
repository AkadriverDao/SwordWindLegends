import React, { useRef } from 'react';
import MarkdownToolbar from './MarkdownToolbar';

interface MarkdownEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export default function MarkdownEditor({ content, onContentChange, onKeyDown }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        onKeyDown={onKeyDown}
        rows={20}
        className="w-full px-6 py-4 border-3 border-t-0 border-gray-500 rounded-b-2xl focus:outline-none focus:ring-4 focus:ring-dark-primary/30 focus:border-dark-primary bg-dark-surface resize-vertical text-lg leading-relaxed shadow-lg text-dark-text font-mono"
        placeholder={`在这里写下您的精彩内容...

支持 Markdown 格式：
**粗体** *斜体* ~~删除线~~
\`代码\` [链接](https://example.com)
> 引用文本

# 一级标题
## 二级标题
### 三级标题

\`\`\`
多行代码块
支持语法高亮
保留所有换行和缩进
\`\`\`

- 无序列表项
1. 有序列表项

---

更多格式请参考 Markdown 语法指南`}
        required
      />
    </div>
  );
}
