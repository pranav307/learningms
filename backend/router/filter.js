import { Router } from "express";
import { filterProduct, getCategories, SearchProduct } from "../control/searchcontrol.js";



export const filterrouter = Router();
 filterrouter.route("/filter").get(filterProduct);
filterrouter.route("/getcategory").get(getCategories);
filterrouter.route("/search/:query").get(SearchProduct);