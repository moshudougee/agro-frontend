import axios from "axios"
import { useCallback, useEffect, useState } from "react"


const useOrders = () => {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const fetchMyOrders = async () => {
        try {
            setLoading(true)
            const response = await axios.get('/api/orders/getAllOrders')
            setOrders(response.data)
        } catch (error) {
            console.log(error)
            setError('An error occurred while fetching orders')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMyOrders()
    }, [])

    const mutate = useCallback( async () => {
        await fetchMyOrders()
    }, [])

    return { orders, loading, error, mutate }
}

export default useOrders