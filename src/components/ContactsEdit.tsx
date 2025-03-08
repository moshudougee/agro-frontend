import { LuLoader } from "react-icons/lu"
import useDetails from "../hooks/useDetails"
import ContactsNav from "./ContactsNav"
import EditDetails from "./EditDetails"
import AddDetails from "./AddDetails"

const ContactsEdit = () => {
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
                <span className="text-red-700">{error}</span>
            </div>
        )
    }

  return (
    <div className="main-body">
        <ContactsNav />
        {details ? <EditDetails details={details} /> : <AddDetails />}
    </div>
  )
}

export default ContactsEdit