import { Link } from "react-router"

const SeedsNav = () => {
  return (
    <div className="body-nav">
        <div className="flex font-semibold">
            <h1>Seeds</h1>
        </div>
        <div className="body-nav-link">
            <Link to='/dashboard/seeds' className="link-item">
                View
            </Link>
            <Link to='/dashboard/seeds/add' className="link-item">
                Add
            </Link>
        </div>
    </div>
  )
}

export default SeedsNav