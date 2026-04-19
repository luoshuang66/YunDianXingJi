// src/app/admin/comments/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Comment = {
  id: number;
  content: string;
  username: string;
  spot_name: string;
  created_at: string;
  status: 'approved' | 'pending';
};

export default function AdminComments() {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    getComments();
  }, []);

  async function getComments() {
    const { data } = await supabase.from('comments').select('*');
    setComments((data as Comment[]) || []);
  }

  async function deleteComment(id: number) {
    if (confirm('确定要删除这个评论吗？')) {
      const { error } = await supabase.from('comments').delete().eq('id', id);
      if (!error) {
        getComments();
      }
    }
  }

  async function approveComment(id: number) {
    const { error } = await supabase
      .from('comments')
      .update({ status: 'approved' })
      .eq('id', id);
    if (!error) {
      getComments();
    }
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">评论管理</h1>
      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-bold text-emerald-800">{c.username}</p>
                <p className="text-gray-600 mb-2">{c.spot_name}</p>
                <p className="text-gray-500 text-sm mb-2">
                  {new Date(c.created_at).toLocaleString()}
                </p>
                {c.status === 'pending' && (
                  <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                    待审核
                  </span>
                )}
                {c.status === 'approved' && (
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    已通过
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {c.status === 'pending' && (
                  <button
                    onClick={() => approveComment(c.id)}
                    className="text-green-500 hover:text-green-700"
                  >
                    通过
                  </button>
                )}
                <button
                  onClick={() => deleteComment(c.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  删除
                </button>
              </div>
            </div>
            <p className="text-gray-700">{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}