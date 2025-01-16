import React, { useState, useRef, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import Conversation from "../components/Messages/Conversation";
import Chatbox from "../components/Messages/Chatbox";
import MessageNavbar from "../components/Messages/MessageNavbar";
import { useSelector } from "react-redux";
import { createChat, userChats } from "../api/ChatRequest";
import ClientSelector from "../components/Messages/ClientSelector"; // Importing ClientSelector
import {io} from "socket.io-client"
import { useNavigate } from "react-router-dom";

const MessageArea = () => {
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(320);
  const [selectedContact, setSelectedContact] = useState(null);
  const [clientChats, setClientChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [showClientSelector, setShowClientSelector] = useState(false); // Popup state
  const [onlineUsers, setOnlineUsers] = useState([])
  const [sendMessage, setSendMessage] = useState(null)
  const [receiveMessage, setReceiveMessage] = useState(null)

  const navigate = useNavigate()
  const resizableRef = useRef(null);
  const socket = useRef()
  
  // getting spUser id from the redux store..here its basically "currentUser"
  const selectedUser = useSelector((state) => state.user.selectedUser);

  const user = selectedUser?._id;
  
  // Sending Message to Socket Server
  useEffect(() => {
    if(sendMessage !== null){
        socket.current.emit('send-message', sendMessage)
        console.log("Sending Message", sendMessage)
    }
}, [sendMessage])

  useEffect(() => {
    socket.current = io('http://localhost:8800')
    // To subscribe(register) for the server
    socket.current.emit("new-user-add", user)
    // To catch the emitted User from the socket.io server
    socket.current.on("get-users", (users) => {
        setOnlineUsers(users)
        console.log("Online Users", onlineUsers)
    })
}, [user])

  // Receiving Message from Socket Server
  useEffect(() => {
    socket.current.on('receive-message', (data) => {
        console.log("Recieved Message", data)
        setReceiveMessage(data)
    })
  }, [])

  // To handle the API crash  
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Getting chats-list
  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(user);
        setClientChats(data);
        console.log("Chats", clientChats)
      } catch (error) {
        console.log("Cannot Fetch the chats", error);
      }
    };
    getChats();
    console.log("Chats in clientChats", clientChats)
  }, [user]);

  // Creating a chat between the spUser and ClientUser
  const handleAddClient = async (client) => {
    try {
      const { data } = await createChat(user, client._id);
      console.log('Chat created:', data);

      // Add the newly created chat to the clientChats state
      setClientChats((prevChats) => [...prevChats, data]);  // Append the new chat
      setShowClientSelector(false);
      // Call onSelect callback to handle the client addition externally
    } catch (error) {
      console.log('Failed to create chat:', error);
    }
  };

  console.log("Current Chat", currentChat)

  const handleMouseDown = (e) => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (resizableRef.current) {
      const newWidth = e.clientX;
      setLeftSidebarWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // Checking the online status
  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user)
    const online = onlineUsers.find((eachUser) => eachUser.userId === chatMember)
    return online ? true : false
    }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-gray-100 to-gray-200">
      <MessageNavbar currentUser = {user} />
      {/* Left Side */}
      <div className="flex flex-1 overflow-y-auto">
        <div
          className="bg-white p-4 border-r overflow-y-auto"
          style={{ width: leftSidebarWidth }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Clients</h2>
            <button
              onClick={() => setShowClientSelector(true)}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
            >
              <FaPlus />
            </button>
          </div>
          {clientChats.map((chat) => (
            <Conversation
              key={chat._id}
              data={chat}
              currentUserId={user}
              onSelect={() => setCurrentChat(chat)}
              isSelected={selectedContact?._id === chat._id}
              online = {checkOnlineStatus(chat)}
            />
          ))}
        </div>
        <div
          ref={resizableRef}
          onMouseDown={handleMouseDown}
          className="cursor-ew-resize bg-gray-300 w-1"
        ></div>
        {/* Right Side */}
        <div className="flex-1">
          <Chatbox
            currentUserId={user}
            chat={currentChat}
            setSendMessage={setSendMessage}
            receiveMessage = {receiveMessage}
          />
        </div>
        {showClientSelector && (
          <ClientSelector
            onClose={() => setShowClientSelector(false)}
            chats={clientChats}
            handleAddClient={handleAddClient}  // Passing the function as prop
          />
        )}
      </div>
    </div>
  );
};

export default MessageArea;
