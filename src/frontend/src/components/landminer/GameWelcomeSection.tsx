import { PickaxeIcon } from "lucide-react";
import React from "react";

export default function GameWelcomeSection() {
  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white border-3 border-gray-500 mb-8">
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shadow-lg shrink-0">
          <PickaxeIcon size={32} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-4 global-font">
            🌟 欢迎来到土地矿工世界
          </h3>
          <p className="text-white/90 text-lg leading-relaxed global-font mb-6">
            在这个神秘的世界中，有1000块空置土地等待勇敢的矿工来探索。点击任意土地后将立即开始10秒挖矿倒计时，系统将生成挖矿结果。每块土地都可以无限次挖矿，每次都有新的机会！挖矿结果将通过弹窗清晰显示，包括具体的金币数量和实时余额更新。
          </p>

          {/* Game Rules Section */}
          <div className="bg-white/10 rounded-xl p-4 mb-4">
            <h4 className="text-xl font-bold mb-3 global-font flex items-center">
              📋 游戏规则详解
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div className="bg-white/10 rounded-lg p-3">
                  <h5 className="font-bold mb-2 flex items-center">
                    🏞️ 土地挖矿机制
                  </h5>
                  <ul className="text-white/90 space-y-1">
                    <li>• 游戏包含1000块空置土地，每块都有唯一编号</li>
                    <li>• 点击任意土地即可开始挖矿，无需占领</li>
                    <li>• 点击后立即开始10秒挖矿倒计时</li>
                    <li>• 每块土地可以无限次挖矿，每次都有新机会</li>
                  </ul>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <h5 className="font-bold mb-2 flex items-center">
                    ⛏️ 游戏挖矿系统
                  </h5>
                  <ul className="text-white/90 space-y-1">
                    <li>• 所有挖矿结果由系统随机生成</li>
                    <li>• 角色状态、金币数量完全由系统管理</li>
                    <li>• 前端不保存任何游戏数据，实时从系统获取</li>
                    <li>• 每次挖矿都是独立的随机事件</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-white/10 rounded-lg p-3">
                  <h5 className="font-bold mb-2 flex items-center">
                    🎲 概率系统
                  </h5>
                  <ul className="text-white/90 space-y-1">
                    <li>• 30% 概率什么都没挖到</li>
                    <li>• 65% 概率获得1-10枚金币</li>
                    <li>• 5% 概率挖到黑暗物质</li>
                    <li>• 所有概率由系统算法控制</li>
                  </ul>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <h5 className="font-bold mb-2 flex items-center">
                    💰 实时金币显示
                  </h5>
                  <ul className="text-white/90 space-y-1">
                    <li>• 挖矿结果通过弹窗清晰显示</li>
                    <li>• 获得金币时突出显示具体数量</li>
                    <li>• 金币余额实时更新</li>
                    <li>• 每次挖矿后立即刷新最新余额</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Mining Results Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/10 rounded-lg p-3">
              <span className="text-lg mb-2 block">💰</span>
              <p className="font-bold">挖到金币</p>
              <p className="text-white/80">
                随机生成1-10枚金币奖励，弹窗显示具体数量，余额立即更新
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <span className="text-lg mb-2 block">🕳️</span>
              <p className="font-bold">空手而归</p>
              <p className="text-white/80">这次运气不好，可以再次挖矿</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <span className="text-lg mb-2 block">💀</span>
              <p className="font-bold">黑暗物质</p>
              <p className="text-white/80">
                角色死亡，金币清零，需要复活才能继续
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
