'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  role: string;
}

export default function UserCenter() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getUserData() {
      try {
        // 获取当前登录用户
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          // 从数据库获取用户角色信息
          const { data, error } = await supabase
            .from('users')
            .select('id, email, role')
            .eq('id', authUser.id)
            .single();
          
          if (error) {
            console.error('获取用户信息失败:', error);
          } else {
            setUser(data);
          }
        }
      } catch (error) {
        console.error('获取用户数据失败:', error);
      } finally {
        setLoading(false);
      }
    }

    getUserData();
  }, []);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('退出登录失败:', error);
    } else {
      // 重新加载页面以更新状态
      window.location.reload();
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-emerald-800 mb-4">请先登录</h1>
          <Link 
            href="/frontend/user/login" 
            className="inline-block px-6 py-3 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
          >
            去登录
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10">
      <div className="container mx-auto px-4 sm:px-6">
        {/* 页面标题 */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">个人中心</h1>
          <p className="text-emerald-600">欢迎回来，{user.email}</p>
          <div className="w-32 h-1 bg-emerald-300 mx-auto mt-4"></div>
        </div>

        {/* 用户角色信息 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-emerald-800 mb-2">用户信息</h2>
              <p className="text-gray-600">邮箱: {user.email}</p>
              <p className="text-gray-600">角色: {user.role === 'admin' ? '管理员' : '普通用户'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>

        {/* 功能菜单 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 普通用户功能 */}
          <Link 
            href="/frontend/user/profile" 
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-bold text-emerald-800 mb-2">个人信息</h3>
            <p className="text-gray-600">修改你的个人资料</p>
          </Link>

          <Link 
            href="/frontend/user/comments" 
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-bold text-emerald-800 mb-2">我的评论</h3>
            <p className="text-gray-600">查看和管理我的评论</p>
          </Link>

          <Link 
            href="/frontend/user/favorites" 
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-bold text-emerald-800 mb-2">我的收藏</h3>
            <p className="text-gray-600">查看和管理我的收藏</p>
          </Link>

          {/* 管理员专属功能 */}
          {user.role === 'admin' && (
            <Link 
              href="/admin" 
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-bold text-emerald-800 mb-2">后台管理</h3>
              <p className="text-gray-600">管理景点、美食、用户和评论</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}