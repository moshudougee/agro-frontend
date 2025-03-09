import { LuLoader } from "react-icons/lu"
import MyOrdersNav from "./MyOrdersNav"
import { formatCurrency, ITEMS_PER_PAGE } from "../utils/utils"
import useMyOrders from "../hooks/useMyOrders"
import { useState } from "react"
import { useNavigate } from "react-router"

const sortOrdersByStatus = (orders: Order[]) => {
    return [...orders].sort((a, b) => a.status.localeCompare(b.status))
}

const MyOrders = () => {
    const { orders, loading, error } = useMyOrders()
    const [currentPage, setCurrentPage] = useState(1)
    const navigate = useNavigate()

    const handleView = (orderId: string) => {
        navigate(`/orders/${orderId}`)
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

    // Sort orders by status
    const sortedOrders = sortOrdersByStatus(orders || [])

    // Pagination logic
    const totalPages = Math.ceil((sortedOrders.length || 0) / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedOrders = sortedOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div className="main-body">
        <MyOrdersNav />
        <div className="body-content">
            <div className="body-items">
                <div className="table-container">
                    <table className="table-main">
                        <thead className="table-head">
                            <tr>
                                <th className="head-cell-medium">Items</th>
                                <th className="head-cell-medium">Order Amount</th>
                                <th className="head-cell">Paid</th>
                                <th className="head-cell">Status</th>
                                <th className="head-cell">Action</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {paginatedOrders && paginatedOrders.length > 0 ?
                                paginatedOrders.map((order) => {
                                    return (
                                        <tr key={order.id} className="body-row">
                                            <td className="head-cell-wide">
                                                <div className="flex items-center px-2">
                                                    <span>{order.orderUnit?.length} Items</span>
                                                </div>
                                            </td>
                                            <td className="head-cell-medium">
                                                {formatCurrency(order.totalAmt)}
                                            </td>
                                            <td className="head-cell">{order.paid? 'Yes' : 'No'}</td>
                                            <td className="head-cell">
                                                <span>{order.status === 'PENDING' ? 'Pending' :
                                                    order.status === 'APPROVED' ? 'Approved' : 'Rejected'}
                                                </span>
                                            </td>
                                            <td className="head-cell">
                                                <button className="button-link" onClick={() => handleView(order.id)}>
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                                :
                                <tr className="body-row">
                                    <td colSpan={4} className="items-center">No orders found</td>
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
        </div>
    </div>
  )
}

export default MyOrders