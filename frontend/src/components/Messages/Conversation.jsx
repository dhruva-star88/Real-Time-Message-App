import React, { useEffect, useState } from "react";
import { getUser } from "../../api/UserRequest";
import { updateReadStatus, getMessages } from "../../api/MessageRequest";

const Conversation = ({ data, currentUserId, onSelect, isSelected, online }) => {
  const [clientData, setClientData] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState([]); // To store unread messages

  useEffect(() => {
    const userId = data?.members?.find((id) => id !== currentUserId);

    if (userId) {
      const getUserData = async () => {
        try {
          const response = await getUser(userId);
          setClientData(response.data);
        } catch (error) {
          console.log(error);
        }
      };
      getUserData();
    }
  }, [data, currentUserId]);

  // Fetch all messages and filter unread messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getMessages(data._id);
        const unread = response.data.filter(
          (message) => !message.read && message.senderId !== currentUserId
        );
        setUnreadMessages(unread);
      } catch (error) {
        console.log("Error fetching messages", error);
      }
    };
    fetchMessages();
  }, [data._id]);

  const handleClick = async () => {
    if (unreadMessages.length > 0) {
      try {
        const updatePromises = unreadMessages.map((message) =>
          updateReadStatus(message._id)
        );
        await Promise.all(updatePromises);

        // Clear unread messages locally after updating
        setUnreadMessages([]);
      } catch (error) {
        console.log("Error updating read status", error);
      }
    }
    onSelect();
  };

  return (
    <div
  onClick={handleClick}
  className={`p-4 cursor-pointer transition-all duration-300 ease-in-out rounded-xl 
    ${
      unreadMessages.length > 0
        ? "border border-blue-400 bg-blue-50 shadow-md"
        : isSelected
        ? "bg-blue-100 border-l-4 border-blue-500 shadow-md"
        : "bg-white"
    }
    hover:bg-blue-50 hover:shadow-lg
    ${unreadMessages.length > 0 ? "mb-4" : "mb-2"} // Reduced margin when there are no unread messages
  `}
>
  {/* Added margin-bottom adjustment */}
  <div className="flex items-center space-x-4">
    <div className="relative">
      <img
        src="profile.png"
        alt="Profile"
        className="w-12 h-12 rounded-full border-2 border-gray-300"
      />
      {/* Green dot for online status */}
      {online && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white" />
      )}
    </div>
    <div className="flex-1">
      <p className="font-semibold text-gray-800 text-lg">
        {clientData?.username || "Unknown User"}
      </p>
      <p
        className={`text-sm ${
          online ? "text-green-500" : "text-gray-500"
        }`}
      >
        {online ? "Online" : "Offline"}
      </p>
    </div>
    {/* Number of unread messages */}
    {unreadMessages.length > 0 && (
      <div className="text-sm font-bold text-blue-500">
        {unreadMessages.length} new
      </div>
    )}
  </div>
  {isSelected && (
    <p className="text-sm mt-2 text-gray-500">
      Click to view the conversation.
    </p>
  )}
  <hr className="border-t mt-2" />
</div>
  );
};

export default Conversation;
