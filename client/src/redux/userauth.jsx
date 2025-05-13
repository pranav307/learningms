import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn } from "./authslice";

const userurl = "http://localhost:5000/api";

export const userSlice = createApi({
  reducerPath: "authapi",
  baseQuery: fetchBaseQuery({
    baseUrl: userurl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["profile"],
  endpoints: (builder) => ({
    Registeruser: builder.mutation({
      query: (inputdata) => ({
        url: "/register",
        method: "POST",
        body: inputdata,
      }),
    }),
    Verifycode: builder.mutation({
      query: (inputdata) => ({
        url: "/codeverify",
        method: "POST",
        body: inputdata,
      }),
    }),
    SignIn: builder.mutation({
      query: (inputdata) => ({
        url: "/sign-in",
        method: "POST",
        body: inputdata,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({
            user: result.data.user,
            token: result.data.token,
          }));
        } catch (error) {
          console.log(error);
        }
      },
      invalidatesTags: ["profile"],
    }),
    UploadImage: builder.mutation({
      query: (file) => {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId =user ? user.id :null; 
        const formData = new FormData();
        formData.append("media", file);  // ✅ Ensure correct key ("media")
    
        return {
          url: `/uploadimage/${userId}`,
          method: "POST",
          body: formData,
          formData: true,  // ✅ Ensures proper handling
        };
      },
    }),
    
    getProfile: builder.query({
      query: () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user ? user.id : null;
        return {
          url: `/getprofile/${userId}`,
        };
      },
      providesTags: ["profile"],
    }),
    createphoto:builder.mutation({
      query:(inputdata)=>({
        url:'/createphoto',
        method:"POST",
        body:inputdata,
      })
    }),
  }),
});

export const { 
  useRegisteruserMutation, 
  useVerifycodeMutation, 
  useSignInMutation, 
  useUploadImageMutation,
  useGetProfileQuery, 
  useCreatephotoMutation,
} = userSlice;