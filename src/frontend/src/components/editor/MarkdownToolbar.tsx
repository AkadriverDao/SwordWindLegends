import {
  BoldIcon,
  CodeIcon,
  FileCodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  Loader2Icon,
  QuoteIcon,
  StrikethroughIcon,
} from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useFileUpload } from "../../blob-storage/FileStorage";

interface MarkdownButton {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  action: () => void;
  shortcut?: string;
  isLoading?: boolean;
}

interface MarkdownToolbarProps {
  onInsertMarkdown: (
    before: string,
    after?: string,
    placeholder?: string,
  ) => void;
  onInsertAtLineStart: (prefix: string) => void;
  onInsertCodeBlock: () => void;
  onInsertImage?: (imageMarkdown: string) => void;
}

export default function MarkdownToolbar({
  onInsertMarkdown,
  onInsertAtLineStart,
  onInsertCodeBlock,
  onInsertImage,
}: MarkdownToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading } = useFileUpload();
  const [, setUploadProgress] = useState(0);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("请选择图片文件（JPG、PNG、GIF 等）");
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("图片大小不能超过 10MB");
      return;
    }

    try {
      setUploadProgress(0);
      const path = `articles/images/${Date.now()}_${file.name}`;
      const result = await uploadFile(path, file, (percentage) => {
        setUploadProgress(percentage);
      });

      const imageMarkdown = `![${file.name}](${result.url})`;

      if (onInsertImage) {
        onInsertImage(imageMarkdown);
      } else {
        // Fallback: insert as markdown with newlines
        onInsertMarkdown("\n", "\n", imageMarkdown);
      }

      toast.success("图片上传成功");
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error(
        error instanceof Error ? error.message : "图片上传失败，请重试",
      );
    } finally {
      setUploadProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  const markdownButtons: MarkdownButton[] = [
    {
      icon: BoldIcon,
      label: "粗体",
      shortcut: "Ctrl+B",
      action: () => onInsertMarkdown("**", "**", "粗体文本"),
    },
    {
      icon: ItalicIcon,
      label: "斜体",
      shortcut: "Ctrl+I",
      action: () => onInsertMarkdown("*", "*", "斜体文本"),
    },
    {
      icon: StrikethroughIcon,
      label: "删除线",
      action: () => onInsertMarkdown("~~", "~~", "删除线文本"),
    },
    {
      icon: CodeIcon,
      label: "行内代码",
      shortcut: "Ctrl+`",
      action: () => onInsertMarkdown("`", "`", "代码"),
    },
    {
      icon: FileCodeIcon,
      label: "代码块",
      shortcut: "Ctrl+Shift+C",
      action: () => onInsertCodeBlock(),
    },
    {
      icon: Heading1Icon,
      label: "一级标题",
      action: () => onInsertAtLineStart("# "),
    },
    {
      icon: Heading2Icon,
      label: "二级标题",
      action: () => onInsertAtLineStart("## "),
    },
    {
      icon: Heading3Icon,
      label: "三级标题",
      action: () => onInsertAtLineStart("### "),
    },
    {
      icon: LinkIcon,
      label: "链接",
      shortcut: "Ctrl+K",
      action: () => onInsertMarkdown("[", "](https://)", "链接文本"),
    },
    {
      icon: QuoteIcon,
      label: "引用",
      action: () => onInsertAtLineStart("> "),
    },
    {
      icon: ImageIcon,
      label: "图片",
      action: () => triggerFileInput(),
      isLoading: isUploading,
    },
  ];

  return (
    <div className="bg-dark-surface rounded-t-2xl border-3 border-b-0 border-gray-500 p-3">
      <div className="flex items-center space-x-1 flex-wrap gap-2">
        <div className="flex items-center space-x-1 mr-3">
          <span className="text-dark-text-secondary text-sm font-medium">
            Markdown:
          </span>
        </div>
        {markdownButtons.map((button) => {
          const IconComponent = button.icon;
          return (
            <button
              key={button.label}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                button.action();
              }}
              disabled={button.isLoading}
              className="p-2 hover:bg-dark-hover rounded-lg transition-all duration-300 border border-gray-500 bg-dark-card shadow-sm hover:shadow-md hover:scale-105 group disabled:opacity-50 disabled:cursor-not-allowed"
              title={`${button.label}${button.shortcut ? ` (${button.shortcut})` : ""}`}
            >
              {button.isLoading ? (
                <Loader2Icon
                  size={16}
                  className="text-dark-text animate-spin"
                />
              ) : (
                <IconComponent
                  size={16}
                  className="text-dark-text group-hover:text-theme-primary"
                />
              )}
            </button>
          );
        })}

        {/* Hidden file input for image upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          data-ocid="markdown.image_input"
        />
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
