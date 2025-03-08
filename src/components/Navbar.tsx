import { LuLogOut } from "react-icons/lu"
import { useAuthStore } from "../store/auth"
import { Link, useNavigate } from "react-router"
import { useOrderStore } from "../store/orderCart"

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuthStore()
    const { clearOrder } = useOrderStore()
    const navigate = useNavigate()

    const handleLogout = () => {
        clearOrder()
        logout()
        navigate('/login')
    }
  return (
    <div className="nav">
        <div className="flex">
            <Link to='/' className="font-semibold">
                Agro Store
            </Link>
        </div>
        {isAuthenticated &&
            <div className="nav-link">
                <Link to='/contacts' className="nav-link-item">
                    Contact
                </Link>
                <Link to='/orders' className="nav-link-item">
                    Orders
                </Link>
            </div>
        }
        <div className="flex justify-center items-center gap-3">
            <p>Welcome {user?.email}</p>
            {isAuthenticated && (
                <button 
                    onClick={handleLogout}
                    className="button-danger"
                >
                    <LuLogOut />
                    <span>Logout</span>
                </button>
            )}
        </div>
    </div>
  )
}

export default Navbar