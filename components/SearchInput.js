// located at /components/SearchInput.js
import { useState } from 'react';

function SearchInput({ onSearch, onSearchSubmit }) {
  const [searchText, setSearchText] = useState("");

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
    onSearch(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit();
    setSearchText("");
  };

  return (
    <form className="m-2 flex items-center" onSubmit={handleFormSubmit}>
      <input
        className="flex-grow p-2 border border-gray-300 rounded-md text-black"
        type="search"
        value={searchText}
        onChange={handleInputChange}
        placeholder="Type your keyword..."
      />
      <button
        type="submit"
        className={`ml-2 py-2 px-4 font-bold rounded-md ${searchText.length > 0 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-blue-400'}`}
        disabled={searchText.length === 0}
      >
        🔍
      </button>
    </form>
  );
}

export default SearchInput;
