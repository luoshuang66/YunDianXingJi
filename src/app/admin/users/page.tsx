// src/app/admin/users/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type User = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    const { data } = await supabase.auth.admin.listUsers();
    setUsers(data.users as User[]);
  }

  async function handleDeleteUser(id: string) {
    if (confirm('确定要删除这个用户吗？')) {
      const { error } = await supabase.auth.admin.deleteUser(id);
      if (!error) {
        getUsers();
      }
    }
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">用户管理</h1>
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow">
          <thead className="bg-emerald-700 text-white">
            <tr>
              <th className="px-6 py-3 text-left">邮箱</th>
              <th className="px-6 py-3 text-left">创建时间</th>
              <th className="px-6 py-3 text-left">最后登录</th>
              <th className="px-6 py-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b">
                <td className="px-6 py-4">{u.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(u.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString() : '从未登录'}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}