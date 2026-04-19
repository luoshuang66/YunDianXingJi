import Link from 'next/link';

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-primary-dark text-white h-screen p-6 flex flex-col">
      <h2 className="text-xl font-serif font-bold mb-8 pb-4 border-b border-primary-light">
        云滇行迹管理后台
      </h2>
      <div className="space-y-2 flex-1">
        <Link href="/admin" className="block py-2 px-3 rounded hover:bg-primary transition-colors">
          后台首页
        </Link>
        <Link href="/admin/spots" className="block py-2 px-3 rounded hover:bg-primary transition-colors">
          景点管理
        </Link>
        <Link href="/admin/foods" className="block py-2 px-3 rounded hover:bg-primary transition-colors">
          美食管理
        </Link>
        <Link href="/admin/routes" className="block py-2 px-3 rounded hover:bg-primary transition-colors">
          路线管理
        </Link>
        <Link href="/admin/comments" className="block py-2 px-3 rounded hover:bg-primary transition-colors">
          评论审核
        </Link>
        <Link href="/admin/users" className="block py-2 px-3 rounded hover:bg-primary transition-colors">
          用户管理
        </Link>
      </div>
      <div className="pt-4 border-t border-primary-light">
        <Link href="/" className="block py-2 px-3 rounded hover:bg-primary transition-colors text-sm">
          返回前台首页
        </Link>
      </div>
    </aside>
  );
}