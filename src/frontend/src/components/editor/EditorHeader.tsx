import { ArrowLeftIcon, EditIcon, EyeIcon } from "lucide-react";
import React from "react";

interface EditorHeaderProps {
  isEditing: boolean;
  isPreviewMode: boolean;
  onClose: () => void;
  onTogglePreview: () => void;
}

export default function EditorHeader({
  isEditing,
  isPreviewMode,
  onClose,
  onTogglePreview,
}: EditorHeaderProps) {
  return (
    <div className="p-6 border-b-4 border-gray-500 bg-gradient-to-r from-dark-surface to-dark-muted rounded-t-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="p-3 hover:bg-dark-hover rounded-full transition-all duration-300 border-2 border-gray-500 bg-dark-card shadow-lg hover:shadow-xl hover:scale-110"
          >
            <ArrowLeftIcon size={20} className="text-dark-text" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-dark-text flex items-center">
              {isEditing ? "✏️ 编辑经历" : "✨ 创作新经历"}
            </h2>
            <p className="text-dark-text-secondary font-medium">
              {isEditing ? "修改您的精彩经历" : "记录您的奇思妙想"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onTogglePreview}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
            isPreviewMode
              ? "bg-gradient-to-r from-dark-success to-dark-primary text-white"
              : "bg-gradient-to-r from-theme-primary to-theme-secondary text-white"
          }`}
        >
          {isPreviewMode ? <EditIcon size={16} /> : <EyeIcon size={16} />}
          <span>{isPreviewMode ? "编辑模式" : "预览模式"}</span>
        </button>
      </div>
    </div>
  );
}
