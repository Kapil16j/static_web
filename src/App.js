import React, { useEffect, useState } from 'react'


import { Link, BrowserRouter, Routes, Route, Switch, useLocation,Outlet } from "react-router-dom"
import Home from './components/home';
import Contact from './components/contact';

import Mini from './components/mini';
import ForestScene from './components/forest';







const App = () => {

  const location = useLocation();
  console.log("location", location)

  // const [user, setUser] = useState('')
  //   useEffect(() => {
  //     const userdata = JSON.parse(localStorage.getItem('user'));

  //     setUser(userdata)
  //     // console.log("user",user)

  // })



  return (
    <div>
     
      <Routes>

       
        <Route path="/" element={<Home />}></Route>
      
        <Route path="/Contact" element={<Contact />}></Route>
        <Route path="/minigame" element={<Mini />}></Route>
        <Route path="/forest" element={<ForestScene />}></Route>
       

      </Routes>
     
    

    </div>
  );
};

export default App;
