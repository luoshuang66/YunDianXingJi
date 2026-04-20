export const runtime = 'edge';
// src/app/frontend/foods/[id]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Star, Heart, Send } from 'lucide-react';

type Food = {
  id: string;
  name: string;
  city: string;
  description: string;
  image_url: string;
  shop: string;
};

type Comment = {
  id: number;
  content: string;
  username: string;
  created_at: string;
  user_id?: string;
};

export default function FoodDetail() {
  const { id } = useParams();
  const [food, setFood] = useState<Food | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    checkUser();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);

      // 美食详情
      const { data: foodData, error: foodError } = await supabase
        .from('foods')
        .select('*')
        .eq('id', id)
        .single();

      if (foodError) {
        console.error('获取美食失败：', foodError);
      } else {
        setFood(foodData as Food);
      }

      // 检查是否已收藏
      if (user) {
        const { data: favorites } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', user.id)
          .eq('target_type', 'food')
          .eq('target_id', id);
        setIsFavorited(!!(favorites && favorites.length > 0));
      }

      // 评论列表
      const { data: commentData } = await supabase
        .from('comments')
        .select('*')
        .eq('target_id', id)
        .eq('target_type', 'food')
        .order('created_at', { ascending: false });
      setComments((commentData as Comment[]) || []);

      setLoading(false);
    }
    fetchData();
  }, [id, user]);

  async function handleFavorite() {
    if (!user) {
      alert('请先登录');
      return;
    }
    
    try {
      if (isFavorited) {
        // 取消收藏
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('target_type', 'food')
          .eq('target_id', id);
        if (!error) {
          setIsFavorited(false);
          // 延迟提示，确保状态更新后再显示
          setTimeout(() => {
            alert('取消收藏成功');
          }, 100);
        }
      } else {
        // 添加收藏
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            target_type: 'food',
            target_id: id
          });
        if (!error) {
          setIsFavorited(true);
          // 延迟提示，确保状态更新后再显示
          setTimeout(() => {
            alert('收藏成功');
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('操作失败，请重试');
    }
  }

  // 发布评论
  async function handleSubmitComment() {
    if (!user) {
      alert('请先登录');
      return;
    }
    
    if (!commentContent.trim()) {
      alert('请输入评论内容');
      return;
    }
    
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          user_id: user.id,
          target_type: 'food',
          target_id: id,
          content: commentContent
        });
      if (!error) {
        // 重新获取评论
        const { data: commentsData } = await supabase
          .from('comments')
          .select('*')
          .eq('target_type', 'food')
          .eq('target_id', id)
          .order('created_at', { ascending: false });
        setComments(commentsData || []);
        setCommentContent('');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !food) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
  }

  return (
    <main className="min-h-screen bg-[#f8f9fa]">
      {/* 顶部返回栏 */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-emerald-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link 
            href="/frontend/foods"
            className="flex items-center gap-2 text-emerald-800 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回</span>
          </Link>
          <h1 className="font-bold text-emerald-800 truncate max-w-[200px]">{food.name}</h1>
          <button 
            onClick={handleFavorite}
            className="flex items-center gap-2 px-3 py-1 hover:bg-emerald-50 rounded-full transition-colors"
          >
            <Star 
              className={`w-5 h-5 ${isFavorited ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} 
            />
            <span className="text-sm text-emerald-800">收藏</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* 图片区 - 圆角卡片 */}
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gray-200 mb-6">
          <Image
            src={food.image_url || `https://picsum.photos/seed/${food.id}/800/600`}
            alt={food.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* 信息区 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-emerald-800 mb-2">{food.name}</h1>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{food.city} · 推荐店铺：{food.shop || '暂无'}</span>
              </div>
            </div>
          </div>

          {/* 介绍 */}
          <div>
            <h2 className="font-bold text-emerald-800 mb-3">美食介绍</h2>
            <p className="text-gray-600 leading-relaxed">{food.description}</p>
          </div>
        </div>

        {/* 评论区 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-emerald-800 mb-4">用户评论</h2>
          
          {/* 评论输入框 */}
          <div className="mb-6">
            <textarea
              placeholder="写下你的品尝感受..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="w-full border-2 border-emerald-200 rounded-lg px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all resize-none"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleSubmitComment}
                disabled={submitting}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors disabled:bg-emerald-500 disabled:cursor-not-allowed"
              >
                {submitting ? '提交中...' : '发布评论'}
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* 评论列表 */}
          {comments.length === 0 ? (
            <p className="text-gray-400 text-center py-4">暂无评论，快来发表第一条评论吧！</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-emerald-800">用户{comment.user_id?.substring(0, 6) || comment.username}</span>
                    <span className="text-sm text-gray-400">{new Date(comment.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-600">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}