import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const creatorurl = "http://localhost:5000/api";
export const creatorSlice = createApi({
  reducerPath: "creatorapi",
  baseQuery: fetchBaseQuery({
    baseUrl: creatorurl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      console.log("eeeeeggg", getState());
      const storedToken = localStorage.getItem("token");
      console.log("pppp", storedToken);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      } else if (storedToken) {
        headers.set("Authorization", `Bearer ${storedToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ["creatorlec", "coursecre"],
  endpoints: (builder) => ({
    getcretorcourse: builder.query({
      query: () => '/getcrecourse',
      providesTags: ["coursecre"],
    }),
    createcretorlec: builder.mutation({
      query: (inputdata) => ({
        url: '/createlec',
        method: "POST",
        body: inputdata,
      }),
      async onQueryStarted(inputdata, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          creatorSlice.util.updateQueryData(
            "getcreatorlec", undefined, (draft) => {
              if (Array.isArray(draft)) {
                draft.push({
                  id: Math.random().toString(36).substring(2, 9),
                  vedioUrl: inputdata.vedioUrl,
                  title: inputdata.title,
                  duration: inputdata.duration,
                  order: inputdata.order,
                  courseid: inputdata.courseid
                });
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.log("wwwwwggg", error);
        }
      },
      invalidatesTags: ["creatorlec"],
    }),
    getcreatorlec: builder.query({
      query: () => '/getcourselec',
      providesTags: ["creatorlec"],
    }),
  }),
});

export const {
  useGetcretorcourseQuery,
  useCreatecretorlecMutation,
  useGetcreatorlecQuery,
} = creatorSlice;