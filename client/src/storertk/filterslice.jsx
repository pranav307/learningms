import { createSlice } from "@reduxjs/toolkit";



const intialState = {

    filter:{
        category:[],courseLevel:[],
        minprice:"",maxprice:"",sortBy:"",

    },
    currentpage:1,
    limit:5,

}

const filterSlice = createSlice({
    name:"filters",
    initialState:intialState,
    reducers:{
        setFilters:(state,action)=>{
              state.filter = {...state.filter,...action.payload};
              state.currentpage=1;
        },
        
            setPage:(state,action)=>{
                state.currentpage=action.payload;
            },
        
    },
});

export const {setFilters,setPage} =filterSlice.actions;
export default filterSlice.reducer;