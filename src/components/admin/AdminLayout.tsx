import { Outlet, useNavigate } from "react-router"
import { useAuthStore } from "../../store/auth"
import { useEffect } from "react"
import { LuLoader } from "react-icons/lu"
import AdminNav from "./AdminNav"
import { Toaster } from "react-hot-toast"

const AdminLayout = () => {
    const { isAuthenticated, user, loading } = useAuthStore()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthenticated) navigate('/login')
        if (user && user.role === 'FARMER') navigate('/')
    }, [isAuthenticated, navigate, user])

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
        <AdminNav />
        <div className="main">
            <Outlet />
        </div>
        <div className="footer">
            <span>@Agro Store</span>
        </div>
    </div>
  )
}

export default AdminLayout