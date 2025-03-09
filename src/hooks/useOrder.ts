import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const useOrder = (orderId: string) => {
    const fetchOrder = async (): Promise<Order> => {
        const response = await axios.get(`/api/orders/getOrder/${orderId}`)
        return response.data
    }

    const { data, isPending, error, refetch } = useQuery({
        queryKey: ['order', orderId],
        queryFn: fetchOrder,
    })

    return { order: data, loading: isPending, error, mutate: refetch }
}

export default useOrder