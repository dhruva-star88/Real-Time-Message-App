import React from 'react';
import MessageArea from './pages/MessageArea';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element={<LoginPage />} />
        <Route path='/message-area' element={<MessageArea />} />
      </>
    )
  );
  return (
    <RouterProvider router={router} />
  );
};

export default App;
