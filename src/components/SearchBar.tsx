// src/components/SearchBar.tsx
export default function SearchBar({ placeholder = "搜索..." }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}