import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Product from './pages/Product.jsx'
import { Toaster } from 'react-hot-toast'

const router = createBrowserRouter([{
  path: "/", element: <App />, children: [{
    path: "/products", element: <Product />
  }]
}]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <>
    <RouterProvider router={router} />
    <Toaster />
    </>
)
