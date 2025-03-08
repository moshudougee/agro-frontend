import axios from "axios";
import { useCallback, useEffect, useState } from "react";



const useSeeds = () => {
    const [seeds, setSeeds] = useState<Seeds[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const fetchSeeds = async () => {
        try {
            setLoading(true)
            const response = await axios.get('/api/seeds/getSeeds')
            setSeeds(response.data)
        } catch (error) {
            console.error(error)
            setError('An error occurred while fetching seeds')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSeeds()
    }, [])

    const mutate = useCallback( async () => {
        await fetchSeeds()
    }, [])

    return { seeds, loading, error, mutate }
}

export default useSeeds