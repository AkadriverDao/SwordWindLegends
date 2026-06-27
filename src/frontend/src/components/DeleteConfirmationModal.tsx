import { AlertTriangleIcon, TrashIcon, XIcon } from "lucide-react";
import React from "react";
import { createPortal } from "react-dom";

interface DeleteConfirmationModalProps {
  articleTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export default function DeleteConfirmationModal({
  articleTitle,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteConfirmationModalProps) {
  const modalContent = (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: 999999 }}
    >
      <div className="bg-dark-card backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-dark-error w-full max-w-md animate-bounce-fun">
        {/* Header */}
        <div className="p-6 border-b-4 border-dark-border bg-gradient-to-r from-dark-error/20 to-dark-warning/20 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-dark-error to-dark-warning rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <AlertTriangleIcon size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-dark-text">⚠️ 确认删除</h3>
                <p className="text-dark-text-secondary font-medium">
                  此操作无法撤销
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onCancel}
              disabled={isDeleting}
              className="p-2 hover:bg-dark-hover rounded-full transition-all duration-300 border-2 border-dark-accent bg-dark-card shadow-lg hover:shadow-xl hover:scale-110 disabled:opacity-50"
            >
              <XIcon size={18} className="text-dark-text" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Warning Message */}
          <div className="bg-gradient-to-r from-dark-warning/20 to-dark-error/20 rounded-2xl p-6 border-3 border-dark-warning">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-dark-warning to-dark-error rounded-full flex items-center justify-center shadow-lg shrink-0 mt-1">
                <span className="text-white text-xl">🗑️</span>
              </div>
              <div>
                <p className="text-dark-text font-bold text-lg mb-2">
                  您确定要删除这篇经历吗？
                </p>
                <div className="bg-dark-card rounded-xl p-3 border-2 border-dark-primary/30 mb-3">
                  <p className="text-dark-text font-medium">
                    📝 "{articleTitle}"
                  </p>
                </div>
                <p className="text-dark-text-secondary font-medium">
                  💥 删除后将永久消失，无法恢复！
                </p>
              </div>
            </div>
          </div>

          {/* Cute Warning Icons */}
          <div className="flex justify-center space-x-4">
            <div className="animate-bounce" style={{ animationDelay: "0s" }}>
              <span className="text-3xl">😱</span>
            </div>
            <div className="animate-bounce" style={{ animationDelay: "0.2s" }}>
              <span className="text-3xl">💔</span>
            </div>
            <div className="animate-bounce" style={{ animationDelay: "0.4s" }}>
              <span className="text-3xl">😢</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1 px-6 py-3 border-3 border-dark-border text-dark-text rounded-2xl hover:bg-dark-hover transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50"
            >
              🤔 再想想
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-dark-error to-dark-warning hover:from-dark-error/80 hover:to-dark-warning/80 text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>删除中...</span>
                </>
              ) : (
                <>
                  <TrashIcon size={16} />
                  <span>💥 确认删除</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gradient-to-r from-dark-error/10 to-dark-warning/10 border-t-4 border-dark-border rounded-b-3xl">
          <div className="text-center">
            <p className="text-dark-text-secondary text-sm font-medium">
              💡 提示：删除经历不会影响您的代币余额
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Portal the modal to document.body to ensure it's always on top
  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
}
