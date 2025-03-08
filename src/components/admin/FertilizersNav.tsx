import { Link } from "react-router"

const FertilizersNav = () => {
  return (
    <div className="body-nav">
        <div className="flex font-semibold">
            <h1>Fertlizers</h1>
        </div>
        <div className="body-nav-link">
            <Link to='/dashboard/fertilizers' className="link-item">
                View
            </Link>
            <Link to='/dashboard/fertilizers/add' className="link-item">
                Add
            </Link>
        </div>
    </div>
  )
}

export default FertilizersNav