import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useCreateArticle, useUpdateArticle } from "../hooks/useQueries";
import CategorySelector from "./editor/CategorySelector";
import EditorForm from "./editor/EditorForm";
import EditorHeader from "./editor/EditorHeader";
import MarkdownEditor from "./editor/MarkdownEditor";
import MarkdownPreview from "./editor/MarkdownPreview";
import MarkdownToolbar from "./editor/MarkdownToolbar";

interface ArticleEditorProps {
  editingArticle?: {
    id: bigint;
    title: string;
    content: string;
    categories?: string[];
  };
  onClose: () => void;
}

export default function ArticleEditor({
  editingArticle,
  onClose,
}: ArticleEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();

  const isEditing = !!editingArticle;
  const isLoading = createArticle.isPending || updateArticle.isPending;

  useEffect(() => {
    if (editingArticle) {
      setTitle(editingArticle.title);
      setContent(editingArticle.content);
      setSelectedCategories(editingArticle.categories || []);
    }
  }, [editingArticle]);

  const insertMarkdown = (before: string, after = "", placeholder = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const textToInsert = selectedText || placeholder;

    const newText =
      content.substring(0, start) +
      before +
      textToInsert +
      after +
      content.substring(end);
    setContent(newText);

    setTimeout(() => {
      if (selectedText) {
        textarea.setSelectionRange(
          start + before.length,
          start + before.length + selectedText.length,
        );
      } else {
        textarea.setSelectionRange(
          start + before.length,
          start + before.length + placeholder.length,
        );
      }
      textarea.focus();
    }, 0);
  };

  const insertAtLineStart = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lines = content.split("\n");
    let currentPos = 0;
    let lineIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      if (currentPos + lines[i].length >= start) {
        lineIndex = i;
        break;
      }
      currentPos += lines[i].length + 1;
    }

    lines[lineIndex] = prefix + lines[lineIndex];
    const newContent = lines.join("\n");
    setContent(newContent);

    setTimeout(() => {
      textarea.setSelectionRange(start + prefix.length, start + prefix.length);
      textarea.focus();
    }, 0);
  };

  const insertCodeBlock = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    // Create code block template with selected text or placeholder
    const codeBlockTemplate = selectedText
      ? `\`\`\`\n${selectedText}\n\`\`\``
      : "```\n// 在这里输入代码\n```";

    const newText =
      content.substring(0, start) + codeBlockTemplate + content.substring(end);
    setContent(newText);

    setTimeout(() => {
      // Position cursor inside the code block
      if (selectedText) {
        // If there was selected text, position after it
        textarea.setSelectionRange(
          start + 4 + selectedText.length,
          start + 4 + selectedText.length,
        );
      } else {
        // Position cursor at the placeholder text
        textarea.setSelectionRange(start + 4, start + 4 + 15); // Select "// 在这里输入代码"
      }
      textarea.focus();
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case "b":
          e.preventDefault();
          insertMarkdown("**", "**", "粗体文本");
          break;
        case "i":
          e.preventDefault();
          insertMarkdown("*", "*", "斜体文本");
          break;
        case "k":
          e.preventDefault();
          insertMarkdown("[", "](https://)", "链接文本");
          break;
        case "`":
          e.preventDefault();
          insertMarkdown("`", "`", "代码");
          break;
        case "c":
          if (e.shiftKey) {
            e.preventDefault();
            insertCodeBlock();
          }
          break;
      }
    }
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      }
      return [...prev, category];
    });
  };

  const handleTogglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;

    try {
      const articleData = {
        title: title.trim(),
        content: content.trim(),
        categories: selectedCategories,
      };

      if (isEditing && editingArticle) {
        await updateArticle.mutateAsync({
          articleId: editingArticle.id,
          ...articleData,
        });
      } else {
        await createArticle.mutateAsync(articleData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving article:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-dark-card backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-gray-500">
        <EditorHeader
          isEditing={isEditing}
          isPreviewMode={isPreviewMode}
          onClose={onClose}
          onTogglePreview={handleTogglePreview}
        />

        <EditorForm
          title={title}
          onTitleChange={setTitle}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isEditing={isEditing}
          onClose={onClose}
        >
          {!isPreviewMode && (
            <MarkdownToolbar
              onInsertMarkdown={insertMarkdown}
              onInsertAtLineStart={insertAtLineStart}
              onInsertCodeBlock={insertCodeBlock}
              onInsertImage={(imageMarkdown) => {
                const textarea = textareaRef.current;
                if (!textarea) return;

                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;

                const newText = `${content.substring(0, start)}\n${imageMarkdown}\n${content.substring(end)}`;
                setContent(newText);

                setTimeout(() => {
                  const newCursorPos = start + imageMarkdown.length + 2;
                  textarea.setSelectionRange(newCursorPos, newCursorPos);
                  textarea.focus();
                }, 0);
              }}
            />
          )}

          {isPreviewMode ? (
            <MarkdownPreview content={content} />
          ) : (
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={20}
              className="w-full px-6 py-4 border-3 border-t-0 border-gray-500 rounded-b-2xl focus:outline-none focus:ring-4 focus:ring-dark-primary/30 focus:border-dark-primary bg-dark-surface resize-vertical text-lg leading-relaxed shadow-lg text-dark-text font-mono"
              placeholder={`在这里写下您的精彩内容...

支持 Markdown 格式：
**粗体** *斜体* ~~删除线~~
\`行内代码\` [链接](https://example.com)
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
          )}

          <CategorySelector
            selectedCategories={selectedCategories}
            onCategoryToggle={handleCategoryToggle}
          />
        </EditorForm>
      </div>
    </div>
  );
}
