import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { getAllClients } from '../../api/AllClientsRequest';

const ClientSelector = ({ onClose, chats, handleAddClient }) => {
  const [clients, setClients] = useState([]);

  // To get the clients
  useEffect(() => {
    const getClients = async () => {
      try {
        const { data } = await getAllClients();
        setClients(data);
      } catch (error) {
        console.log('Failed to fetch clients:', error);
      }
    };
    getClients();
  }, []);

  const isClientInChat = (clientId) => {
    return chats?.some((chat) => chat.members?.includes(clientId)) || false;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-600 hover:text-red-800 border border-red-600 rounded-full p-2"
        >
          <FaTimes size={20} />
        </button>
        <h3 className="text-lg font-semibold mb-4">Select a Client</h3>
        <hr className="border-t mb-4" />
        <ul className="space-y-3 overflow-y-auto" style={{ maxHeight: '300px' }}>
          {clients
            .filter((client) => !isClientInChat(client._id))
            .map((client) => (
              <React.Fragment key={client._id}>
                <li className="p-3 text-lg hover:bg-gray-100 cursor-pointer rounded-lg flex justify-between items-center">
                  {client.username}
                  <button
                    className="text-blue-600 hover:text-blue-800 border border-blue-600 rounded-full px-3 py-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddClient(client);  // Calling the passed function here
                    }}
                  >
                    Add
                  </button>
                </li>
                <hr className="border-t" />
              </React.Fragment>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default ClientSelector;
