// src/app/frontend/user/favorites/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

type Favorite = {
  id: number;
  spot_id: number;
  spot_name: string;
  spot_image?: string;
  created_at: string;
};

export default function Favorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function getUser() {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        setUser(userData.user);
        getFavorites(userData.user.id);
      }
    }
    getUser();
  }, []);

  async function getFavorites(userId: string) {
    const { data } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    setFavorites(data as Favorite[]);
  }

  async function removeFavorite(id: number) {
    if (confirm('确定要取消收藏吗？')) {
      const { error } = await supabase.from('favorites').delete().eq('id', id);
      if (!error) {
        setFavorites(favorites.filter(f => f.id !== id));
      }
    }
  }

  if (!user) {
    return (
      <div className="container py-10">
        <h1 className="text-2xl font-bold mb-6">我的收藏</h1>
        <p className="text-center py-10">请先登录</p>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">我的收藏</h1>
      {favorites.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500">暂无收藏</p>
          <Link 
            href="/frontend/spots" 
            className="inline-block mt-4 px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
          >
            去景点页面收藏
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((f) => (
            <div key={f.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                {f.spot_image ? (
                  <Image
                    src={f.spot_image}
                    alt={f.spot_name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">暂无图片</span>
                  </div>
                )}
                <button
                  onClick={() => removeFavorite(f.id)}
                  className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-2 rounded-full text-red-500 hover:bg-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <Link 
                  href={`/frontend/spots/${f.spot_id}`} 
                  className="font-bold text-emerald-800 hover:underline"
                >
                  {f.spot_name}
                </Link>
                <p className="text-gray-500 text-sm mt-2">
                  收藏于 {new Date(f.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}