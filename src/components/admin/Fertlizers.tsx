import { LuLoader } from "react-icons/lu"
import useFertilizers from "../../hooks/useFertilizers"
import FertilizersNav from "./FertilizersNav"
import { useState } from "react"
import { ITEMS_PER_PAGE } from "../../utils/utils"

const Fertlizers = () => {
    const { fertilizers, loading, error } = useFertilizers()
    const [currentPage, setCurrentPage] = useState(1)

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
    const totalPages = Math.ceil((fertilizers?.length || 0) / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedFertilizers = fertilizers?.slice(startIndex, startIndex + ITEMS_PER_PAGE) || []

  return (
    <div className="main-body">
        <FertilizersNav />
        <div className="body-content">
            <div className="body-items">
                <div className="table-container">
                    <table className="table-main">
                        <thead className="table-head">
                            <tr>
                                <th className="head-cell-wide">Name</th>
                                <th className="head-cell">Price (1Kg)</th>
                                <th className="head-cell-medium">Seeds</th>
                                <th className="head-cell">Action</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {paginatedFertilizers.length > 0 ? paginatedFertilizers.map((fertilizer) => {
                                return (
                                    <tr 
                                        key={fertilizer.id}
                                        className="body-row"
                                    >
                                        <td className="body-cell-wide">{fertilizer.name}</td>
                                        <td className="body-cell">{fertilizer.price}</td>
                                        <td className="body-cell-medium">
                                            <div className="flex items-center flex-wrap gap-1">
                                                {fertilizer.seeds && fertilizer.seeds.length > 0 && 
                                                    fertilizer.seeds?.map((seeds, i) => (
                                                        <div key={seeds.id} className="flex">
                                                            <span>{seeds.name}</span>
                                                            {i < fertilizer.seeds!.length - 1 &&<span>, </span>}
                                                        </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="body-cell"><button>Edit</button> | <button>Delete</button></td>
                                    </tr>
                                )
                            }) :
                                <tr className="body-row">
                                    <td colSpan={4} className="text-center">
                                        No fertilizers available.
                                    </td>
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

export default Fertlizers