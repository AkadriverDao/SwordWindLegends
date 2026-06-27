import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, Gamepad2, Edit, X, Upload } from 'lucide-react';
import { useGetGameModById, useUpdateGameMod } from '../hooks/useGameModQueries';
import { useIsSuperUser } from '../hooks/useUserQueries';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';

interface GameModDetailPageProps {
  gameModId?: string;
  navigate: (route: '/' | '/profile' | '/leaderboard' | '/customize' | '/article' | '/management' | '/category' | '/landminer' | '/goldexchange' | '/game-mod' | '/game-mod-detail', params?: { articleId?: string; categoryName?: string; gameModId?: string }) => void;
}

export default function GameModDetailPage({ gameModId, navigate }: GameModDetailPageProps) {
  const { isSuperUser } = useIsSuperUser();
  const gameIdBigInt = gameModId ? BigInt(gameModId) : undefined;
  const { data: gameMod, isLoading, error } = useGetGameModById(gameIdBigInt);
  const updateGameMod = useUpdateGameMod();

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditClick = () => {
    if (gameMod) {
      setFormData({
        title: gameMod.title,
        description: gameMod.description,
        link: gameMod.link,
      });
      setImagePreview(gameMod.imageUrl);
      setShowEditDialog(true);
    }
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
    
    if (!formData.title.trim() || !formData.description.trim() || !gameIdBigInt) {
      alert('请填写所有必填字段');
      return;
    }

    setIsSubmitting(true);

    try {
      if (imageFile) {
        // Convert new image to base64 data URL
        const reader = new FileReader();
        reader.onloadend = async () => {
          const imageUrl = reader.result as string;
          
          await updateGameMod.mutateAsync({
            gameId: gameIdBigInt,
            title: formData.title,
            description: formData.description,
            imageUrl,
            link: formData.link || '#',
          });

          setImageFile(null);
          setImagePreview(null);
          setShowEditDialog(false);
          setIsSubmitting(false);
        };
        reader.readAsDataURL(imageFile);
      } else {
        // Use existing image URL
        await updateGameMod.mutateAsync({
          gameId: gameIdBigInt,
          title: formData.title,
          description: formData.description,
          imageUrl: gameMod?.imageUrl || '',
          link: formData.link || '#',
        });

        setShowEditDialog(false);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('更新游戏失败:', error);
      alert('更新游戏失败，请重试');
      setIsSubmitting(false);
    }
  };

  const handleCloseDialog = () => {
    if (!isSubmitting) {
      setShowEditDialog(false);
      setFormData({ title: '', description: '', link: '' });
      setImageFile(null);
      if (imagePreview && imageFile) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(null);
    }
  };

  // Cleanup preview URL on unmount
  React.useEffect(() => {
    return () => {
      if (imagePreview && imageFile) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview, imageFile]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/game-mod')}
          className="flex items-center space-x-2 text-dark-text-secondary hover:text-dark-text transition-colors duration-300 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">返回游戏展示区</span>
        </button>

        <div className="bg-dark-card border-4 border-theme-accent rounded-3xl shadow-2xl p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-theme-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-dark-text-secondary text-lg">加载游戏详情中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !gameMod) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/game-mod')}
          className="flex items-center space-x-2 text-dark-text-secondary hover:text-dark-text transition-colors duration-300 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">返回游戏展示区</span>
        </button>

        <div className="bg-dark-card border-4 border-theme-accent rounded-3xl shadow-2xl p-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">❌</span>
            </div>
            <h2 className="text-2xl font-bold text-dark-text mb-2">游戏未找到</h2>
            <p className="text-dark-text-secondary">该游戏不存在或已被删除</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/game-mod')}
        className="flex items-center space-x-2 text-dark-text-secondary hover:text-dark-text transition-colors duration-300 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="font-medium">返回游戏展示区</span>
      </button>

      {/* Game Detail Container */}
      <div className="bg-dark-card border-4 border-theme-accent rounded-3xl shadow-2xl overflow-hidden">
        {/* Header with Game Title */}
        <div className="bg-gradient-to-r from-theme-primary to-theme-secondary px-6 py-6 border-b-4 border-theme-accent">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
              <Gamepad2 size={36} />
              <span>{gameMod.title}</span>
            </h1>
            {isSuperUser && (
              <Button
                onClick={handleEditClick}
                className="bg-white hover:bg-gray-100 text-theme-primary font-bold"
              >
                <Edit size={20} className="mr-2" />
                编辑游戏
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Game Cover Image */}
          <div className="relative aspect-video rounded-2xl overflow-hidden border-3 border-gray-500 shadow-xl">
            <img
              src={gameMod.imageUrl}
              alt={gameMod.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Game Description Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-dark-text flex items-center space-x-2">
              <span className="text-3xl">📖</span>
              <span>游戏介绍</span>
            </h2>
            <div className="bg-dark-surface border-2 border-gray-500 rounded-2xl p-6">
              <p className="text-dark-text-secondary leading-relaxed whitespace-pre-wrap">
                {gameMod.description}
              </p>
            </div>
          </div>

          {/* Mod讲解区 Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-dark-text flex items-center space-x-2">
              <span className="text-3xl">🔧</span>
              <span>Mod讲解区</span>
            </h2>
            <div className="bg-gradient-to-br from-theme-primary/10 to-theme-secondary/10 border-3 border-theme-accent/50 rounded-2xl p-6">
              <div className="space-y-4">
                <p className="text-dark-text-secondary leading-relaxed">
                  这里是游戏的Mod讲解区域，您可以了解到关于这款游戏的修改内容、特色功能以及额外的详细信息。
                </p>
                <div className="bg-dark-surface/50 rounded-xl p-4 border border-gray-600">
                  <h3 className="text-lg font-bold text-dark-text mb-2">✨ 特色功能</h3>
                  <ul className="space-y-2 text-dark-text-secondary">
                    <li className="flex items-start space-x-2">
                      <span className="text-theme-primary mt-1">•</span>
                      <span>精心设计的游戏机制和玩法</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-theme-primary mt-1">•</span>
                      <span>丰富的游戏内容和关卡设计</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-theme-primary mt-1">•</span>
                      <span>流畅的游戏体验和优化性能</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Game Link Section */}
          {gameMod.link && gameMod.link !== '#' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-dark-text flex items-center space-x-2">
                <span className="text-3xl">🔗</span>
                <span>游戏链接</span>
              </h2>
              <div className="bg-dark-surface border-2 border-gray-500 rounded-2xl p-6">
                <a
                  href={gameMod.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-theme-primary hover:text-theme-secondary transition-colors duration-300 font-medium"
                >
                  <ExternalLink size={20} />
                  <span>在新标签页中打开游戏</span>
                </a>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={() => navigate('/game-mod')}
              variant="outline"
              className="flex-1 border-2 border-gray-500 text-dark-text hover:bg-dark-surface"
            >
              <ArrowLeft size={20} className="mr-2" />
              返回游戏列表
            </Button>
            {gameMod.link && gameMod.link !== '#' && (
              <Button
                onClick={() => window.open(gameMod.link, '_blank')}
                className="flex-1 bg-gradient-to-r from-theme-primary to-theme-secondary hover:from-theme-primary/90 hover:to-theme-secondary/90 text-white font-bold"
              >
                <ExternalLink size={20} className="mr-2" />
                开始游戏
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Edit Game Dialog */}
      <Dialog open={showEditDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="bg-dark-card border-4 border-theme-accent max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-700 flex-shrink-0">
            <DialogTitle className="text-2xl font-bold text-dark-text flex items-center space-x-2">
              <Edit size={24} className="text-theme-primary" />
              <span>编辑游戏</span>
            </DialogTitle>
            <DialogDescription className="text-dark-text-secondary">
              修改游戏信息并更新封面图片
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="px-6 py-4">
              <form id="edit-game-form" onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="edit-title" className="text-dark-text font-medium">
                    游戏标题 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-title"
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
                  <Label htmlFor="edit-description" className="text-dark-text font-medium">
                    游戏描述 <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="edit-description"
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
                  <Label htmlFor="edit-link" className="text-dark-text font-medium">
                    游戏链接
                  </Label>
                  <Input
                    id="edit-link"
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
                  <Label htmlFor="edit-image" className="text-dark-text font-medium">
                    封面图片
                  </Label>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <label
                        htmlFor="edit-image"
                        className="flex items-center space-x-2 px-4 py-2 bg-theme-primary hover:bg-theme-primary/90 text-white rounded-lg cursor-pointer transition-colors"
                      >
                        <Upload size={20} />
                        <span>更换图片</span>
                      </label>
                      <Input
                        id="edit-image"
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
                        {!isSubmitting && imageFile && (
                          <button
                            type="button"
                            onClick={() => {
                              setImageFile(null);
                              if (imagePreview && imageFile) {
                                URL.revokeObjectURL(imagePreview);
                              }
                              setImagePreview(gameMod?.imageUrl || null);
                            }}
                            className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-dark-text-secondary">
                      支持 JPG、PNG 格式，文件大小不超过 5MB。如不更换图片，将保留原有封面。
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
              form="edit-game-form"
              disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
              className="bg-theme-primary hover:bg-theme-primary/90 text-white"
            >
              {isSubmitting ? '更新中...' : '保存更改'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
