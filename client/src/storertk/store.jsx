import { configureStore } from "@reduxjs/toolkit";
import {userSlice} from "@/redux/userauth";
import authreducer from "@/redux/authslice";
import { adminSlice } from "@/redux/admincourse";
import { lecturertk } from "@/redux/lecturecrud";
import { cartApi } from "@/redux/cartredux";
import { creatorSlice } from "@/redux/creatorlecture";
import { studentslice } from "@/redux/studentredux";
import filterReducer from "./filterslice";
import { filterRtk } from "@/redux/filterrtk";
import { lecturelock } from "@/redux/lectureque";
import { razorpayrtk } from "./razorpayrtk";
import { Quizertk } from "./quizertk";



export const store = configureStore({
    reducer:{
        [userSlice.reducerPath] :userSlice.reducer,
        auth:authreducer,
        [adminSlice.reducerPath]:adminSlice.reducer,
        [lecturertk.reducerPath]:lecturertk.reducer,
        [cartApi.reducerPath]:cartApi.reducer,
        [creatorSlice.reducerPath]:creatorSlice.reducer,
        [studentslice.reducerPath]:studentslice.reducer,
        filters:filterReducer,
        [filterRtk.reducerPath]:filterRtk.reducer,
        [lecturelock.reducerPath]:lecturelock.reducer,
        [razorpayrtk.reducerPath]:razorpayrtk.reducer,
        [Quizertk.reducerPath]:Quizertk.reducer,
        

    },
    middleware:(DefaultMiddleware)=>DefaultMiddleware().concat(userSlice.middleware,adminSlice.middleware,lecturertk.middleware,
        cartApi.middleware,creatorSlice.middleware,studentslice.middleware,filterRtk.middleware
    ,lecturelock.middleware,razorpayrtk.middleware,Quizertk.middleware)
});
 
export default store;