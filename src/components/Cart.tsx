import { useState } from "react"
import useDetails from "../hooks/useDetails"
import { useOrderStore } from "../store/orderCart"
import CartNav from "./CartNav"
import { formatCurrency, ITEMS_PER_PAGE } from "../utils/utils"
import { LuLoader } from "react-icons/lu"
import { useNavigate } from "react-router"
import axios from "axios"
import toast from "react-hot-toast"
import { useAuthStore } from "../store/auth"

const Cart = () => {
    const { user } = useAuthStore()
    const { totalAmt, orderUnits, count, clearOrder } = useOrderStore()
    const { details, loading, error } = useDetails()
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isError, setIsError] = useState<string | null>(null)
    const navigate = useNavigate()
    const userId = user!.id

    const handleContact = () => {
        navigate('/contacts/edit')
    }

    const handlePaySend = async () => {
        try {
            setIsLoading(true)
            const paid = true
            const response = await axios.post('api/orders/create', { totalAmt, orderUnits, paid, userId })
            if (response.status === 201) {
                toast.success('Order sent')
                setIsError(null)
                clearOrder()
                navigate('/')
            }
        } catch (error) {
            console.log(error)
            toast.error('An error occurred. Try again later')
            setIsError('An error occurred while sending the payment.') 
        } finally {
            setIsLoading(false)
        }
    }

    const handlePayLater = async () => {
        try {
            setIsLoading(true)
            const paid = false
            const response = await axios.post('api/orders/create', { totalAmt, orderUnits, paid })
            if (response.status === 201) {
                toast.success('Order sent')
                setIsError(null)
                clearOrder()
                navigate('/')
            }
        } catch (error) {
            console.log(error)
            toast.error('An error occurred. Try again later')
            setIsError('An error occurred while sending the order.') 
        } finally {
            setIsLoading(false)
        }
    }

    if (loading || isLoading) {
        return (
            <div className="loading-spinner">
                <LuLoader className="animate-spin" size={50} />
            </div>
        )
    }
    if (error || isError) {
        return (
            <div className='loading-spinner'>
                <span className="text-red-700">{error || isError}</span>
            </div>
        )
    }

    // Pagination logic
     const totalPages = Math.ceil((orderUnits?.length || 0) / ITEMS_PER_PAGE)
     const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
     const paginatedUnits = orderUnits.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div className="main-body">
        <CartNav />
        <div className="body-content">
            <div className="body-items">
                <div className="table-container">
                    <table className="table-main">
                        <thead className="table-head">
                            <tr>
                                <th className="head-cell">Land Size</th>
                                <th className="head-cell-medium">Seeds</th>
                                <th className="head-cell-wide">Fertilizer</th>
                                <th className="head-cell">Total</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {count > 0 && orderUnits.length > 0 ?
                            paginatedUnits.map((unit, index) => {
                                const seedsPrice = unit.seedsAmt / unit.seedsQty
                                const fertilizerPrice = unit.fertilizerAmt / unit.fertilizerQty
                                const unitTotalAmt = unit.seedsAmt + unit.fertilizerAmt
                            return(
                                <tr key={index} className="body-row">
                                    <td className="body-cell">{unit.landSize} Acres</td>
                                    <td className="body-cell-medium">
                                        <div className="flex items-center flex-wrap gap-1">
                                            <span>{unit.seedsName}</span>
                                            <span>{unit.seedsQty} kgs</span>
                                            <span>@KSh </span>
                                            <span>{seedsPrice}</span>
                                        </div>
                                    </td>
                                    <td className="body-cell-wide">
                                        <div className="flex items-center flex-wrap gap-1">
                                            <span>{unit.fertilizerName}</span>
                                            <span>{unit.fertilizerQty} kgs</span>
                                            <span>@KSh </span>
                                            <span>{fertilizerPrice}</span>
                                        </div>
                                    </td>
                                    <td className="body-cell">{formatCurrency(unitTotalAmt)}</td>
                                </tr>
                            )})
                            :
                                <tr className="body-row">
                                    <td colSpan={4} className="text-center">The cart is empty</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            {totalPages > 1 &&
                <div className="pagination">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="pagination-button"
                    >
                        Previous
                    </button>
                    <span className="font-semibold">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="pagination-button"
                    >
                        Next
                    </button>
                </div>
            }
            <div className="cart-summary">
                <div className="summary-item">
                    {details ? count > 0 &&
                        <div className="summary-item">
                            <button onClick={handlePaySend} className="button-success">
                                Pay and Send
                            </button>
                            <button onClick={handlePayLater} className="button-danger">
                                Pay Later
                            </button>
                        </div>
                        :
                        <div className="summary-item">
                            <button onClick={handleContact} className="button-link">
                                Add Contact
                            </button>
                        </div>
                    }
                </div>
                <div className="summary-item">
                    <span>Order Amount</span>
                    <span className="font-semibold">{formatCurrency(totalAmt)}</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Cart