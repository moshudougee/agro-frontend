import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { useAuthStore } from "../store/auth"


const useDetails = () => {
    const { user } = useAuthStore()
    const [details, setDetails] = useState<FarmerDetails | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const userId = user!.id

    const fetchDetails = useCallback( async () => {
        try {
            setLoading(true)
            const res = await axios.get(`/api/details/getDetails/${userId}`)
            setDetails(res.data)
        } catch (error) {
            console.log(error)
            setError('An error occurred while fetching farmer details')
        } finally {
            setLoading(false)
        }
    }, [userId])

    useEffect(() => {
        fetchDetails()
    }, [fetchDetails])

    const mutate = useCallback( async () => {
        await fetchDetails()
    }, [fetchDetails])

    return { details, loading, error, mutate }
}

export default useDetails