import React, { useEffect, useState } from "react";
import { getUser } from "../../api/UserRequest";

const Conversation = ({ data, currentUserId, onSelect, isSelected, online }) => {
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    const userId = data?.members?.find((id) => id !== currentUserId);
    console.log("Client's id", userId);

    if (userId) {
      const getUserData = async () => {
        try {
          const response = await getUser(userId); // Renamed destructured variable
          setClientData(response.data); // Assign correct data here
          console.log("Client's Data", response.data);
        } catch (error) {
          console.log(error);
        }
      };
      getUserData();
    }
  }, [data, currentUserId]); // Add dependencies to ensure effect runs when they change

  return (
    <div
      onClick={onSelect}
      className={`p-4 cursor-pointer transition-all duration-300 ease-in-out 
        ${isSelected ? "bg-blue-100 border-l-4 border-blue-500" : "bg-white"} 
        hover:bg-blue-50 hover:shadow-lg`}
    >
      <div className="flex items-center space-x-3">
        <img
          src="profile.png" // Replace with a dynamic image if needed
          alt=""
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <p className="font-medium text-gray-700">{clientData?.username || 'Unknown User'}</p>
          <p className={`text-sm ${online ? "text-green-500" : "text-gray-500"}`}>
          {online ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      <hr className="border-t mt-2" />
    </div>
  );
};

export default Conversation;
