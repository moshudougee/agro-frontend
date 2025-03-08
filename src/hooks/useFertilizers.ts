import axios from "axios"
import { useCallback, useEffect, useState } from "react"


const useFertilizers = () => {
    const [fertilizers, setFertilizers] = useState<Fertilizer[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const fetchFertilizers = async () => {
        try {
            setLoading(true)
            const res = await axios.get('/api/fertilizers/getFertilizers')
            //console.log('Response',res)
            setFertilizers(res.data)
        } catch (error) {
            console.log(error)
            setError('An error occurred while fetching fertilizers.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFertilizers()
    }, [])

    const mutate = useCallback( async () => {
        await fetchFertilizers()
    }, [])

    return { fertilizers, loading, error, mutate }

}

export default useFertilizers