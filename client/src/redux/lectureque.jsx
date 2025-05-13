import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"



const url ="http://localhost:5000/api"
export const lecturelock = createApi({
    reducerPath:"lock",
    baseQuery:fetchBaseQuery({
        baseUrl:url,
        credentials:"include",
        prepareHeaders:(headers,{getState})=>{
           const token =getState().auth.token
           const storedToken = localStorage.getItem("token")
           console.log("Stored Tokenlock:", storedToken);
           console.log("Token from statelock:", token);
           if(token){
            headers.set("Authorization",`Bearer ${token}`)
            console.log("Headers set:", headers);

           }
           else if(storedToken){

              headers.set("Authorization",`Bearer ${storedToken}`)
              console.log("Headers set with stored token:", headers);
           }
           return headers
        }
    }),
    tagTypes:["lec"],
    endpoints:(builder)=>({
      getlecwithloc:builder.query({
        query:(courseid)=>`/getlocklec/${courseid}`
      }),
      completelec:builder.mutation({
       query:(inputdata)=> ({
        url:"/completelec",
        method:"POST",
        body:inputdata
       })
      }),
      getpurchaselec:builder.query({
        query:(course)=>`/purchaselec/${course}`
      }) 
    })

})

export const {useCompletelecMutation,
    useGetlecwithlocQuery,useGetpurchaselecQuery
}=lecturelock