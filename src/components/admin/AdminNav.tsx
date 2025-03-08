import { LuLogOut } from "react-icons/lu"
import { useAuthStore } from "../../store/auth"
import { Link } from "react-router"

const AdminNav = () => {
    const { isAuthenticated, logout } = useAuthStore()

    const handleLogout = () => {
        logout()
    }


  return (
    <div className="nav">
        <div className="flex font-semibold">
            <h1>Agro Store Dashboard</h1>
        </div>
        <div className="nav-link">
            <Link to='/dashboard/fertilizers' className="nav-link-item">
                Fertilizers
            </Link>
            <Link to='/dashboard/seeds' className="nav-link-item">
                Seeds
            </Link>
            <Link to='/dashboard/orders' className="nav-link-item">
                Orders
            </Link>
        </div>
        <div className="nav-items">
            <p>Welcome Admin</p>
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

export default AdminNav