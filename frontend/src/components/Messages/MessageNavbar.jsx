import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { FaRegPaperPlane, FaArrowLeft } from "react-icons/fa";
import '../navbar.css'
import { getUser } from '../../api/UserRequest';

const MessageNavbar = ({currentUser}) => {
  const[user, setUserData] = useState(null)
  console.log("Current User", currentUser)

  
  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data } = await getUser(currentUser);  // Await the async function
        setUserData(data);
        console.log("User data to display on Navbar", data);  // Log the resolved data
      } catch (error) {
        console.error("Error fetching user details", error);
      }
    };

    if (currentUser) {  // Ensure currentUser is valid before fetching data
      getUserData();
    }
  }, [currentUser]);
    
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
          <h1 className="text-3xl font-bold text-white tracking-wider">Welcome, {user?.username}</h1>
          <span className="bg-white text-green-900 p-2 rounded-full shadow-md">
            <FaRegPaperPlane size={24} />
          </span>
        </div>
      </nav>
  )
}

export default MessageNavbar