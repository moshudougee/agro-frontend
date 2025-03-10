import { useState } from "react"
import useSeeds from "../../hooks/useSeeds"
import SeedsNav from "./SeedsNav"
import { LuLoader } from "react-icons/lu"
import { ITEMS_PER_PAGE } from "../../utils/utils"
import { useNavigate } from "react-router"

const Seeds = () => {
    const { seeds, loading, error } = useSeeds()
    const [currentPage, setCurrentPage] = useState(1)
    const navigate = useNavigate()

    const handleEdit = (seedsId: string) => {
      navigate(`/dashboard/seeds/edit/${seedsId}`)
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
     const totalPages = Math.ceil((seeds?.length || 0) / ITEMS_PER_PAGE)
     const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
     const paginatedSeeds = seeds?.slice(startIndex, startIndex + ITEMS_PER_PAGE) || []

  return (
    <div className="main-body">
        <SeedsNav />
        <div className="body-content">
            <div className="body-items">
              <div className="table-container">
                <table className="table-main">
                  <thead className="table-head">
                    <tr>
                      <th className="head-cell-medium">Name</th>
                      <th className="head-cell">Price (1Kg)</th>
                      <th className="head-cell-wide">Fertlizers</th>
                      <th className="head-cell">Action</th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    {paginatedSeeds && paginatedSeeds.length > 0 ?
                      paginatedSeeds.map((seed) => {
                        return (
                          <tr key={seed.id} className="body-row">
                            <td className="body-cell-medium">{seed.name}</td>
                            <td className="body-cell">{seed.price}</td>
                            <td className="body-cell-wide">
                              <div className="flex items-center flex-wrap">
                                {seed.fertilizers && seed.fertilizers.length > 0 && 
                                  seed.fertilizers.map((fertilizer, i) => {
                                    return (
                                      <div key={fertilizer.id} className="flex">
                                        <span>{fertilizer.name}</span>
                                        {i < seed.fertilizers!.length - 1 && <span>, </span>}
                                      </div>
                                    )
                                })}
                              </div>
                            </td>
                            <td className="body-cell">
                              <button className="button-success" onClick={() => handleEdit(seed.id)}>
                                Edit
                              </button>
                            </td>
                          </tr>
                        )
                      })
                      :
                      <tr className="body-row">
                        <td colSpan={4} className="text-center">No seeds found.</td>
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

export default Seeds