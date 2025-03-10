import { useQuery } from "@tanstack/react-query"
import axios from "axios"


const useSeed = (seedId: string) => {
    const fetchSeed = async (): Promise<Seeds> => {
        const res = await axios.get(`/api/seeds/getSeed/${seedId}`)
        return res.data
    }

    const { data, isPending, error, refetch } = useQuery({
        queryKey: ['seed', seedId],
        queryFn: fetchSeed,
    })

    return { seed: data, loading: isPending, error, mutate: refetch }
}

export default useSeed