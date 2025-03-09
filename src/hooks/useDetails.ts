import axios from "axios"
import { useAuthStore } from "../store/auth"
import { useQuery } from "@tanstack/react-query"


const useDetails = () => {
    const { user } = useAuthStore()
    const userId = user!.id

    const fetchDetails = async (): Promise<FarmerDetails[]> => {
        const res = await axios.get(`/api/details/getDetails/${userId}`)
        return res.data
    }

    const { data, isPending, error, refetch } = useQuery({
        queryKey: ['details'],
        queryFn: fetchDetails,
        enabled: user ? true : false
    })

    return { details: data, loading: isPending, error, mutate: refetch }
}

export default useDetails