import { useEffect, useState } from "react";
import FertilizersNav from "./FertilizersNav"
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { LuFilePen, LuLoader } from "react-icons/lu";
import FormInput from "../FormInput";
import useFertilizer from "../../hooks/useFertilizer";

type Inputs = {
    name: string;
    price: number;
}
const EditFertilizer = () => {
    const { fertilizerId } = useParams()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const { fertilizer, loading, error: fertError } = useFertilizer(fertilizerId!)
    const navigate = useNavigate()
    const step = 0.01

    const { 
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
     } = useForm<Inputs>({
        defaultValues: {
            name: fertilizer?.name || '',
            price: fertilizer?.price || 0
        }
    })

    useEffect(() => {
        if (fertilizer) {
            setValue('name', fertilizer.name)
            setValue('price', fertilizer.price)
        }
    }, [fertilizer, setValue])

    const formSubmit: SubmitHandler<Inputs> = async (form) => {
        try {
            setIsLoading(true)
            const { name, price } = form
            const response = await axios.put(`/api/fertilizers/updateFertilizer/${fertilizerId}`, { name, price })
            if (response.status === 200) {
                setError(null)
                navigate('/dashboard/fertilizers')
            }
        } catch (error) {
            console.log(error)
            setError('An error occurred while submitting the form.')
        } finally {
            setIsLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="loading-spinner">
                <LuLoader className="animate-spin" size={50} />
            </div>
        )
    }
    if (fertError) {
        return (
            <div className='loading-spinner'>
                <span className="text-red-700">{fertError.message}</span>
            </div>
        )
    }
  return (
    <div className="main-body">
        <FertilizersNav />
        <div className="body-content">
            <div className="form-details">
                {error && <div className='text-red-700'>{error}</div>}
                <div className="form-header">
                    <LuFilePen />
                    <span className='font-bold text-2xl'>Edit Fertilizer</span>
                </div>
                <div className="form-container">
                    <form onSubmit={handleSubmit(formSubmit)} className="form">
                        <FormInput<Inputs> id='name' name="Name" required register={register} errors={errors} />
                        <FormInput<Inputs> 
                            id='price' 
                            name="Price" 
                            required 
                            register={register} 
                            errors={errors} 
                            type='number' 
                            step={step} 
                        />
                        <div className='form-button-container'>
                            <div className='form-button-item'>
                                <button
                                    type='submit'
                                    disabled={isSubmitting || isLoading}
                                    className='form-button'
                                >
                                    {isSubmitting ? (
                                        <LuLoader className='animate-spin' />
                                    ) : (
                                        <LuFilePen size={20} />
                                    )}
                                    
                                    <span className='text-button'>Edit</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default EditFertilizer