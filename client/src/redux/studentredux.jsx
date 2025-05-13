import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const studenturl = "http://localhost:5000/api";

export const studentslice = createApi({
    reducerPath: "studentapi",
    baseQuery: fetchBaseQuery({
        baseUrl: studenturl,
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth?.token; // Ensure `auth` exists before accessing `token`
            const storeToken = localStorage.getItem("token");

            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            } else if (storeToken) {
                headers.set("Authorization", `Bearer ${storeToken}`);
            }

            return headers;
        },
    }),
    endpoints: (builder) => ({
        getfreecourse: builder.query({  // ✅ Fixed function signature
            query: () => "/getfreecourse",
        }),
    }),
});

export const { useGetfreecourseQuery } = studentslice;
