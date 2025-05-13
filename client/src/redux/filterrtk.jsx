import { BASE_API_URL } from "@/constaturl";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


//const url ="http://localhost:5000/api";

export const filterRtk = createApi({
    reducerPath:"filterapi",
     baseQuery:fetchBaseQuery({
        baseUrl:BASE_API_URL,

     }),
     endpoints:(builder)=>({
        
        getfilter:builder.query({
            query:({filter,page,limit})=>{
               // useSearchParams is a React Hook, and calling it inside query breaks the Rules of Hooks.
                // Hooks cannot be called inside functions that are not React components.
                //use URLSearchParams 
                const query =new URLSearchParams({...filter,page,limit}).toString();
                 return `/filter?${query}`;

            },
        }),

        getSearch:builder.query({
         query:({query,page=1,limit =10})=>`/search/${query}?page=${page}&limit=${limit}`
        })
     })
})

export const {useGetfilterQuery,useGetSearchQuery} =filterRtk;