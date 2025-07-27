import React from 'react'
import {Outlet} from "react-router-dom"
import NavBar from '../layout/NavBar';
import Footer from '../layout/Footer';

const RootLayout = () => {
  return (
    <main>
      <NavBar/>
      <div>
        <Outlet />
      </div>
      <Footer />
    </main>
  );
}

export default RootLayout
