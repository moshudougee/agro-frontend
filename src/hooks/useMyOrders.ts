import axios from "axios"
import { useAuthStore } from "../store/auth"
import { useQuery } from "@tanstack/react-query"


const useMyOrders = () => {
    const { user } = useAuthStore()
    const userId = user!.id

    const fetchMyOrders = async () => {
        const response = await axios.get(`/api/orders/getMyOrders/${userId}`)
        return response.data
    }

    const { data, isPending, error, refetch } = useQuery({
        queryKey: ['myOrders'],
        queryFn: fetchMyOrders,
        enabled: user ? true : false
    })

    return { orders: data, loading: isPending, error, mutate: refetch }
}

export default useMyOrders