import {createBrowserRouter} from 'react-router'
import App from '../App'
import Home from '../pages/Home'
import Catalog from '../pages/Catalog'
import BookDetail from './BookDetail'
import Categories from '../pages/Categories'
import Bestsellers from '../pages/Bestsellers'
import Cart from './Cart'
import Checkout from './Checkout'
import Login from './Login'
import Register from './Register'
import ProfilePage from '../pages/Profile'
import WishlistPage from '../pages/WishList'
import OrdersPage from '../pages/Orders'
import AdminLayout from './AdminLayout'
import AdminDashboard from './AdminDashboard'
import BooksManagement from './BookManagement'
import OrdersManagement from './OrderManagement'
import CustomersManagement from './CustomerManagement'
import CategoriesManagement from './CategoryManagement'
import ReviewsManagement from './ReviewManagement'
import AdminSettings from './AdminSettings'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        children:[
            {
                index: true,
                element: <Home/>
            },
            {
                path: 'catalog',
                element:<Catalog/>
            },
            {
                path: 'book/:id',
                element: <BookDetail/>
            },
            {
                path: 'categories',
                element:<Categories/>
            },
            {
                path: 'bestsellers',
                element: <Bestsellers/> 
            },
            {
                path: 'cart',
                element: <Cart/>
            },
            {
                path: 'checkout',
                element: <Checkout/>
            },
            {
                path: 'login',
                element: <Login/>
            },
            {
                path: 'register',
                element: <Register/>
            },
            {
                path: 'profile',
                element: <ProfilePage/>
            },
            {
                path: 'wishlist',
                element: <WishlistPage/>
            },
            {
                path: 'orders',
                element: <OrdersPage/>
            },
            {
                path: 'admin',
                element:<AdminLayout/>,
                children:[
                    {
                        index: true,
                        element:<></>
                    }
                ]
            }
        ]
    },
    {
        path: '/admin',
        element:<AdminLayout/>,
        children:[
            {
                path: '/admin/dashboard',
                element: <AdminDashboard/>
            },
            {
                path: '/admin/books',
                element: <BooksManagement/>
            },
            {
                path: '/admin/orders',
                element: <OrdersManagement/>
            },
            {
                path: '/admin/customers',
                element: <CustomersManagement/>
            },
            {
                path: '/admin/categories',
                element: <CategoriesManagement/>
            },
            {
                path: '/admin/reviews',
                element: <ReviewsManagement/>
            },
            {
                path: '/admin/settings',
                element: <AdminSettings/>
            }

        ]
    }
])