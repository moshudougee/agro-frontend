import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const useFertilizers = () => {
    const fetchFertilizers = async (): Promise<Fertilizer[]> => {
        const res = await axios.get('/api/fertilizers/getFertilizers')
        return res.data
    }

    const { data, isPending, error, refetch } = useQuery({
        queryKey: ['fertilizers'],
        queryFn: fetchFertilizers,
    })

    return { fertilizers: data, loading: isPending, error, mutate: refetch }

}

export default useFertilizers