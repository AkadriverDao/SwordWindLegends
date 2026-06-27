import type React from "react";

interface EditorFormProps {
  title: string;
  onTitleChange: (title: string) => void;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  isEditing: boolean;
  onClose: () => void;
}

export default function EditorForm({
  title,
  onTitleChange,
  children,
  onSubmit,
  isLoading,
  isEditing,
  onClose,
}: EditorFormProps) {
  return (
    <form onSubmit={onSubmit} className="p-8 space-y-6">
      <div>
        <label
          htmlFor="title"
          className="flex items-center text-lg font-bold text-dark-text mb-3"
        >
          📝 标题
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full px-6 py-4 border-3 border-gray-500 rounded-2xl focus:outline-none focus:ring-4 focus:ring-dark-primary/30 focus:border-dark-primary bg-dark-surface text-lg font-medium shadow-lg text-dark-text"
          placeholder="请输入精彩的标题..."
          required
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="flex items-center text-lg font-bold text-dark-text mb-3"
        >
          📖 内容
        </label>
        {children}
      </div>

      <div className="flex space-x-4 pt-6">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-6 py-3 border-3 border-gray-500 text-dark-text rounded-2xl hover:bg-dark-hover transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-dark-success to-dark-primary hover:from-dark-success/80 hover:to-dark-primary/80 text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              <span>{isEditing ? "更新中..." : "保存中..."}</span>
            </>
          ) : (
            <span>{isEditing ? "✅ 更新经历" : "🚀 发布经历"}</span>
          )}
        </button>
      </div>
    </form>
  );
}
