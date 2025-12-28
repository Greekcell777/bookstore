import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {RouterProvider} from 'react-router'
import './index.css'
import App from './App.jsx'
import { router } from './components/routes.jsx'
import { AuthProvider } from './components/AuthContext.jsx'
import { BookStoreProvider } from './components/BookstoreContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BookStoreProvider>
      <AuthProvider>
        <RouterProvider router={router}/>
      </AuthProvider>
    </BookStoreProvider>
  </StrictMode>
)
