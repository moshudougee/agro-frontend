import { useParams } from "react-router"
import useOrder from "../../hooks/useOrder"
import OrdersNav from "./OrdersNav"
import { useEffect, useState } from "react"
import { LuLoader } from "react-icons/lu"
import { formatCurrency, ITEMS_PER_PAGE } from "../../utils/utils"
import axios from "axios"

const Order = () => {
    const { orderId } = useParams()
    const { order, loading, error } = useOrder(orderId!)
    const [currentPage, setCurrentPage] = useState(1)
    const [orderUnits, setOrderUnits] = useState<OrderUnit[]>([])
    const [details, setDetails] = useState<FarmerDetails | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isError, setIsError] = useState<string | null>(null)

    const farmerID = order?.farmer?.id

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setIsLoading(true)
                const response = await axios.get(`/api/details/getDetails/${farmerID}`)
                setDetails(response.data)
            } catch (error) {
                console.log(error)
                setIsError('Error occured while fetching farmer details')
            } finally {
                setIsLoading(false)
            }
        }

        if (farmerID) {
            fetchDetails()
        } 
    }, [farmerID])

    useEffect(() => {
        if (order) {
            setOrderUnits(order.orderUnit)
        }
    }, [order])

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

    // Pagination logic
    const totalPages = Math.ceil((orderUnits?.length || 0) / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedUnits = orderUnits.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div className="main-body">
        <OrdersNav />
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
            {isLoading ? 
                <div className="loading-spinner">
                    <LuLoader className="animate-spin" size={50} />
                </div>
            :isError ?
                <div className='loading-spinner'>
                    <span className="text-red-700">{isError}</span>
                </div>
            :
            <div className="famer-details">
                <div className="details-item">
                    <span className="font-semibold">Name:</span>
                    <span>{details?.name}</span>
                </div>
                <div className="details-item">
                    <span className="font-semibold">Phone:</span>
                    <span>{details?.phone}</span>
                </div>
                <div className="details-item">
                    <span className="font-semibold">Email:</span>
                    <span>{order?.farmer?.email}</span>
                </div>
                <div className="details-item">
                    <span className="font-semibold">Paid:</span>
                    <span>{order?.paid ? 'Yes' : 'No'}</span>
                </div>
                <div className="details-item">
                    <span className="font-semibold">Status:</span>
                    <span className="capitalize">{order?.status.toLocaleLowerCase()}</span>
                </div>
            </div>
            }
        </div>
    </div>
  )
}

export default Order