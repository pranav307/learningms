import { BASE_API_URL } from "@/constaturl";
import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";



//const quizeurl ="http://localhost:5000/api"; 
export const Quizertk = createApi({
    reducerPath:"quize",
    baseQuery:fetchBaseQuery({
       baseUrl:BASE_API_URL,
       creadentials:"include",
       prepareHeaders:(headers,{getState})=>{
         const token = getState().auth.token;
         const storedToken = localStorage.getItem("token");
         if(token){
            headers.set("Authorization",`Bearer ${token}`)
         }
         else if(storedToken){
            headers.set("Authorization",`Bearer ${storedToken}`)
            console.log("Headers set with stored token:", headers);
         }
         return headers
       }
    }),
    tagTypes:["quize"],
    endpoints:(builder)=>({
    createquize:builder.mutation({
        query:(inputData)=>({
            url:'/addquize',
            method:"POST",
            body:inputData,
        }),
        invalidatesTags:["quize"],
    }),
    getquize:builder.query({
        query:(lecture)=>`/getquize/${lecture}`,
        providesTags:["quize"]
    })
    })
})

export const   {useCreatequizeMutation,useGetquizeQuery} = Quizertk;