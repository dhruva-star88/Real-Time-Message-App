import React, { useEffect, useRef, useState } from "react";
import { FaPaperclip, FaRegPaperPlane } from "react-icons/fa";
import InputEmoji from "react-input-emoji";
import { getUser } from "../../api/UserRequest";
import { addMessage, getMessages } from "../../api/MessageRequest";
import {format} from "timeago.js"

const Chatbox = ({ currentUserId, chat, setSendMessage, receiveMessage}) => {
  const [clientData, setClientData] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const scroll = useRef()

  useEffect(() => {
    if (receiveMessage !== null && receiveMessage.chatId === chat?._id) {
            console.log("Chat ID",chat._id);
            console.log("Data received in ChatBox", receiveMessage);
            setMessages((prevMessages) => [...prevMessages, receiveMessage]);
        }
    }, [receiveMessage, chat]);

  // Fetching data for Header
  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUserId);
    if (userId) {
          const getUserData = async () => {
            try {
              const response = await getUser(userId); // Renamed destructured variable
              setClientData(response.data); // Assign correct data here
              console.log("Client data", clientData)
            } catch (error) {
              console.log(error);
            }
          };
          if(chat !== null) getUserData();
        }
  }, [chat, currentUserId])

  // Fetching data for Messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const {data} = await getMessages(chat._id);
        setMessages(data)
        console.log("Messages in the db",data)
      } catch (error) {
        console.log("Error Fetching Messages", error)
      }
    }
    if(chat !== null) fetchMessages()
  }, [chat])

  // Function to send the files
  const handleSelectFiles = (e) => {
    const file = e.target.files[0];  
    setSelectedFile(file);
    console.log("Selected File: ", file);
};

  // sending in the key board
  const handleChange = (newMessage) => {
    setNewMessage(newMessage)
  }
  
  const handleSendMessage = async (e) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append('senderId', currentUserId);
      formData.append('text', newMessage);
      formData.append('chatId', chat._id);
      if (selectedFile) {
          formData.append('attachment', selectedFile);
      }

      try {
          const { data } = await addMessage(formData);
          setMessages((prevMessages) => [...prevMessages, data]);
          setNewMessage("");
          setSelectedFile(null);
      } catch (error) {
          console.log(error);
      }

      const receiverId = chat.members.find((id) => id !== currentUserId);
      setSendMessage({ ...formData, receiverId });
  };

  // Always Scroll to the last Message
  useEffect(() => {
      scroll.current?.scrollIntoView({behaviour: "smooth"})
  }, [messages])


  return chat ? (
    <div className="flex flex-col h-full">
      <></>
      {/* Chat Header */}
      <div className="p-4 bg-gray-100 border-b flex items-center relative">
        <img
          src="profile.png"
          alt="Profile"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{clientData?.username}</h2>
        
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50"
      >
        {messages.map((msg, index) => (
          <div
            ref = {scroll}
            key={index}
            className={`mb-3 flex ${
              msg.senderId === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-lg shadow-md ${
                msg.senderId === currentUserId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <p>{msg.text}</p>
              <span className="block mt-1 text-xs opacity-80 text-right">{format(msg.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Sender */}
      <div className="p-4 bg-white border-t flex items-center">
        <label
          htmlFor="file-upload"
          className="cursor-pointer text-gray-600 hover:text-indigo-500 mr-4"
        >
          <FaPaperclip size={20} />
          <input id="file-upload" type="file" className="hidden" onChange={handleSelectFiles}/>
        </label>
        <InputEmoji
          value={newMessage}
          onChange={handleChange}
          onEnter={handleSendMessage}
          placeholder="Type a message"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
        >
          <FaRegPaperPlane size={25} />
        </button>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-full text-center text-gray-500 text-lg">
      <div className="flex flex-col justify-center items-center space-y-4">
        <div className="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="text-gray-700">Please Select a Contact to Message...</p>
      </div>
    </div>
  );
};

export default Chatbox;
