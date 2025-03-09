import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const useOrders = () => {
    const fetchMyOrders = async (): Promise<Order[]> => {
         const response = await axios.get('/api/orders/getAllOrders')
         return response.data
    }

    const { data, isPending, error, refetch } = useQuery({
        queryKey: ['orders'],
        queryFn: fetchMyOrders,
    })

    return { orders: data, loading: isPending, error, mutate: refetch }
}

export default useOrders