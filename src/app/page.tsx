'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Utensils, 
  Route, 
  Camera, 
  ArrowRight,
  Mountain,
  User,
  LogOut
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// 热门目的地数据
const hotDestinations = [
  {
    id: 1,
    name: '大理',
    image: 'https://picsum.photos/seed/dali/400/500',
    desc: '风花雪月'
  },
  {
    id: 2,
    name: '丽江',
    image: 'https://picsum.photos/seed/lijiang/400/500',
    desc: '古城夜色'
  },
  {
    id: 3,
    name: '香格里拉',
    image: 'https://picsum.photos/seed/shangrila/400/500',
    desc: '藏地秘境'
  },
  {
    id: 4,
    name: '西双版纳',
    image: 'https://picsum.photos/seed/xishuangbanna/400/500',
    desc: '热带风情'
  }
];

// 功能板块数据
const features = [
  {
    id: 1,
    icon: Camera,
    title: '景点',
    desc: '山水古迹',
    href: '/frontend/spots'
  },
  {
    id: 2,
    icon: Utensils,
    title: '美食',
    desc: '滇味风味',
    href: '/frontend/foods'
  },
  {
    id: 3,
    icon: Route,
    title: '路线',
    desc: '深度体验',
    href: '/frontend/routes'
  }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
          setUser(authUser);
        } else {
          setUser(data);
        }
      }
      setLoading(false);
    }
    checkUser();
  }, []);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/frontend/spots?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <main className="min-h-screen bg-[#1a4d44]">
      {/* 1. 顶部导航 - 中国风设计 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-emerald-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo - 中国风设计 */}
          <div className="flex items-center gap-2">
            <Mountain className="w-6 h-6 text-emerald-700" />
            <span className="font-bold text-xl text-emerald-800 tracking-wide">云滇行迹</span>
          </div>
          
          {/* 搜索框 */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full flex">
              <input
                type="text"
                placeholder="搜索景点、美食、路线..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-2 border-emerald-200 rounded-l-lg px-4 py-2 outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="bg-emerald-700 text-white px-4 py-2 rounded-r-lg hover:bg-emerald-800 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>
          
          {/* 导航链接 - 桌面端 */}
          <div className="hidden md:flex items-center gap-4 text-sm text-emerald-800">
            <Link href="/frontend/spots" className="hover:text-emerald-600 transition-colors font-medium">景点</Link>
            <Link href="/frontend/foods" className="hover:text-emerald-600 transition-colors font-medium">美食</Link>
            <Link href="/frontend/routes" className="hover:text-emerald-600 transition-colors font-medium">路线</Link>
            {user ? (
              <>
                <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-full hover:bg-emerald-800 transition-colors font-medium">
                    <User className="w-4 h-4" />
                    个人中心
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <Link href="/frontend/user/comments" className="block px-4 py-2 text-sm text-emerald-800 hover:bg-emerald-50">我的评论</Link>
                    <Link href="/frontend/user/favorites" className="block px-4 py-2 text-sm text-emerald-800 hover:bg-emerald-50">我的收藏</Link>
                    {user?.role === 'admin' && (
                      <Link href="/admin" className="block px-4 py-2 text-sm text-emerald-800 hover:bg-emerald-50">后台管理</Link>
                    )}
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-emerald-50">退出登录</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/frontend/user/login" className="px-4 py-2 bg-emerald-700 text-white rounded-full hover:bg-emerald-800 transition-colors font-medium">
                  登录
                </Link>
                <Link href="/frontend/user/register" className="px-4 py-2 border border-emerald-700 text-emerald-700 rounded-full hover:bg-emerald-50 transition-colors font-medium">
                  注册
                </Link>
              </>
            )}
          </div>
          
          {/* 移动端菜单按钮 */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-emerald-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* 移动端菜单 */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-emerald-200">
            <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-4">
              {/* 移动端搜索框 */}
              <form onSubmit={handleSearch} className="w-full flex">
                <input
                  type="text"
                  placeholder="搜索景点、美食、路线..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-2 border-emerald-200 rounded-l-lg px-4 py-2 outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="bg-emerald-700 text-white px-4 py-2 rounded-r-lg hover:bg-emerald-800 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </form>
              <Link href="/frontend/spots" className="text-emerald-800 hover:text-emerald-600 font-medium py-2">景点</Link>
              <Link href="/frontend/foods" className="text-emerald-800 hover:text-emerald-600 font-medium py-2">美食</Link>
              <Link href="/frontend/routes" className="text-emerald-800 hover:text-emerald-600 font-medium py-2">路线</Link>
              {user ? (
                <>
                  <Link href="/frontend/user/comments" className="text-emerald-800 hover:text-emerald-600 font-medium py-2">我的评论</Link>
                  <Link href="/frontend/user/favorites" className="text-emerald-800 hover:text-emerald-600 font-medium py-2">我的收藏</Link>
                  {user?.role === 'admin' && (
                    <Link href="/admin" className="text-emerald-800 hover:text-emerald-600 font-medium py-2">后台管理</Link>
                  )}
                  <button onClick={handleLogout} className="text-red-500 hover:text-red-700 font-medium py-2">退出登录</button>
                </>
              ) : (
                <>
                  <Link href="/frontend/user/login" className="bg-emerald-700 text-white rounded-full py-2 text-center font-medium">
                    登录
                  </Link>
                  <Link href="/frontend/user/register" className="border border-emerald-700 text-emerald-700 rounded-full py-2 text-center font-medium">
                    注册
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* 2. Hero区 - 中国风设计 */}
      <section className="pt-32 pb-20 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          {/* 中国风边框装饰 */}
          <div className="relative p-8 mb-12 bg-white rounded-lg shadow-xl">
            {/* 中国风花纹装饰 */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-amber-600 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-amber-600 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-amber-600 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-amber-600 rounded-br-lg"></div>
            
            <div className="relative z-10">
              {/* 大艺术字 - 云滇行迹 */}
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-emerald-800 mb-6 tracking-wide leading-none">
                云滇行迹
              </h1>
              
              {/* 图片展示区 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                <div className="rounded-lg overflow-hidden shadow-md border-2 border-amber-200">
                  <Image
                    src="https://picsum.photos/seed/yunnan1/400/300"
                    alt="大理风景"
                    width={400}
                    height={300}
                    className="w-full h-auto"
                    loading="eager"
                  />
                </div>
                <div className="rounded-lg overflow-hidden shadow-md border-2 border-amber-200">
                  <Image
                    src="https://picsum.photos/seed/yunnan2/400/300"
                    alt="丽江古城"
                    width={400}
                    height={300}
                    className="w-full h-auto"
                    loading="eager"
                  />
                </div>
                <div className="rounded-lg overflow-hidden shadow-md border-2 border-amber-200">
                  <Image
                    src="https://picsum.photos/seed/yunnan3/400/300"
                    alt="云南美食"
                    width={400}
                    height={300}
                    className="w-full h-auto"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 三大板块 - 小图标居中排列 */}
      <section className="py-16 bg-emerald-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-emerald-800 mb-2">探索云南</h2>
            <p className="text-emerald-600">发现云南的自然与文化之美</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Link 
                key={feature.id} 
                href={feature.href}
                className="group p-8 rounded-2xl bg-white hover:shadow-xl transition-all duration-300 border border-emerald-200"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-emerald-800 mb-2 text-center">{feature.title}</h3>
                <p className="text-sm text-emerald-600 text-center">{feature.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 热门目的地 - 小图精致，居中 */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-emerald-800 mb-2">热门目的地</h2>
            <p className="text-emerald-600">云南必打卡的宝藏城市</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {hotDestinations.map((dest) => (
              <Link 
                href={`/frontend/spots/${dest.name}`} 
                key={dest.id}
                className="group text-center"
              >
                <div className="relative w-40 h-40 mx-auto rounded-2xl overflow-hidden mb-4 bg-emerald-50 ring-2 ring-emerald-300 group-hover:ring-emerald-400 transition-all shadow-md">
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-bold text-emerald-800 mb-1 group-hover:text-emerald-600 transition-colors">
                  {dest.name}
                </h3>
                <p className="text-sm text-emerald-600">{dest.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 底部 CTA */}
      <section className="py-20 bg-emerald-800 text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">准备好开启旅程了吗？</h2>
          <p className="text-emerald-100 mb-8">从大理的苍山洱海到丽江的古城夜色</p>
          <Link 
            href="/frontend/routes"
            className="inline-flex items-center gap-2 bg-white text-emerald-800 hover:bg-emerald-50 px-8 py-3 rounded-full font-medium transition-all hover:scale-105"
          >
            浏览推荐路线
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* 6. 页脚 */}
      <footer className="py-8 text-center text-emerald-600 text-sm border-t border-emerald-100 bg-emerald-50">
        <p>© 2024 云滇行迹 - 云南文旅服务平台</p>
      </footer>
    </main>
  );
}