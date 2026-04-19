'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    async function checkUser() {
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
    }
    checkUser();
  }, []);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
    }
  }

  return (
    <nav className="bg-[#1a4d44] text-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold">云滇行迹</span>
            </Link>
          </div>

          {/* 桌面端菜单 */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/frontend/spots" className="hover:text-amber-300 transition-colors">景点</Link>
            <Link href="/frontend/foods" className="hover:text-amber-300 transition-colors">美食</Link>
            <Link href="/frontend/routes" className="hover:text-amber-300 transition-colors">路线</Link>
            
            {/* 用户菜单 */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 hover:text-amber-300 transition-colors">
                  <span>个人中心</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <Link href="/frontend/user" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">个人中心</Link>
                  <Link href="/frontend/user/comments" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">我的评论</Link>
                  <Link href="/frontend/user/favorites" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">我的收藏</Link>
                  {user?.role === 'admin' && (
                    <Link href="/admin" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">后台管理</Link>
                  )}
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">退出登录</button>
                </div>
              </div>
            ) : (
              <Link href="/frontend/user/login" className="hover:text-amber-300 transition-colors">登录/注册</Link>
            )}
          </div>

          {/* 移动端菜单按钮 */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* 移动端菜单 */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link href="/frontend/spots" className="block px-4 py-2 hover:bg-[#1e5a4f] rounded transition-colors">景点</Link>
            <Link href="/frontend/foods" className="block px-4 py-2 hover:bg-[#1e5a4f] rounded transition-colors">美食</Link>
            <Link href="/frontend/routes" className="block px-4 py-2 hover:bg-[#1e5a4f] rounded transition-colors">路线</Link>
            
            {user ? (
              <div className="space-y-2">
                <Link href="/frontend/user" className="block px-4 py-2 hover:bg-[#1e5a4f] rounded transition-colors">个人中心</Link>
                <Link href="/frontend/user/comments" className="block px-4 py-2 hover:bg-[#1e5a4f] rounded transition-colors">我的评论</Link>
                <Link href="/frontend/user/favorites" className="block px-4 py-2 hover:bg-[#1e5a4f] rounded transition-colors">我的收藏</Link>
                {user.role === 'admin' && (
                  <Link href="/admin" className="block px-4 py-2 hover:bg-[#1e5a4f] rounded transition-colors">后台管理</Link>
                )}
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-[#1e5a4f] rounded transition-colors">退出登录</button>
              </div>
            ) : (
              <Link href="/frontend/user/login" className="block px-4 py-2 hover:bg-[#1e5a4f] rounded transition-colors">登录/注册</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}