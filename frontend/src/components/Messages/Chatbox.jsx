import React, { useEffect, useRef, useState } from "react";
import { FaPaperclip, FaRegPaperPlane, FaTimesCircle, FaDownload, FaFileAlt, FaFilePdf, FaFileWord, FaFileAudio, FaFileImage } from "react-icons/fa"; 
import InputEmoji from "react-input-emoji";
import { getUser } from "../../api/UserRequest";
import { addMessage, getMessages } from "../../api/MessageRequest";
import { format } from "timeago.js";

const Chatbox = ({ currentUserId, chat, setSendMessage, receiveMessage }) => {
  const [clientData, setClientData] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null); // State for file preview
  const scroll = useRef();

  // Update messages when a new message is received
  useEffect(() => {
    if (receiveMessage !== null && receiveMessage.chatId === chat?._id) {
            console.log("Chat ID",chat?._id);
            console.log("Data received in ChatBox", receiveMessage);
            setMessages((prevMessages) => [...prevMessages, receiveMessage]);
        }
    }, [receiveMessage, chat]);

  // Fetching user data for header
  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUserId);
    if (userId) {
      const getUserData = async () => {
        try {
          const response = await getUser(userId);
          setClientData(response.data);
        } catch (error) {
          console.log(error);
        }
      };
      if (chat !== null) getUserData();
    }
  }, [chat, currentUserId]);

  // Fetching messages from the backend
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat._id);
        setMessages(data);
      } catch (error) {
        console.log("Error Fetching Messages", error);
      }
    };
    if (chat !== null) fetchMessages();
  }, [chat]);

  // Function to handle file selection
  const handleSelectFiles = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    // Generate a preview of the selected file
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview({ type: "image", src: reader.result });
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview({ type: "file", name: file.name, type: file.type });
      }
    } else {
      setFilePreview(null);
    }
  };

  // Function to handle message changes
  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  // Function to send the message
  const handleSendMessage = async (e) => {
    const formData = new FormData();
    formData.append("chatId", chat._id);
    formData.append("senderId", currentUserId);
    formData.append("text", newMessage);

    let attachmentType = "unknown"; // Default to unknown type
    if (selectedFile) {
      formData.append("attachment", selectedFile);
      attachmentType = selectedFile.type.startsWith("image/") ? "image" : "file"; // Check if the file is an image
    }

    try {
      const response = await fetch("http://localhost:5000/message", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        data.attachmentType = attachmentType; // Add attachment type to the response
        setMessages((prevMessages) => [...prevMessages, data]); // Ensure new message is added correctly
        setNewMessage("");
        setSelectedFile(null); // Clear selected file
        setFilePreview(null);  // Clear file preview
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    // Sending Message to socket
    const receiverId = chat.members.find((id) => id !== currentUserId);
    setSendMessage({
      chatId: chat._id,
      senderId: currentUserId,
      text: newMessage,
      receiverId,
    });
  };

  // Scroll to the last message
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to get the file icon based on the file type
  const getFileIcon = (fileType) => {
    if (fileType.startsWith("application/pdf")) {
      return <FaFilePdf size={24} className="mr-2" />;
    } else if (fileType.startsWith("application/msword") || fileType.startsWith("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      return <FaFileWord size={24} className="mr-2" />;
    } else if (fileType.startsWith("audio")) {
      return <FaFileAudio size={24} className="mr-2" />;
    } else {
      return <FaFileAlt size={24} className="mr-2" />;
    }
  };

  return chat ? (
    <div className="flex flex-col h-full">
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
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((msg, index) => (
          <div
            ref={scroll}
            key={index}
            className={`mb-3 flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-3 rounded-lg shadow-md ${
                msg.senderId === currentUserId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <p>{msg.text}</p>
              {msg.attachment && (
                <div className="mt-2 flex items-center">
                  {msg.attachmentType === "image" ? (
                    <div className="relative">
                      <img
                        src={`http://localhost:5000/message/file/${msg.attachment}`} // Using the getFile endpoint
                        alt="Attachment"
                        className="max-w-xs rounded-lg"
                      />
                      <a
                        href={`http://localhost:5000/message/file/${msg.attachment}`} // Using the getFile endpoint for file download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-2 right-2 text-white bg-gray-500 p-2 rounded-full"
                        download
                      >
                        <FaDownload size={18} />
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      {getFileIcon(msg.attachmentType)} {/* Display the correct file icon */}
                      <a
                        href={`http://localhost:5000/message/file/${msg.attachment}`} // Using the getFile endpoint for file download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white flex items-center ml-2 p-2 bg-blue-600 rounded-full"
                        download // Add the `download` attribute to prompt file download
                      >
                        <FaDownload size={18} className="mr-2" /> {/* Display the download icon */}
                        <span>{msg.attachment}</span> {/* Display the file name in white */}
                      </a>
                    </div>
                  )}
                </div>
              )}
              <span className="block mt-1 text-xs opacity-80 text-right">
                {format(msg.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* File Preview */}
      {filePreview && (
        <div className="p-4 bg-white border-t flex items-center relative">
          <button
            onClick={() => setFilePreview(null)}
            className="absolute top-2 right-2 text-red-500"
          >
            <FaTimesCircle size={20} />
          </button>
          {filePreview.type === "image" ? (
            <img
              src={filePreview.src}
              alt="Preview"
              className="w-14 h-14 object-cover rounded-lg mr-4"
            />
          ) : (
            <div className="p-3 bg-gray-200 rounded-lg flex items-center">
              {getFileIcon(filePreview.type)} {/* Display the correct file icon */}
              <span className="ml-2">{filePreview.name}</span>
            </div>
          )}
        </div>
      )}

      {/* Chat Sender */}
      <div className="p-4 bg-white border-t flex items-center">
        <label
          htmlFor="file-upload"
          className="cursor-pointer text-gray-600 hover:text-indigo-500 mr-4"
        >
          <FaPaperclip size={20} />
          <input id="file-upload" type="file" className="hidden" onChange={handleSelectFiles} />
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
        <p className="text-gray-700">Please Select a Contact to Message</p>
      </div>
    </div>
  );
};

export default Chatbox;
