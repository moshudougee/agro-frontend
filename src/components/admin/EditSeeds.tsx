/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import SeedsNav from "./SeedsNav"
import { useNavigate, useParams } from "react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import useFertilizers from "../../hooks/useFertilizers";
import axios from "axios";
import { LuFilePen, LuLoader } from "react-icons/lu";
import FormInput from "../FormInput";
import Select from "react-select";
import useSeed from "../../hooks/useSeed";

type Inputs = {
  name: string;
  price: number;
}
const EditSeeds = () => {
    const { seedsId } = useParams()
    const { fertilizers, loading, error: fertError } = useFertilizers()
    const { seed, loading: seedLoading, error: seedError } = useSeed(seedsId!)
    const [fertilizerIds, setFertilizerIds] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()
    const step = 0.01

    const { 
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>({
        defaultValues: {
            name: seed?.name || '',
            price: seed?.price || 0
        }
    })

    useEffect(() => {
        if (seed) {
            setValue('name', seed.name)
            setValue('price', seed.price)
            if (seed.fertilizers) {
                const savedIds = []
                for (const fert of seed.fertilizers) {
                    savedIds.push(fert.id)
                }
                setFertilizerIds(savedIds)
            }
        }
    }, [seed,setValue])

    const formSubmit: SubmitHandler<Inputs> = async (form) => {
      try {
          setIsLoading(true)
          const { name, price } = form
          const response = await axios.put(`/api/seeds/updateSeed/${seedsId}`, { name, price, fertilizerIds })
          if (response.status === 200) {
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

    if (loading || seedLoading) {
        return (
          <div className="loading-spinner">
              <LuLoader className="animate-spin" size={50} />
          </div>
        )
    }
    if (seedError) {
        return (
            <div className='loading-spinner'>
                <span className="text-red-700">{seedError.message}</span>
            </div>
        )
    }
  return (
    <div className="main-body">
      <SeedsNav />
      <div className="body-content">
        <div className="form-details">
          {error || fertError && <div className='text-red-700'>{error || fertError.message}</div>}
          <div className="form-header">
            <LuFilePen />
            <span className='font-bold text-2xl'>Edit Seeds</span>
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
                      defaultValue={seed?.fertilizers?.map(fert => ({ value: fert.id, label: fert.name }))}
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
                    disabled={isSubmitting || isLoading || fertilizers?.length === 0}
                    className="form-button"
                  >
                    {isSubmitting || isLoading ? (
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

export default EditSeeds