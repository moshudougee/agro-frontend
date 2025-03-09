import { useParams } from "react-router"
import useOrder from "../hooks/useOrder"
import { useEffect, useState } from "react"
import { LuLoader } from "react-icons/lu"
import { formatCurrency, ITEMS_PER_PAGE } from "../utils/utils"
import MyOrdersNav from "./MyOrdersNav"
import toast from "react-hot-toast"
import axios from "axios"

const MyOrder = () => {
    const { orderId } = useParams()
    const { order, loading, error, mutate } = useOrder(orderId!)
    const [currentPage, setCurrentPage] = useState(1)
    const [orderUnits, setOrderUnits] = useState<OrderUnit[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        if (order) {
            setOrderUnits(order.orderUnit)
        }
    }, [order])

    const handlePayNow = async () => {
        try {
            setIsLoading(true)
            const paid = true
            const status: OrderStatus = 'PENDING'
            const response = await axios.put(`/api/orders/updateOrder/${orderId}`, {paid, status})
            if (response.status === 200) {
                toast.success('Payment sent')
                mutate()
            }
        } catch (error) {
            console.log(error)
            toast.error('Error occured while sending the payment. Try again later')
        } finally {
            setIsLoading(false)
        }
    }

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

    // Pagination logic
    const totalPages = Math.ceil((orderUnits?.length || 0) / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedUnits = orderUnits.slice(startIndex, startIndex + ITEMS_PER_PAGE)


  return (
    <div className="main-body">
        <MyOrdersNav />
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
                            {orderUnits.length > 0 ?
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
            <div className="flex justify-center items-center gap-5 w-full p-2">
                {!order?.paid &&
                    <div className="flex justify-center items-center gap-3 w-1/2">
                        <span className="text-center">Order not yet paid</span>
                        <button onClick={handlePayNow} className="button-success">
                            {isLoading ?
                                <LuLoader className="animate-spin" size={16} />
                            :
                                <span>Pay now</span>
                            }
                        </button>
                    </div>
                }
                <div className="famer-details">
                    <div className="details-item">
                        <span className="font-semibold">Paid:</span>
                        <span>{order?.paid? 'Yes' : 'No'}</span>
                    </div>
                    <div className="details-item">
                        <span className="font-semibold">Status:</span>
                        <span className="capitalize">{order?.status.toLocaleLowerCase()}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default MyOrder