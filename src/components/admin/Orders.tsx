import { LuLoader } from "react-icons/lu"
import useOrders from "../../hooks/useOrders"
import OrdersNav from "./OrdersNav"
import { formatCurrency, ITEMS_PER_PAGE } from "../../utils/utils"
import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useNavigate } from "react-router"

const sortOrdersByStatus = (orders: Order[]) => {
    return [...orders].sort((a, b) => a.status.localeCompare(b.status))
}

const Orders = () => {
    const { orders, loading, error, mutate } = useOrders()
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const navigate = useNavigate()

    const handleAction = async (action: OrderStatus, orderId: string) => {
        try {
            setIsLoading(true)
            const status = action
            const response = await axios.put(`/api/orders/updateOrder/${orderId}`, {status})
            if (response.status === 200) {
                mutate()
                toast.success('Order updated')
            }
        } catch (error) {
            console.log(error)
        } finally {
          setIsLoading(false)
        }
    }

    const handleView = (orderId: string) => {
        navigate(`/dashboard/orders/${orderId}`)
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
        <OrdersNav />
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
                                        <td className="body-cell-medium">
                                            <div className="flex justify-between items-center px-2">
                                                <span className="flex w-1/2">{order.orderUnit?.length} Items</span>
                                                <button className="button-link" onClick={() => handleView(order.id)}>
                                                  View
                                                </button>
                                            </div>
                                        </td>
                                        <td className="body-cell-medium">
                                            {formatCurrency(order.totalAmt)}
                                        </td>
                                        <td className="body-cell">{order.paid? 'Yes' : 'No'}</td>
                                        <td className="body-cell">
                                          <span>{order.status === 'PENDING' ? 'Pending' :
                                                 order.status === 'APPROVED' ? 'Approved' : 'Rejected'}
                                          </span>
                                        </td>
                                        <td className="body-cell">
                                          <div className="flex justify-center items-center">
                                            {order.status === 'PENDING' &&
                                              order.paid ?
                                                <button className="button-success"
                                                  onClick={() => handleAction("APPROVED", order.id)}
                                                >
                                                  {isLoading && <LuLoader className="animate-spin" size={16} />}
                                                  Approve
                                                </button>
                                                : order.status === 'PENDING' && !order.paid ?
                                                <button className="button-danger" onClick={() => handleAction("REJECTED", order.id)}>
                                                  {isLoading && <LuLoader className="animate-spin" size={16} />}
                                                  Reject
                                                </button>
                                                :
                                                <span>No action</span>
                                            }
                                          </div>
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

export default Orders