/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import SeedsNav from "./SeedsNav"
import { useNavigate } from "react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import useFertilizers from "../../hooks/useFertilizers";
import axios from "axios";
import { LuCopyPlus, LuLoader } from "react-icons/lu";
import FormInput from "../FormInput";
import Select from "react-select";

type Inputs = {
  name: string;
  price: number;
}
const AddSeeds = () => {
    const { fertilizers, loading, error: fertError } = useFertilizers()
    const [fertilizerIds, setFertilizerIds] = useState<string[]>([])
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
          const response = await axios.post('/api/seeds/create', { name, price, fertilizerIds })
          if (response.status === 201) {
              setError(null)
              navigate('/dashboard/seeds')
          }
      } catch (error) {
          console.log(error)
          setError('An error occurred while submitting the form.')
      } finally {
        setIsLoading(false)
      }
    }

    const handleMultiChange = (selectedOptions: any) => {
      const selectedIds = selectedOptions.map((option: any) => option.value);
      setFertilizerIds(selectedIds);
    };

    if (isLoading || loading) {
        return (
          <div className="loading-spinner">
              <LuLoader className="animate-spin" size={50} />
          </div>
        )
    }

    //console.log(fertilizerIds)

  return (
    <div className="main-body">
      <SeedsNav />
      <div className="body-content">
        <div className="form-details">
          {error || fertError && <div className='text-red-700'>{error || fertError}</div>}
          <div className="form-header">
            <LuCopyPlus />
            <span className='font-bold text-2xl'>New Seeds</span>
          </div>
          <div className="form-container">
            <form onSubmit={handleSubmit(formSubmit)} className="form">
              <FormInput<Inputs> id='name' name="Name" required register={register} errors={errors} />
              <FormInput<Inputs> id='price' name="Price" required register={register} errors={errors} type="number" step={step} />
              <div className="flex flex-col gap-1">
                <div className="form-item">
                  <div className='flex w-full md:w-1/5'>
                    <span>Select Fertilizers</span>
                  </div>
                  <div className="flex w-full md:w-4/5">
                    <Select 
                      isMulti
                      options={fertilizers?.map(fert => ({ value: fert.id, label: fert.name }))}
                      onChange={handleMultiChange}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              <div className='form-button-container'>
                <div className='form-button-item'>
                  <button
                    type="submit"
                    disabled={isSubmitting || fertilizers?.length === 0}
                    className="form-button"
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

export default AddSeeds