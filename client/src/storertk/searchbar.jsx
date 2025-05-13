import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useGetSearchQuery } from "@/redux/filterrtk";
import { Search, SearchCheckIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetProfileQuery } from "@/redux/userauth";

export function SearchBar() {
  const [searchterm, setsearchterm] = useState("");
  const [debounceSearch, setdebouncesearch] = useState("");
  const navigate = useNavigate();
 

  // Debounce the search input (waits 500ms before updating debounceSearch)
  useEffect(() => {
    const timer = setTimeout(() => {
      setdebouncesearch(searchterm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchterm]);

  // Fetch search results using RTK Query (Only if there's a search term)
  const { data, isLoading, error } = useGetSearchQuery(
    debounceSearch ? { query: debounceSearch, page: 1, limit: 5 } : undefined,
    { skip: !debounceSearch }
  );

  

  // Handle search input change
  const handleSearch = (e) => {
    setsearchterm(e.target.value);
  };

  // Navigate to search results when Enter is pressed
  const handlekey = (e) => {
    if (e.key === "Enter" && debounceSearch) {
      navigate(`/search/${debounceSearch}`);
    }
  };

  

  return (
    <Popover className="backdrop-blur-2xl ">
      <PopoverTrigger className="flex justify-center ml-16 gap-2 ">
        <div className="flex items-center justify-center rounded-md p-2 gap-2 ">
          <input
            type="text"
            className="sm:w-96 w-32 sm:h-2xl border rounded-md px-6"
            placeholder="search course"
          ></input>
          <button className="hover:bg-blue-300 rounded-md flex items-center justify-center">
            <Search className="" />
          </button>
        </div>
      </PopoverTrigger>

      <PopoverContent>
        <div className="flex items-center mr-4 p-2 gap-2">
          <input
            type="text"
            value={searchterm}
            onChange={handleSearch}
            onKeyDown={handlekey}
            className="outline-none p-4"
            placeholder="Search..."
          />
          <button onClick={() => navigate(`/search/${debounceSearch}`)}>
            <SearchCheckIcon />
          </button>
        </div>
        <div className="p-4 backdrop-blur-xl w-2xl">
          {isLoading && <p>Loading...</p>}
          {error && <p className="text-red-500">Error in fetching courses</p>}

          {/* Search Results */}
          {debounceSearch && (
            data?.searchResult?.length > 0 ? (
              data.searchResult.map((item) => (
                <div key={item._id} className="p-2 border-b">
                  <p className="font-semibold">{item.courseTitle}</p>
                  <p className="text-sm text-gray-500">{item.category}</p>
                 
                </div>
              ))
            ) : (
              <p className="text-gray-500">No results found</p>
            )
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}