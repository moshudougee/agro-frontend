import { Link } from "react-router"
import { useOrderStore } from "../store/orderCart"

const MyOrdersNav = () => {
    const { count } = useOrderStore()
  return (
    <div className="body-nav">
        <div className="flex font-semibold">
            <h1>Order History</h1>
        </div>
        <div className="body-nav-link">
            <Link to='/' className="link-item">
                Place Order
            </Link>
            <Link to='/cart' className="link-item">
                My cart {count}
            </Link>
        </div>
    </div>
  )
}

export default MyOrdersNav