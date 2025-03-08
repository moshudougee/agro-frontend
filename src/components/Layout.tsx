import { Outlet, useLocation, useNavigate } from "react-router"
import { useAuthStore } from "../store/auth"
import { useEffect } from "react"
import { LuLoader } from "react-icons/lu"
import Navbar from "./Navbar"
import { Toaster } from "react-hot-toast"
const Layout = () => {
    const { isAuthenticated, user, loading } = useAuthStore()
    const navigate = useNavigate()
    const location = useLocation()
    const { pathname } = location

    useEffect(() => {
        if (!isAuthenticated) {
            if (pathname ==='/register') {
                navigate('/register')
            } else {
                navigate('/login')
            }
        }
    }, [isAuthenticated, pathname, navigate])

    useEffect(() => {
        if (user && user.role === 'ADMIN') navigate('/dashboard')
    }, [user, navigate])

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full h-screen">
                <LuLoader className="animate-spin" size={70} />
            </div>
        )
    }


  return (
    <div className="layout">
        <Toaster />
        <Navbar />
        <div className="main">
            <Outlet />
        </div>
        <div className="footer">
            <span>@Agro Store</span>
        </div>
    </div>
  )
}

export default Layout