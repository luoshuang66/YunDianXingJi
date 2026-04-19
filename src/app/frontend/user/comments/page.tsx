// src/app/frontend/user/comments/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

type Comment = {
  id: number;
  content: string;
  spot_name: string;
  spot_id: number;
  created_at: string;
  status: 'approved' | 'pending';
};

export default function MyComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function getUser() {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        setUser(userData.user);
        getComments(userData.user.id);
      }
    }
    getUser();
  }, []);

  async function getComments(userId: string) {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    setComments(data as Comment[]);
  }

  async function deleteComment(id: number) {
    if (confirm('确定要删除这个评论吗？')) {
      const { error } = await supabase.from('comments').delete().eq('id', id);
      if (!error) {
        setComments(comments.filter(c => c.id !== id));
      }
    }
  }

  if (!user) {
    return (
      <div className="container py-10">
        <h1 className="text-2xl font-bold mb-6">我的评论</h1>
        <p className="text-center py-10">请先登录</p>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">我的评论</h1>
      {comments.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500">暂无评论</p>
          <Link 
            href="/frontend/spots" 
            className="inline-block mt-4 px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
          >
            去景点页面评论
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="p-6 bg-white rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Link 
                    href={`/frontend/spots/${c.spot_id}`} 
                    className="font-bold text-emerald-800 hover:underline"
                  >
                    {c.spot_name}
                  </Link>
                  <p className="text-gray-500 text-sm mt-1">
                    {new Date(c.created_at).toLocaleString()}
                  </p>
                  {c.status === 'pending' && (
                    <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs mt-1">
                      待审核
                    </span>
                  )}
                  {c.status === 'approved' && (
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs mt-1">
                      已通过
                    </span>
                  )}
                </div>
                <button
                  onClick={() => deleteComment(c.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  删除
                </button>
              </div>
              <p className="text-gray-700">{c.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}