import { useQuery } from "@tanstack/react-query";
import axios from "axios";



const useSeeds = () => {
    const fetchSeeds = async (): Promise<Seeds[]> => {
        const response = await axios.get('/api/seeds/getSeeds')
        return response.data
    }

    const { data, isPending, error, refetch } = useQuery({
        queryKey: ['seeds'],
        queryFn: fetchSeeds,
    })
    
    return { seeds: data, loading: isPending, error, mutate: refetch }
}

export default useSeeds