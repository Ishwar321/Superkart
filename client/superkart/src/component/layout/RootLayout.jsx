import React from 'react'
import { Outlet } from "react-router-dom"
import NavBar from '../layout/NavBar';
import Footer from '../layout/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './RootLayout.css';

const RootLayout = () => {
  return (
    <div className="app-container">
      {/* Navigation Header */}
      <header className="app-header">
        <NavBar />
      </header>
      
      {/* Main Content Area */}
      <main className="main-content" role="main">
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="app-footer">
        <Footer />
      </footer>
      
      {/* Global Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="custom-toast-container"
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
        progressClassName="custom-toast-progress"
      />
    </div>
  );
}

export default RootLayout
