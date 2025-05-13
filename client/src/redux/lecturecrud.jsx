import { BASE_API_URL } from "@/constaturl";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//const lectureurl = "http://localhost:5000/api";

export const lecturertk = createApi({
  reducerPath: "lectureapi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_API_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
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
  tagTypes: ["lec", "course"],
  endpoints: (builder) => ({
    getcourses: builder.query({
      query: () => "/getcourse",
      providesTags: ["course"],
    }),
    createlec: builder.mutation({
      query: (inputdata) => ({
        url: "/createlec",
        method: "POST",
        body: inputdata,
      }),
      async onQueryStarted(inputdata, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          lecturertk.util.updateQueryData("getcourselec", undefined, (draft) => {
            if (Array.isArray(draft)) {
              draft.push({
                lectureid:Math.random().toString(36).substring(2,9) ,
                vedioUrl: inputdata.vedioUrl,
                title: inputdata.title,
                duration: inputdata.duration,
                order: inputdata.order,
                courseid: {_id:inputdata.courseid},
              });
            }
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.error("Create lecture error:", error);
        }
      },
      invalidatesTags: ["lec","course"],

    }),
    getcourselec: builder.query({
      query: (courseId) => `/getcourselec/${courseId}`,
      providesTags: ["lec","course"],
    }),
    updateLecture: builder.mutation({
      query: ({inputdata,lectureid}) => ({
        url: `/updatelecture/${lectureid}`,
        method: "PUT",
        body: inputdata,
      }),
      invalidatesTags: ["lec"],
    }),
    deletelec: builder.mutation({
      query: (id) => ({
        url: `/deletelec/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["lec","course"],
    }),
  }),
});

export const {
  useCreatelecMutation,
  useGetcourselecQuery,
  useUpdateLectureMutation,
  useDeletelecMutation,
  useGetcoursesQuery,
} = lecturertk;