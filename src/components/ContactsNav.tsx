import { Link } from "react-router"
import { useOrderStore } from "../store/orderCart"

const ContactsNav = () => {
    const { count } = useOrderStore()
  return (
    <div className="body-nav">
        <div className="flex font-semibold">
            <h1>Contact Details</h1>
        </div>
        <div className="body-nav-link">
            <Link to='/contacts' className="link-item">
                View
            </Link>
            <Link to='/contacts/edit' className="link-item">
                Edit
            </Link>
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

export default ContactsNav