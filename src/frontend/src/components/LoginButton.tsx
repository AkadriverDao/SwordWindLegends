import React from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginButton() {
  const { login, loginStatus } = useInternetIdentity();

  const disabled = loginStatus === "logging-in";
  const text = loginStatus === "logging-in" ? "🔄 登录中..." : "🚀 登录";

  const handleLogin = () => {
    try {
      login();
    } catch (error: any) {
      console.error("Login error:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      disabled={disabled}
      className="px-6 py-3 rounded-2xl transition-all duration-300 font-bold border-3 shadow-lg hover:shadow-xl hover:scale-105 bg-gradient-to-r from-dark-success to-dark-primary hover:from-dark-success/80 hover:to-dark-primary/80 text-white border-dark-success disabled:opacity-50"
    >
      {text}
    </button>
  );
}
