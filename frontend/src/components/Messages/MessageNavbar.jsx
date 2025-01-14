import React from 'react'
import { useNavigate } from "react-router-dom";
import { FaRegPaperPlane, FaArrowLeft } from "react-icons/fa";
import '../navbar.css'

const MessageNavbar = () => {
    
    const navigate = useNavigate();
    
    const handleGoToDashboard = () => {
        navigate("/");
      };
  return (
    <nav className="p-4 shadow-lg rounded-t-lg navBar">
        <div className="flex justify-between items-center">
          <button
            onClick={handleGoToDashboard}
            className="bg-white text-green-900 p-2 rounded-full shadow-md hover:bg-gray-200 transition"
          >
            <FaArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-white tracking-wider">Message Area</h1>
          <span className="bg-white text-green-900 p-2 rounded-full shadow-md">
            <FaRegPaperPlane size={24} />
          </span>
        </div>
      </nav>
  )
}

export default MessageNavbar