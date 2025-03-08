import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { useAuthStore } from "../store/auth"


const useMyOrders = () => {
    const { user } = useAuthStore()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const userId = user!.id

    const fetchMyOrders = useCallback( async () => {
        try {
            setLoading(true)
            const response = await axios.get(`/api/orders/getMyOrders/${userId}`)
            setOrders(response.data)
        } catch (error) {
            console.log(error)
            setError('An error occurred while fetching orders')
        } finally {
            setLoading(false)
        }
    }, [userId])

    useEffect(() => {
        fetchMyOrders()
    }, [fetchMyOrders])

    const mutate = useCallback( async () => {
        await fetchMyOrders()
    }, [fetchMyOrders])

    return { orders, loading, error, mutate }
}

export default useMyOrders