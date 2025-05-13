import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const adminurl = "http://localhost:5000/api";

export const adminSlice = createApi({
  reducerPath: "adminapi",
  baseQuery: fetchBaseQuery({
    baseUrl: adminurl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      console.log("eeeeeeeeeeeee",getState());
      const storedToken = localStorage.getItem("token");
      console.log("Stored Token:", storedToken);
      console.log("Token from state:", token);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        console.log("Headers set:", headers);
      } else if (storedToken) {
        headers.set("Authorization", `Bearer ${storedToken}`);
        console.log("Headers set with stored token:", headers);
      }
      return headers;
    },
  }),
  tagTypes: ["coursecre"],
  endpoints: (builder) => ({
    
    createcourse: builder.mutation({
      query: (inputdata) => ({
        url: "/createcourse",
        method: "POST",
        body: inputdata,
      }),
      async onQueryStarted(inputdata, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          adminSlice.util.updateQueryData("getcourse", undefined, (draft) => {
            if (Array.isArray(draft)) {
              draft.push({
                id: Math.random().toString(36).substring(2, 9),
                courseTitle: inputdata.courseTitle,
                category: inputdata.category,
                description: inputdata.description,
                coursePrice: inputdata.coursePrice,
                courseLevel: inputdata.courseLevel,
                Thumbnail: inputdata.Thumbnail,
                isfree:inputdata.isfree,
              });
            }
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.error("Create course error:", error);
        }
      },
      invalidatesTags: ["coursecre"],
    }),
    updateCourse: builder.mutation({
      query: ({ id, inputdata }) => ({
        url: `/updatecourse/${id}`,
        method: "PUT",
        body: inputdata,
      }),
      invalidatesTags:["coursecre"]
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/deletecourse/${id}`,
        method: "DELETE",
      }),
    }),
    getcourse: builder.query({
      query: () => "/getcourse",
      providesTags: ["coursecre"],
    }),
    getcoursebyid: builder.query({
      query: (id) => `/getpro/${id}`,
      providesTags: ["coursecre"],
    }),
    getcoursebycreator:builder.query({
      query:()=> '/getcrecourse',
      providesTags:["coursecre"],
        
    }),
    getcoursebyidcre:builder.query({
      query:(courseId) => `/getbyidcre/${courseId}`,
      providesTags:["coursecre"],
    })
  }),
});

export const {
  useCreatecourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetcourseQuery,
  useGetcoursebyidQuery,
  useGetcoursebycreatorQuery,
  useGetcoursebyidcreQuery
} = adminSlice;