import React, { useEffect, useState } from "react";
import useStore from "../../store/store";
import { useLocation } from "react-router-dom";
import { Search, X } from "lucide-react";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useStore();
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("collection") || location.pathname.includes("shop")) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location]);

  return showSearch && visible ? (
    <div className="bg-[#FFF1F4] border-y border-pink-200 py-6 flex flex-col items-center">

      {/* Search Input */}
      <div className="flex items-center w-[90%] sm:w-[55%] bg-white shadow-md rounded-full px-6 py-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search sarees, silk, Banarasi, cotton..."
          className="flex-1 outline-none bg-transparent text-sm text-pink-800 placeholder-pink-400"
        />

        <Search className="w-5 h-5 text-pink-600" />
      </div>

      {/* Close Button */}
      <button
        onClick={() => setShowSearch(false)}
        className="mt-4 text-pink-600 hover:text-pink-800 text-sm tracking-wide flex items-center gap-1"
      >
        <X className="w-4 h-4" /> Close
      </button>
    </div>
  ) : null;
};

export default SearchBar;

