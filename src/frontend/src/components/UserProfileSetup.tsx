import type React from "react";
import { useState } from "react";
import { useSaveUserProfile } from "../hooks/useQueries";

export default function UserProfileSetup() {
  const [name, setName] = useState("");
  const saveProfile = useSaveUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      // Only save the name since other properties don't exist in UserProfile
      saveProfile.mutate({
        name: name.trim(),
      });
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-dark-card backdrop-blur-sm rounded-3xl shadow-2xl p-12 border-4 border-dark-accent">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-dark-success to-dark-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <div className="sword-logo text-white text-3xl">⚔️</div>
          </div>
          <h2 className="text-3xl font-bold text-dark-text mb-4">
            ✨ 设置个人页面
          </h2>
          <p className="text-dark-text-secondary text-lg font-medium">
            请输入您的信息以开始使用
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="flex items-center text-lg font-bold text-dark-text mb-3"
            >
              👤 姓名
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-6 py-4 border-3 border-dark-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-dark-primary/30 focus:border-dark-primary bg-dark-surface text-lg font-medium shadow-lg text-dark-text"
              placeholder="请输入您的姓名"
              required
            />
          </div>

          <div className="bg-dark-primary/20 rounded-xl p-4 border-2 border-dark-primary/30">
            <p className="text-dark-primary text-sm font-medium flex items-center">
              💡{" "}
              <span className="ml-2">
                博客标题默认为"Sword Wind
                Legends"，您可以在个人页面中进行自定义设置
              </span>
            </p>
          </div>

          <button
            type="submit"
            disabled={saveProfile.isPending || !name.trim()}
            className="w-full bg-gradient-to-r from-dark-secondary to-dark-primary hover:from-dark-secondary/80 hover:to-dark-primary/80 text-white py-4 px-8 rounded-2xl font-bold transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl hover:scale-105 disabled:transform-none text-lg"
          >
            {saveProfile.isPending ? "🔄 保存中..." : "🚀 开始使用"}
          </button>
        </form>
      </div>
    </div>
  );
}
