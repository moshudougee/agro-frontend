import axios from "axios";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { LuFilePen, LuLoader } from "react-icons/lu";
import { useNavigate } from "react-router";
import FormInput from "./FormInput";
import { useAuthStore } from "../store/auth";

interface EditDetailsProps {
    details: FarmerDetails;
}

type Inputs = {
    name: string;
    phone: string;
    address: string;
    city: string;
}
const EditDetails = ({ details }: EditDetailsProps) => {
    const { user } = useAuthStore()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()
    const userId = user!.id

    const { 
         register,
         handleSubmit,
         setValue,
         formState: { errors, isSubmitting },
    } = useForm<Inputs>({
         defaultValues: {
             name: details?.name || '',
             phone: details?.phone || '',
             address: details?.address || '',
             city: details?.city || ''
         },
    })

    useEffect(() => {
        setValue('name', details?.name || '')
        setValue('phone', details?.phone || '')
        setValue('address', details?.address || '')
        setValue('city', details?.city || '')
     }, [details, setValue])

    const formSubmit: SubmitHandler<Inputs> = async (form) => {
        try {
            setIsLoading(true)
            const { name, phone, address, city } = form
            const response = await axios.put('/api/details/updateDetails', { name, phone, address, city, userId })
            if (response.status === 200) {
                setError(null)
                navigate('/contacts')
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
    <div className="body-content">
        <div className="form-details">
            {error && <div className='text-red-700'>{error}</div>}
            <div className="form-header">
              <LuFilePen />
              <span className='font-bold text-2xl'>Edit Details</span>
            </div>
            <div className="form-container">
                <form onSubmit={handleSubmit(formSubmit)} className="form">
                    <FormInput<Inputs> id='name' name="Name" required register={register} errors={errors} />
                    <FormInput<Inputs> id='phone' name="Phone" required register={register} errors={errors} />
                    <FormInput<Inputs> id='address' name="Address" required register={register} errors={errors} />
                    <FormInput<Inputs> id='city' name="City" required register={register} errors={errors} />
                    <div className='form-button-container'>
                        <div className='form-button-item'>
                            <button type='submit' disabled={isSubmitting} className='form-button'>
                                {isSubmitting? (
                                    <LuLoader className='animate-spin' />
                                ) : (
                                    <LuFilePen size={20} />
                                )}
                                
                                <span className='text-button'>Save</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default EditDetails