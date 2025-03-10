import { useQuery } from "@tanstack/react-query"
import axios from "axios"


const useFertilizer = (fertilizerId: string) => {
    const fetchFertilizer = async (): Promise<Fertilizer> => {
        const res = await axios.get(`/api/fertilizers/getFertilizer/${fertilizerId}`)
        return res.data
    }

    const { data, error, isPending, refetch } = useQuery({
        queryKey: ['fertilizer', fertilizerId],
        queryFn: fetchFertilizer
    })

    return { fertilizer: data, loading: isPending, error, mutate: refetch }
}

export default useFertilizer