import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const cartlink ="http://localhost:5000/api";
export const cartApi =  createApi({
    reducerPath:"cartslice",
    baseQuery:fetchBaseQuery({
        baseUrl:cartlink,
        credentials:"include",
        prepareHeaders:(headers,{getState})=>{
            const token = getState().auth.token;
            console.log("tt",getState());
            const stroredToken = localStorage.getItem("token");
            console.log("kkk",token);
            console.log("jjjj",stroredToken);
            if(token){
                headers.set("Authorization",`Bearer ${token}`);
                console.log(headers,"nnn");
            }
            else if(stroredToken){
                headers.set("Authorization",`Bearer ${stroredToken}`);
                console.log("cccccccc",headers);
            }
            return headers;
        },
    }),

    tagTypes:["cartitem","course"],

    endpoints:(builder)=>({
        getcourse:builder.query({
          query:()=>({
              url:'/getcourse',
             
          }),
          providesTags:["course"],
        }),
        createcart:builder.mutation({
            query:(inputdata)=>({
             url:'/addcart',
             method:"POST",
             body:inputdata,
            }),
            async onQueryStarted(inputdata,{dispatch,queryFulfilled}){
                const patchResult= dispatch(
                    cartApi.util.updateQueryData("getcart",undefined,(draft)=>{
                        if(Array.isArray(draft)){
                            draft.push({
                                id:Math.random().toString(36).substring(2,9),
                                 courseid:inputdata.courseid,

                            })
                           

                        }
                       
                    })
                )
                try {
                      await queryFulfilled;      
                } catch (error) {
                    patchResult.undo();
                    console.log(error);
                }
            },
            invalidatesTags:["cartitem"],
        }),

        getcart:builder.query({
            query:()=>
            ({
                  url:'/getitems',
                  
            }),
       providesTags:["cartitem"],     
                
        }),
        removeitem:builder.mutation({
           query:(id)=>({
            url:`/removeitem/${id}`,
            method:"DELETE",
           }),
           invalidatesTags:["cartitem"],
        })
    })
})

export const {
    useGetcartQuery,
    useRemoveitemMutation,
    useCreatecartMutation,
    useGetcourseQuery,
}
= cartApi