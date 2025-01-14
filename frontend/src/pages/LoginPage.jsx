import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../store/user/userSlice';
import { getAllClients } from '../api/AllClientsRequest';

const LoginPage = () => {
    const dispatch = useDispatch();
    const selectedUser = useSelector((state) => state.user.selectedUser);
    const navigate = useNavigate();

    const [users, setUsers] = useState([])

    useEffect(() => {
        const getUsers = async () => {
            try {
                const {data} = await getAllClients()
                setUsers(data)
                console.log("All Users", users)
            } catch (error) {
               console.log("Error fetching Users", error) 
            }
        }
        getUsers()
    }, [])

    const handleLogin = () => {
        if (selectedUser) {
            console.log("Selected User", selectedUser);
            navigate('/message-area');
            dispatch(setSelectedUser(selectedUser)); // Update the selected user in the Redux store
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login Page</h1>
                <label htmlFor="serviceProvider" className="block text-gray-700 text-sm font-bold mb-2">
                    Select Service Provider:
                </label>
                <select
                    id="serviceProvider"
                    className="block w-full bg-white border border-gray-300 rounded-md py-2 px-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    value={selectedUser || ""} // Fixing the value prop
                    onChange={(e) => dispatch(setSelectedUser(e.target.value))} // Update selectedUser in Redux
                >
                    <option value="" disabled>Select ID</option>
                    {users.map(user => (
                        <option key={user._id} value={user._id}>
                            {user.username}
                        </option>
                    ))}
                </select>
                <button
                    onClick={handleLogin}
                    disabled={!selectedUser}
                    className={`w-full py-2 px-4 bg-green-600 text-white rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 ${!selectedUser && 'opacity-50 cursor-not-allowed'}`}
                >
                    Go to MessageArea
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
