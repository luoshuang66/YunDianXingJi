// src/app/frontend/user/register/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Mountain } from 'lucide-react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleRegister() {
    if (!username.trim()) {
      alert('请输入用户名');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      });
      if (error) {
        setError(error.message);
        alert('注册失败：' + error.message);
      } else {
        alert('注册成功！请查收邮箱验证邮件');
        router.push('/frontend/user/login');
      }
    } catch (err: any) {
      setError(err.message);
      alert('注册失败：' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 bg-[#1a4d44]">
      {/* 中国风注册卡片 */}
      <div className="w-full max-w-md relative mx-auto">
        {/* 中国风边框装饰 */}
        <div className="absolute inset-0 border-4 border-double border-amber-600 rounded-2xl"></div>
        <div className="relative bg-white p-8 rounded-2xl shadow-lg animate-fade-in">
          {/* Logo和标题 */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Mountain className="w-8 h-8 text-emerald-700" />
              <h1 className="text-2xl font-bold text-emerald-800">云滇行迹</h1>
            </div>
            <h2 className="text-2xl font-bold text-emerald-800 mb-2">账号注册</h2>
            <div className="w-24 h-1 bg-emerald-300 mx-auto"></div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-emerald-700 font-medium mb-2">用户名</label>
              <input
                type="text"
                placeholder="请输入您的用户名"
                className="w-full border-2 border-emerald-200 rounded-lg px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-emerald-700 font-medium mb-2">邮箱</label>
              <input
                type="email"
                placeholder="请输入您的邮箱"
                className="w-full border-2 border-emerald-200 rounded-lg px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-emerald-700 font-medium mb-2">密码</label>
              <input
                type="password"
                placeholder="请设置您的密码"
                className="w-full border-2 border-emerald-200 rounded-lg px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-500 rounded-lg text-sm">
                {error}
              </div>
            )}
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-3 rounded-lg transition-all hover:shadow-md disabled:bg-emerald-500 disabled:cursor-not-allowed"
            >
              {loading ? '注册中...' : '注册'}
            </button>

            <p className="text-center text-emerald-600">
              已有账号？
              <Link href="/frontend/user/login" className="text-emerald-800 font-medium ml-1">立即登录</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}