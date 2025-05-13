import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"



const orderurl = "http://localhost:5000/api";

export const razorpayrtk = createApi({
    reducerPath:"orderApi",
    baseQuery:fetchBaseQuery({
        baseUrl:orderurl,
        credentials:"include",
        prepareHeaders:(headers,{getState})=>{
            const token = getState().auth.token;
            console.log("user order after login",token)
            const storeToken = localStorage.getItem("token")
            console.log("Token from statelock:", token);
            if(token){
                headers.set("Authorization",`Bearer ${token}`)

            }
            else{
                headers.set("Authorization",`Bearer${storeToken}`)
                console.log("Headers set with stored token:", headers);
            }
            return headers;

        }
    }),
    endpoints:(builder)=>({
        getorder:builder.query({
            query:()=> '/getorder',
        }),
        createsession:builder.mutation({
            query:(body)=>({
                 url:"/session",
                 method:"POST",
                 body,
            })
        }),
        verifyPayment:builder.mutation({
            query:(paymentdetails)=>({
               url:"/verifypayment",
               method:"POST",
               body:paymentdetails, 
            })
        }),
        getallorders:builder.query({
            query:()=>'/allorders'
        })
    })
})

export const {
useCreatesessionMutation,useGetorderQuery,useVerifyPaymentMutation,useGetallordersQuery
} = razorpayrtk