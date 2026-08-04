import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  placeholder?: string;
  defaultValue?: string;
  onSearch: (query: string) => void;
}


export default function SearchBar({ placeholder, defaultValue = "", onSearch }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="flex justify-between items-center border-purple-500 border-2 px-3 py-2 rounded-sm w-full bg-gray-800 shadow-sm">
      <form
        onSubmit={(e) => {
            handleSubmit(e);
        }}        
        className="flex w-full items-center justify-between text-gray-100"
      >
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          className="outline-none bg-transparent w-full placeholder:text-gray-400"
        />
        <button type="submit" className="ml-2 cursor-pointer">
          <Search color="var(--purple-500)" />
        </button>
      </form>
    </div>
  );
}
