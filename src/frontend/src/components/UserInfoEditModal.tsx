import { SaveIcon, UserIcon, XIcon } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useSaveUserProfile } from "../hooks/useQueries";
import type { UserProfile } from "../types/backend";

interface UserInfoEditModalProps {
  userProfile: UserProfile;
  onClose: () => void;
}

export default function UserInfoEditModal({
  userProfile,
  onClose,
}: UserInfoEditModalProps) {
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email ?? "");
  const saveProfile = useSaveUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        email: email.trim() || undefined,
      });
      onClose();
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: 999999 }}
    >
      <div className="bg-dark-card backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-dark-accent w-full max-w-md">
        {/* Header */}
        <div className="p-6 border-b-4 border-dark-border bg-gradient-to-r from-dark-surface to-dark-muted rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-dark-primary to-dark-secondary rounded-full flex items-center justify-center shadow-lg">
                <UserIcon size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-dark-text">
                  ✏️ 编辑用户信息
                </h3>
                <p className="text-dark-text-secondary font-medium">
                  修改您的个人资料
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={saveProfile.isPending}
              className="p-2 hover:bg-dark-hover rounded-full transition-all duration-300 border-2 border-dark-accent bg-dark-card shadow-lg hover:shadow-xl hover:scale-110 disabled:opacity-50 disabled:transform-none"
            >
              <XIcon size={18} className="text-dark-text" />
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Profile Icon */}
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-dark-primary to-dark-secondary flex items-center justify-center shadow-2xl border-4 border-dark-accent mx-auto mb-4">
              <UserIcon size={40} className="text-white" />
            </div>
            <p className="text-dark-text-secondary font-medium">您的头像</p>
          </div>

          {/* Name Field */}
          <div className="space-y-3">
            <label
              htmlFor="user-name"
              className="flex items-center text-lg font-bold text-dark-text"
            >
              ✨ 用户名称
            </label>
            <input
              id="user-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-6 py-4 border-3 border-dark-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-dark-primary/30 focus:border-dark-primary bg-dark-surface text-lg font-medium shadow-lg text-dark-text"
              placeholder="请输入您的用户名称"
              required
            />
          </div>

          {/* Email Field (optional, used for hide-notification emails) */}
          <div className="space-y-3">
            <label
              htmlFor="user-email"
              className="flex items-center text-lg font-bold text-dark-text"
            >
              📧 邮箱
              <span className="ml-2 text-sm font-medium text-dark-text-secondary">
                （选填，用于接收文章隐藏通知）
              </span>
            </label>
            <input
              id="user-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 border-3 border-dark-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-dark-primary/30 focus:border-dark-primary bg-dark-surface text-lg font-medium shadow-lg text-dark-text"
              placeholder="可选，例如 you@example.com"
              data-ocid="user.email.input"
            />
          </div>

          {/* Cute Info */}
          <div className="bg-gradient-to-r from-dark-primary/20 to-dark-secondary/20 rounded-2xl p-4 border-3 border-dark-primary/30">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">💡</span>
              <p className="text-dark-text font-medium">
                这个名称将在您的经历和排行榜中显示
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saveProfile.isPending}
              className="flex-1 px-6 py-3 border-3 border-dark-border text-dark-text rounded-2xl hover:bg-dark-hover transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:transform-none"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={saveProfile.isPending || !name.trim()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-dark-success to-dark-primary hover:from-dark-success/80 hover:to-dark-primary/80 text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2"
            >
              {saveProfile.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>保存中...</span>
                </>
              ) : (
                <>
                  <SaveIcon size={16} />
                  <span>✅ 保存</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 bg-gradient-to-r from-dark-success/10 to-dark-primary/10 border-t-4 border-dark-border rounded-b-3xl">
          <div className="text-center">
            <p className="text-dark-text-secondary text-sm font-medium">
              🎉 更新信息后将立即生效
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
