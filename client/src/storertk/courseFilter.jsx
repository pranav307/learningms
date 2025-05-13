import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "./filterslice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function CourseFilter({ isOpen, setIsopen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const filter = useSelector((state) => state.filter) || {
    category: [],
    courseLevel: [],
    minprice: "",
    maxprice: "",
    sortBy: "",
  };

  const [localfilter, setLocalfilter] = useState(filter);
  const [categories, setcategories] = useState([]);

  const handleChange = (e) => {
    setLocalfilter({ ...localfilter, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchcategory = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/getcategory");
        setcategories(response.data?.categories ?? []);
        console.log("Fetched categories:", response.data?.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setcategories([]); // Ensure categories is always an array
      }
    };

    fetchcategory();
  }, []);

  const handlecheck = (e) => {
    const { name, value, checked } = e.target;

    setLocalfilter((prev) => {
      if (name === "courseLevel" || name === "category") {
        return {
          ...prev,
          [name]: checked
            ? [...prev[name], value] // Add value if checked
            : prev[name].filter((v) => v !== value), // Remove value if unchecked
        };
      }

      // Handle non-array fields
      return {
        ...prev,
        [name]: value,
      };
    });

    setTimeout(() => {
      console.log("Updated localfilter:", { ...localfilter });
    }, 0);
  };

  const hanSubmit = (e) => {
    e.preventDefault();

    console.log("Submitting filter:", localfilter);

    // Validate the filter before dispatching
    if (localfilter.minprice && isNaN(localfilter.minprice)) {
      console.error("Min price must be a valid number.");
      return;
    }

    if (localfilter.maxprice && isNaN(localfilter.maxprice)) {
      console.error("Max price must be a valid number.");
      return;
    }

    // Convert courseLevel array to a comma-separated string for the backend
    const filterToSubmit = {
      ...localfilter,
      courseLevel: localfilter.courseLevel.join(","),
    };

    dispatch(setFilters(filterToSubmit));
    navigate("/filter");
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-r from-emerald-50 to-fuchsia-100 shadow-lg p-4 z-50 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <button onClick={() => setIsopen(false)} className="text-red-500">
        Close
      </button>
      <div className="flex ">
        <form onSubmit={hanSubmit} className="space-y-6">
          <div className="flex gap-4 flex-col mt-2 text-black p-2">
            <input
              className="p-2"
              type="number"
              name="minprice"
              placeholder="Enter minimum price (e.g., 0)"
              onChange={handleChange}
            />
            <input
              className="p-2"
              type="number"
              name="maxprice"
              placeholder="Enter maximum price (e.g., 1000)"
              onChange={handleChange}
            />
          </div>

          <select name="sortBy" onChange={handleChange}>
            <option value="" className="font-bold">SortBy</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>

          <h1 className="font-extrabold">Category</h1>
          <div className="flex flex-col gap-2">
            {categories.length > 0 ? (
              categories.map((catego) => (
                <label key={catego} className="flex gap-2">
                  <input
                    type="checkbox"
                    name="category"
                    value={catego}
                    onChange={handlecheck}
                  />
                  <h1 className="font-bold hover:text-blue-500">{catego}</h1>
                </label>
              ))
            ) : (
              <p>No categories available</p>
            )}
          </div>

          <h1 className="font-extrabold">Course Level</h1>
          <div className="flex flex-col">
            <label className="flex gap-2">
              <input
                type="checkbox"
                name="courseLevel"
                value="Beginner"
                onChange={handlecheck}
              />
              <h1>Beginner</h1>
            </label>
            <label className="flex gap-2">
              <input
                type="checkbox"
                name="courseLevel"
                value="Intermediate"
                onChange={handlecheck}
              />
              <h1>Intermediate</h1>
            </label>
            <label className="flex gap-2">
              <input
                type="checkbox"
                name="courseLevel"
                value="Advanced"
                onChange={handlecheck}
              />
              <h1>Advanced</h1>
            </label>
          </div>

          <button
            type="submit"
            className="font-extrabold border-2 p-2 rounded-md w-full bg-blue-100 hover:bg-blue-600 hover:scale-110"
          >
            Filter
          </button>
        </form>
      </div>
    </div>
  );
}