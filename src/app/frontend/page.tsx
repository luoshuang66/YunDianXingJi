// src/app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-paper">
      {/* 顶部主视觉区 */}
      <section className="ink-gradient text-white py-28 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 tracking-wider">云滇行迹</h1>
          <p className="text-xl md:text-2xl opacity-90 font-serif mb-10">发现云南之美 · 一站式文旅服务平台</p>
          
          {/* 搜索框 */}
          <div className="max-w-2xl mx-auto bg-white/95 rounded-full px-6 py-4 flex items-center shadow-lg">
            <input 
              type="text" 
              placeholder="搜索景点、美食、目的地..." 
              className="w-full bg-transparent outline-none text-ink text-lg"
            />
            <button className="btn-primary rounded-full ml-3 px-6 py-2 text-base">
              搜索
            </button>
          </div>
        </div>
      </section>

      {/* 核心功能入口 */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-serif text-center mb-3">核心板块</h2>
        <p className="text-center text-gray-2 mb-16 text-lg">探索云南的山川湖海、人间烟火</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 景点探索卡片 - 路径和你的目录匹配 */}
          <Link 
            href="/frontend/spots" 
            className="chinese-card p-10 text-center group hover:-translate-y-2"
          >
            <div className="text-primary text-6xl mb-6 group-hover:scale-110 transition-transform">🏞️</div>
            <h3 className="text-2xl font-serif font-bold mb-4">景点探索</h3>
            <p className="text-gray-2 text-lg">云南热门景点 · 自然风光 · 人文古迹</p>
          </Link>

          {/* 特色美食卡片 - 路径和你的目录匹配 */}
          <Link 
            href="/frontend/foods" 
            className="chinese-card p-10 text-center group hover:-translate-y-2"
          >
            <div className="text-secondary text-6xl mb-6 group-hover:scale-110 transition-transform">🍜</div>
            <h3 className="text-2xl font-serif font-bold mb-4">特色美食</h3>
            <p className="text-gray-2 text-lg">地道滇味 · 民族风味 · 街头小吃</p>
          </Link>

          {/* 路线推荐卡片 - 路径和你的目录匹配 */}
          <Link 
            href="/frontend/routes" 
            className="chinese-card p-10 text-center group hover:-translate-y-2"
          >
            <div className="text-accent-green text-6xl mb-6 group-hover:scale-110 transition-transform">🗺️</div>
            <h3 className="text-2xl font-serif font-bold mb-4">路线推荐</h3>
            <p className="text-gray-2 text-lg">省心行程 · 经典路线 · 深度体验</p>
          </Link>
        </div>
      </section>

      {/* 热门目的地 */}
      <section className="bg-primary-bg py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif text-center mb-3">热门目的地</h2>
          <p className="text-center text-gray-2 mb-16 text-lg">云南必打卡的宝藏城市</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: '大理', img: 'https://picsum.photos/seed/dali/800/600' },
              { name: '丽江', img: 'https://picsum.photos/seed/lijiang/800/600' },
              { name: '香格里拉', img: 'https://picsum.photos/seed/xgll/800/600' },
              { name: '西双版纳', img: 'https://picsum.photos/seed/xsbn/800/600' },
            ].map((item) => (
              <div key={item.name} className="chinese-card overflow-hidden group">
                <div className="h-56 overflow-hidden">
                  <img 
                    src={item.img} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                  />
                </div>
                <div className="p-5 text-center">
                  <h3 className="text-xl font-serif font-bold">{item.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}