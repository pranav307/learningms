import { courseModel } from "../model/course.js";



export const SearchProduct = async (req, res) => {
  const { query } = req.params; // Extracts data from the URL path (dynamic segments in the route).
  const { page, limit } = req.query; // Extracts data from the query string (?key=value pairs in the URL)

  if (!query) {
    return res.status(200).json({ message: "enter the term to search" });
  }

  // Pagination
  const pagenumber = Number(page) || 1;
  const pagesize = Number(limit) || 10;
  const skip = (pagenumber - 1) * pagesize; // Skip previous pages

  let searchResult;
  let totalResult;

  // Full-text search
  searchResult = await courseModel.find({ $text: { $search: query } })
    .skip(skip)
    .limit(pagesize);

  totalResult = await courseModel.countDocuments({ $text: { $search: query } });

  // If Text Search Fails, Use Regex
  if (searchResult.length === 0) {
    searchResult = await courseModel.find({
      $or: [
        { courseTitle: { $regex: new RegExp(query, "i") } },
        { category: { $regex: new RegExp(query, "i") } },
        { description: { $regex: new RegExp(query, "i") } },
      ],
    }).skip(skip).limit(pagesize);

    totalResult = await courseModel.countDocuments({
      $or: [
        { courseTitle: { $regex: new RegExp(query, "i") } },
        { category: { $regex: new RegExp(query, "i") } },
        { description: { $regex: new RegExp(query, "i") } },
      ],
    });
  }

  if (searchResult.length === 0) {
    return res.status(201).json({ message: "no course found" });
  }

  return res.json({
    searchResult,
    totalResult,
    totalpages: Math.ceil(totalResult / pagesize),
    currentpage: pagenumber,
    pagesize,
  });
};


export const filterProduct = async (req, res) => {
  try {
      const { category,courseLevel, minprice, maxprice, sortBy, page, limit } = req.query;

      let filter = {};
      if (category) filter.category = { $in: category.split(",") };
     
      if (courseLevel) filter.courseLevel = courseLevel;
      if (minprice || maxprice) {
          filter.coursePrice = {
              ...(minprice ? { $gte: Number(minprice) } : {}),
              ...(maxprice ? { $lte: Number(maxprice) } : {})
          };
      }

      // Sorting Options
      let sortoption = {};
      if (sortBy === "price_acs") sortoption.coursePrice = 1;
      if (sortBy === "price_desc") sortoption.coursePrice = -1;
      if (sortBy === "newest") sortoption.createdAt = -1; // Fix here

      // Pagination
      const pagenumber = Number(page) || 1;
      const pagesize = Number(limit) || 10;
      const skip = (pagenumber - 1) * pagesize;

      // Fetch Courses
      const course = await courseModel.find(filter).sort(sortoption).skip(skip).limit(pagesize);
      const totalcourse = await courseModel.countDocuments(filter); // Fix here

      return res.status(200).json({
          course,
          totalpages: Math.ceil(totalcourse / pagesize),
          currentpage: pagenumber,
      });
  } catch (error) {
      return res.status(500).json({ message: "Server Error", error });
  }
};


export const getCategories =async(req,res)=>{
    

  const categories = await courseModel.distinct("category");
  console.log('kl',categories);
  return res.status(201).json({categories});
  
}