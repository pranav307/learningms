
import { Route, Routes } from 'react-router-dom'
import SignUpForm from './component/signup';
import SignInForm from './component/signin';
import {Verifycode} from './component/verifycode';
import { Coursecreate } from './admincomponets/coursecreate';

import { GetProfile } from './component/getProfile';
import { Getproductbyid } from './admincomponets/getproductbyid';
import { Createlec } from './admincomponets/createlecture';

import { GetCartItem } from './component/getcartItem';
import { Createcart } from './component/cartcreate';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { userLoggedIn, userLogOut } from './redux/authslice';
import { Checkauth } from './common/checkauth';

import { Unauth } from './unauth';

import { Getcrecourse } from './creator/getcourse';
import { CreatorLayout } from './creator/creatorLayout';
import { Creatorlecture } from './creator/createlec';
import { Adminlayout } from './admincomponets/adminLayot';
import { Studentlayout } from './studentcomponent/studentlayout';
import { Getfreecourse } from './studentcomponent/getfreecourse';
import { SearchResult } from './storertk/getSearchresult';

import { FilterCourse } from './storertk/listfilter';
import { GetProductAdmin } from './admincomponets/getitemadmin';
import { GetlectureAdmin } from './admincomponets/getlecadmin';
import { GetProduct } from './admincomponets/getproduct';
import { LectureList } from './admincomponets/lecturelist';

import { Getadminproductbyid } from './admincomponets/getadminproductbyid';
import { Cancelorder } from './order/cancel';
import { Purchaselec } from './payment/purchaselec';
import GetFreeCourseById from './component/getfreecoursebyid';
import { Orderscom } from './payment/userorder';
import { Createquize } from './quize/quizeform';
import { Getquize } from './quize/getquize';
import { Getallorders } from './quize/getallorder';





function App() {
 const dispatch = useDispatch();
const { user, isAuthenticated } = useSelector((state) => state.auth);
const [checkedAuth, setCheckedAuth] = useState(false); // ✅ added

useEffect(() => {
  const storedToken = localStorage.getItem("token");
  const storeuser = localStorage.getItem("user");
  console.log("ooo", storedToken);
  console.log("rrr", storeuser);

  if (storedToken && storeuser) {
    dispatch(userLoggedIn({
      token: storedToken,
      user: JSON.parse(storeuser),
    }));
  } else {
    dispatch(userLogOut());
  }

  setCheckedAuth(true); // ✅ only dispatch after we’ve checked
}, [dispatch]);

if (!checkedAuth) {
  return null; // ✅ optional: can show loader instead
}

  
  return (
    <>


    <Routes>
       <Route path='/filter' element={<FilterCourse/>}></Route>
      <Route path='/' element={<SignUpForm/>}></Route>
      <Route path='/search/:query' element={<SearchResult/>}></Route>
      <Route path='/signin' element={<SignInForm/>}></Route>
      <Route path='/verifyemail/:username' element={<Verifycode/>}></Route>
      
      <Route path='/admin' element={
        <Checkauth isAuthenticated={isAuthenticated} user={user}>
          <Adminlayout/>
        </Checkauth>}>
        <Route path='adminpro' element={<GetProfile/>}></Route>
      <Route path='course' element={<Coursecreate/>}></Route>
      <Route path='get' element={<GetProductAdmin/>}></Route>
      <Route path='createlec' element={<Createlec/>}></Route>
      <Route path='lec/:courseId' element={<GetlectureAdmin/>}></Route>
      <Route path='admincourse/:id' element={<Getadminproductbyid/>}></Route>
      <Route path ='adminquize'  element={<Createquize/>}></Route>
      <Route path='getquize/:lecture'  element={<Getquize/>}></Route>
      <Route path='getallorders' element={<Getallorders/>}></Route>
      
     
      
      </Route>
      <Route path='/creator' element={
      <Checkauth isAuthenticated={isAuthenticated} user={user}><CreatorLayout/>
      </Checkauth>}>
      <Route path='creatorcor' element={<Coursecreate/>}></Route>
      
      <Route path='getcrecourse' element={
        <Getcrecourse/>
        
      }></Route>
    <Route path='creatorlecture' element={<Creatorlecture/>}></Route>
    <Route path='getitem' element={<GetCartItem/>}></Route>
    <Route path='addcart' element={<Createcart/>}></Route>
    <Route path='freecourse' element={<Getfreecourse/>}></Route>
    <Route path='creprofile' element={<GetProfile/>}></Route>
    <Route path='getpro' element={<GetProduct/>}></Route>
    <Route path='getproductidcre/:id' element={<Getproductbyid/>}></Route>
    <Route path='freelec/:id' element={<LectureList/>}></Route>
    <Route path="purchaselec/:id" element={<Purchaselec/>}></Route>
    <Route path='getfreecoursebyidcre/:id' element={<GetFreeCourseById/>}></Route>
    <Route path='getordercre' element={<Orderscom/>}></Route>
    <Route path='createquize' element={<Createquize/>}></Route>
    <Route path='crelec/:courseId' element={<GetlectureAdmin/>}></Route>
     <Route path='getquize/:lecture'  element={<Getquize/>}></Route>
      
  </Route>
  <Route path='/student' element={
    <Checkauth isAuthenticated={isAuthenticated} user={user}>
      <Studentlayout/>
    </Checkauth>
  }>
    <Route path='stuprofile' element={<GetProfile/>}></Route>
    <Route path='getitem' element={<GetCartItem/>}></Route>
    <Route path='freestu'element={<Getfreecourse/>}></Route>
    <Route path='addcart' element={<Createcart/>}></Route>
    <Route path='getproductidstu/:id' element={<Getproductbyid/>}></Route>
    <Route path ='getlocklecture/:id' element={<LectureList/>}></Route>
    <Route path='getfreecoursebyid/:id' element={<GetFreeCourseById/>}></Route>
    
    <Route path ='freelec/:id' element={<LectureList/>}></Route>
    <Route path="purchaselec/:id" element={<Purchaselec/>}></Route>
    <Route path='getproducts' element={<GetProduct/>}></Route>
    <Route path='getorders' element={<Orderscom/>}></Route> 
    <Route path='getquize/:lecture'  element={<Getquize/>}></Route>

  </Route>
 
  <Route path='/order/cancel' element={<Cancelorder/>}></Route>
      
      
      <Route path='/unauth' element={<Unauth/>}></Route>
    </Routes>
    
    
       
    </>
  )
}

export default App
