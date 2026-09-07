import React from 'react';
//import Navbar from './components/NavbarMenu';
import Abovenavbar from './components/Abovenavbar';
import NavbarMenu from './components/NavbarMenu';
import ImageSlider from './components/ImageSlider';
import Footer from './components/Footer';
function AppContents() {
  return (
    <div>
    <Abovenavbar/>
    <NavbarMenu/>
   <ImageSlider/>
   <Footer/>
    </div>
  );
}

export default AppContents;