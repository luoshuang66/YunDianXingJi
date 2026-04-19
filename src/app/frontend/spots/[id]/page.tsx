'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Star, Heart, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

// 模拟数据
const mockData: Record<string, any> = {
  '大理': {
    name: '大理古城',
    image: 'https://picsum.photos/seed/dali/800/600',
    location: '云南省大理白族自治州',
    rating: 4.8,
    desc: '大理古城位于云南省西部，又名叶榆城、紫城。古城其历史可追溯至唐天宝年间，南诏王阁逻凤筑的羊苴咩城，为其新都。古城始建于明洪武十五年（1382年），占地面积3平方公里。',
    tags: ['历史古迹', '自然风光', '摄影圣地']
  },
  '丽江': {
    name: '丽江古城',
    image: 'https://picsum.photos/seed/lijiang/800/600',
    location: '云南省丽江市',
    rating: 4.9,
    desc: '丽江古城位于云南省丽江市古城区，又名大研镇，坐落在丽江坝中部，始建于宋末元初（公元13世纪后期），地处云贵高原，面积为7.279平方公里。',
    tags: ['世界遗产', '纳西文化', '夜生活']
  },
  '西双版纳': {
    name: '西双版纳',
    image: 'https://picsum.photos/seed/xishuangbanna/800/600',
    location: '云南省西双版纳傣族自治州',
    rating: 4.7,
    desc: '西双版纳傣族自治州，是云南省的8个自治州之一，首府景洪市。处于北回归线以南的热带北部边沿，属热带季风气候。',
    tags: ['热带雨林', '傣族风情', '动植物王国']
  },
  '香格里拉': {
    name: '香格里拉',
    image: 'https://picsum.photos/seed/shangrila/800/600',
    location: '云南省迪庆藏族自治州',
    rating: 4.8,
    desc: '香格里拉市是迪庆藏族自治州下辖市之一，市境位于云南省西北部，是滇、川及西藏三省区交汇处，也是“三江并流”风景区腹地。',
    tags: ['藏区秘境', '雪山草原', '藏传佛教']
  }
};

export default function SpotDetail() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    checkUser();
  }, []);

  useEffect(() => {
    async function fetchSpotData() {
      try {
        const id = params.id as string;
        // 从数据库获取数据
        const { data: spotData, error: spotError } = await supabase
          .from('spots')
          .select('*')
          .eq('id', id)
          .single();
        
        if (spotError) {
          console.error('获取景点数据失败:', spotError);
          // 如果数据库中没有数据，使用默认数据
          const defaultData = {
            id: id,
            name: '未知景点',
            image: `https://picsum.photos/seed/${id}/800/600`,
            location: '云南省',
            rating: 4.8,
            desc: '这是一个美丽的旅游景点，值得一去。',
            tags: ['旅游景点', '自然风光', '人文古迹']
          };
          setData(defaultData);
        } else {
          setData(spotData);
        }
        
        // 检查是否已收藏
        if (user) {
          const { data: favorites } = await supabase
            .from('favorites')
            .select('*')
            .eq('user_id', user.id)
            .eq('target_type', 'spot')
            .eq('target_id', id);
          setIsFavorited(!!(favorites && favorites.length > 0));
        }
        
        // 获取评论
        const { data: commentsData } = await supabase
          .from('comments')
          .select('*')
          .eq('target_type', 'spot')
          .eq('target_id', id)
          .order('created_at', { ascending: false });
        setComments(commentsData || []);
      } catch (error) {
        console.error('Error fetching spot data:', error);
        // 出错时使用默认数据
        const defaultData = {
          id: params.id as string,
          name: '未知景点',
          image: `https://picsum.photos/seed/${params.id}/800/600`,
          location: '云南省',
          rating: 4.8,
          desc: '这是一个美丽的旅游景点，值得一去。',
          tags: ['旅游景点', '自然风光', '人文古迹']
        };
        setData(defaultData);
      } finally {
        setLoading(false);
      }
    }
    fetchSpotData();
  }, [params.id, user]);

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
          .eq('target_type', 'spot')
          .eq('target_id', data.id);
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
            target_type: 'spot',
            target_id: data.id
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

  async function handleSubmitComment() {
    if (!user) {
      alert('请先登录');
      return;
    }
    
    if (!comment.trim()) {
      alert('请输入评论内容');
      return;
    }
    
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          user_id: user.id,
          target_type: 'spot',
          target_id: data.id,
          content: comment
        });
      if (!error) {
        // 重新获取评论
        const { data: commentsData } = await supabase
          .from('comments')
          .select('*')
          .eq('target_type', 'spot')
          .eq('target_id', data.id)
          .order('created_at', { ascending: false });
        setComments(commentsData || []);
        setComment('');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !data) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
  }

  return (
    <main className="min-h-screen bg-[#f8f9fa]">
      {/* 顶部返回栏 */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-emerald-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link 
            href="/frontend/spots"
            className="flex items-center gap-2 text-emerald-800 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回</span>
          </Link>
          <h1 className="font-bold text-emerald-800 truncate max-w-[200px]">{data.name}</h1>
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
            src={data.image}
            alt={data.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* 信息区 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-emerald-800 mb-2">{data.name}</h1>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{data.location}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-yellow-700">{data.rating}</span>
            </div>
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(data.tags || []).map((tag: string, index: number) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 介绍 */}
          <div>
            <h2 className="font-bold text-emerald-800 mb-3">景点介绍</h2>
            <p className="text-gray-600 leading-relaxed">{data.desc}</p>
          </div>
        </div>

        {/* 评论区 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-emerald-800 mb-4">用户评论</h2>
          
          {/* 评论输入框 */}
          <div className="mb-6">
            <textarea
              placeholder="写下你的评论..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
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
                    <span className="font-medium text-emerald-800">用户{comment.user_id.substring(0, 6)}</span>
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