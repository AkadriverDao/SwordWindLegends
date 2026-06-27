import React, { useState } from 'react';
import { ArrowLeft, Play, Plus, X, Upload } from 'lucide-react';
import { useIsSuperUser } from '../hooks/useUserQueries';
import { useGetAllGameMods, useAddGameMod } from '../hooks/useGameModQueries';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';

interface GameModPageProps {
  navigate: (route: '/' | '/profile' | '/leaderboard' | '/customize' | '/article' | '/management' | '/category' | '/landminer' | '/goldexchange' | '/game-mod' | '/game-mod-detail', params?: { articleId?: string; categoryName?: string; gameModId?: string }) => void;
}

export default function GameModPage({ navigate }: GameModPageProps) {
  const { isSuperUser } = useIsSuperUser();
  const { data: gameModsData, isLoading } = useGetAllGameMods();
  const addGameMod = useAddGameMod();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGameClick = (gameId: bigint) => {
    console.log(`游戏点击: ${gameId}`);
    navigate('/game-mod-detail', { gameModId: gameId.toString() });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过5MB');
        return;
      }
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !imageFile) {
      alert('请填写所有必填字段并上传图片');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert image to base64 data URL
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageUrl = reader.result as string;
        
        await addGameMod.mutateAsync({
          title: formData.title,
          description: formData.description,
          imageUrl,
          link: formData.link || '#',
        });

        // Reset form
        setFormData({ title: '', description: '', link: '' });
        setImageFile(null);
        setImagePreview(null);
        setShowAddDialog(false);
        setIsSubmitting(false);
      };
      reader.readAsDataURL(imageFile);
    } catch (error) {
      console.error('添加游戏失败:', error);
      alert('添加游戏失败，请重试');
      setIsSubmitting(false);
    }
  };

  const handleCloseDialog = () => {
    if (!isSubmitting) {
      setShowAddDialog(false);
      setFormData({ title: '', description: '', link: '' });
      setImageFile(null);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(null);
    }
  };

  // Cleanup preview URL on unmount
  React.useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 text-dark-text-secondary hover:text-dark-text transition-colors duration-300 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="font-medium">返回首页</span>
      </button>

      {/* Page Container */}
      <div className="bg-dark-card border-4 border-theme-accent rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-theme-primary to-theme-secondary px-6 py-6 border-b-4 border-theme-accent">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
                <span className="text-4xl">🎮</span>
                <span>游戏展示区</span>
              </h1>
              <p className="text-white/80 mt-2 text-sm">探索精彩的游戏世界，开启你的冒险之旅</p>
            </div>
            {isSuperUser && (
              <Button
                onClick={() => setShowAddDialog(true)}
                className="bg-white hover:bg-gray-100 text-theme-primary font-bold"
              >
                <Plus size={20} className="mr-2" />
                添加新游戏
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-dark-text-secondary">加载中...</p>
            </div>
          ) : (
            <>
              {/* Games Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gameModsData?.map(([id, game]) => (
                  <div
                    key={id.toString()}
                    className="group bg-dark-surface border-3 border-gray-500 hover:border-theme-accent rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl"
                  >
                    {/* Game Cover Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800">
                      <img
                        src={game.imageUrl}
                        alt={game.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-theme-primary/90 rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                          <Play size={32} className="text-white" fill="white" />
                        </div>
                      </div>
                    </div>

                    {/* Game Info */}
                    <div className="p-5 space-y-3">
                      <h3 className="text-xl font-bold text-dark-text group-hover:text-theme-primary transition-colors duration-300">
                        {game.title}
                      </h3>
                      <p className="text-sm text-dark-text-secondary leading-relaxed line-clamp-2">
                        {game.description}
                      </p>
                      <div className="pt-2">
                        <Button
                          onClick={() => handleGameClick(id)}
                          className="w-full bg-gradient-to-r from-theme-primary to-theme-secondary hover:from-theme-primary/90 hover:to-theme-secondary/90 text-white font-medium"
                        >
                          查看详情
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coming Soon Notice */}
              <div className="mt-8 bg-gradient-to-r from-theme-primary/20 to-theme-secondary/20 border-3 border-theme-accent/50 rounded-2xl p-6 text-center">
                <p className="text-lg font-bold text-dark-text mb-2">
                  🚀 更多精彩游戏即将推出
                </p>
                <p className="text-sm text-dark-text-secondary">
                  我们将持续更新和优化游戏内容，为您带来更好的游戏体验
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Game Dialog */}
      <Dialog open={showAddDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="bg-dark-card border-4 border-theme-accent max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-700 flex-shrink-0">
            <DialogTitle className="text-2xl font-bold text-dark-text flex items-center space-x-2">
              <Plus size={24} className="text-theme-primary" />
              <span>添加新游戏</span>
            </DialogTitle>
            <DialogDescription className="text-dark-text-secondary">
              填写游戏信息并上传封面图片
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="px-6 py-4">
              <form id="add-game-form" onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-dark-text font-medium">
                    游戏标题 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="输入游戏标题"
                    className="bg-dark-surface border-gray-500 text-dark-text"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-dark-text font-medium">
                    游戏描述 <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="输入游戏描述"
                    className="bg-dark-surface border-gray-500 text-dark-text min-h-[100px]"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Link */}
                <div className="space-y-2">
                  <Label htmlFor="link" className="text-dark-text font-medium">
                    游戏链接
                  </Label>
                  <Input
                    id="link"
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="输入游戏链接（可选）"
                    className="bg-dark-surface border-gray-500 text-dark-text"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-dark-text font-medium">
                    封面图片 <span className="text-red-500">*</span>
                  </Label>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <label
                        htmlFor="image"
                        className="flex items-center space-x-2 px-4 py-2 bg-theme-primary hover:bg-theme-primary/90 text-white rounded-lg cursor-pointer transition-colors"
                      >
                        <Upload size={20} />
                        <span>选择图片</span>
                      </label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={isSubmitting}
                      />
                      {imageFile && (
                        <span className="text-sm text-dark-text-secondary">{imageFile.name}</span>
                      )}
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="relative w-full aspect-[4/3] bg-dark-surface rounded-lg overflow-hidden border-2 border-gray-500">
                        <img
                          src={imagePreview}
                          alt="预览"
                          className="w-full h-full object-cover"
                        />
                        {!isSubmitting && (
                          <button
                            type="button"
                            onClick={() => {
                              setImageFile(null);
                              if (imagePreview) {
                                URL.revokeObjectURL(imagePreview);
                              }
                              setImagePreview(null);
                            }}
                            className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-dark-text-secondary">
                      支持 JPG、PNG 格式，文件大小不超过 5MB
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </ScrollArea>

          {/* Actions - Fixed at bottom outside ScrollArea */}
          <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-700 bg-dark-card flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseDialog}
              disabled={isSubmitting}
              className="border-gray-500 text-dark-text hover:bg-dark-surface"
            >
              取消
            </Button>
            <Button
              type="submit"
              form="add-game-form"
              disabled={isSubmitting || !formData.title.trim() || !formData.description.trim() || !imageFile}
              className="bg-theme-primary hover:bg-theme-primary/90 text-white"
            >
              {isSubmitting ? '添加中...' : '添加游戏'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
