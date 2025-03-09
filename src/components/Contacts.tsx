import { LuLoader } from "react-icons/lu"
import useDetails from "../hooks/useDetails"
import ContactsNav from "./ContactsNav"

const Contacts = () => {
    const { details, loading, error } = useDetails()

    if (loading) {
        return (
            <div className="loading-spinner">
                <LuLoader className="animate-spin" size={50} />
            </div>
        )
    }
    if (error) {
        return (
            <div className='loading-spinner'>
                <span className="text-red-700">{error.message}</span>
            </div>
        )
    }
    
  return (
    <div className="main-body">
        <ContactsNav />
        <div className="body-content">
          <div className="body-items">
            <div className="table-container">
                <table className="table-main">
                    <thead className="table-head">
                        <tr>
                            <th className="head-cell-medium">Name</th>
                            <th className="head-cell">Phone</th>
                            <th className="head-cell-wide">Address</th>
                            <th className="head-cell">City</th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        <tr className="body-row">
                            <td className="body-cell-medium">{details?.name}</td>
                            <td className="body-cell">{details?.phone}</td>
                            <td className="body-cell-wide">{details?.address}</td>
                            <td className="body-cell">{details?.city}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Contacts