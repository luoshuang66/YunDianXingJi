'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  role: string;
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkUser() {
      try {
        // 获取当前登录用户
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (!authUser) {
          window.location.href = '/frontend/user/login';
        } else {
          // 从数据库获取用户角色信息
          const { data, error } = await supabase
            .from('users')
            .select('id, email, role')
            .eq('id', authUser.id)
            .single();
          
          if (error || !data || data.role !== 'admin') {
            window.location.href = '/'; // 非管理员重定向
          } else {
            setUser(data);
          }
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
        window.location.href = '/';
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, []);

  if (loading) {
    return <div className="container py-10">加载中...</div>;
  }

  if (!user) {
    return <div className="container py-10">无权限访问</div>;
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8 text-emerald-800">后台管理</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link 
          href="/admin/spots" 
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-bold mb-2 text-emerald-800">景点管理</h2>
          <p className="text-gray-600">添加、编辑、删除景点信息</p>
        </Link>
        
        <Link 
          href="/admin/foods" 
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-bold mb-2 text-emerald-800">美食管理</h2>
          <p className="text-gray-600">管理云南特色美食数据</p>
        </Link>
        
        <Link 
          href="/admin/users" 
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-bold mb-2 text-emerald-800">用户管理</h2>
          <p className="text-gray-600">管理平台用户信息</p>
        </Link>
        
        <Link 
          href="/admin/comments" 
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-bold mb-2 text-emerald-800">评论管理</h2>
          <p className="text-gray-600">审核和管理用户评论</p>
        </Link>
      </div>
    </div>
  );
}