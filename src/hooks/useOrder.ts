import axios from "axios"
import { useCallback, useEffect, useState } from "react"


const useOrder = (orderId: string) => {
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const fetchOrder = useCallback(async () => {
        try {
            setLoading(true)
            const response = await axios.get(`/api/orders/getOrder/${orderId}`)
            setOrder(response.data)
        } catch (error) {
            console.log(error)
            setError('An error occurred while fetching the order')
        } finally {
            setLoading(false)
        }
    }, [orderId])

    useEffect(() => {
        fetchOrder()
    }, [fetchOrder])

    const mutate = useCallback( async () => {
        await fetchOrder()
    }, [fetchOrder])

    return { order, loading, error, mutate }
}

export default useOrder