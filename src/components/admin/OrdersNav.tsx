import { Link } from "react-router"

const OrdersNav = () => {
  return (
    <div className="body-nav">
        <div className="flex font-semibold">
            <h1>Orders</h1>
        </div>
        <div className="body-nav-link">
            <Link to='/dashboard/orders' className="link-item">
                View All
            </Link>
         </div>
    </div>
  )
}

export default OrdersNav