import { useState } from "react";
import FertilizersNav from "./FertilizersNav"
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router";
import { LuCopyPlus, LuLoader } from "react-icons/lu";
import FormInput from "../FormInput";

type Inputs = {
    name: string;
    price: number;
}

const AddFertilizer = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()
    const step = 0.01

    const { 
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
     } = useForm<Inputs>({
        defaultValues: {
            name: '',
            price: 0
        }
    })

    const formSubmit: SubmitHandler<Inputs> = async (form) => {
        try {
            setIsLoading(true)
            const { name, price } = form
            const response = await axios.post('/api/fertilizers/create', { name, price })
            if (response.status === 201) {
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

    if (isLoading) {
        return (
            <div className="loading-spinner">
                <LuLoader className="animate-spin" size={50} />
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
                    <LuCopyPlus />
                    <span className='font-bold text-2xl'>New Fertilizer</span>
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
                                    disabled={isSubmitting}
                                    className='form-button'
                                >
                                    {isSubmitting ? (
                                        <LuLoader className='animate-spin' />
                                    ) : (
                                        <LuCopyPlus size={20} />
                                    )}
                                    
                                    <span className='text-button'>Add</span>
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

export default AddFertilizer