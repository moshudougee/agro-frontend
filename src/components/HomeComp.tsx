import { useEffect, useState } from "react"
import HomeCompNav from "./HomeCompNav"
import { useOrderStore } from "../store/orderCart"
import useSeeds from "../hooks/useSeeds"
import { SubmitHandler, useForm } from "react-hook-form"
import { calculateQuantity } from "../utils/utils"
import { LuCopyPlus, LuLoader } from "react-icons/lu"
import FormInput from "./FormInput"
import FormSelect from "./FormSelect"

type Inputs = {
  landSize: number;
  seedsID: string;
  fertilizerID: string;
}
export const HomeComp = () => {
    const { addOrderUnit } = useOrderStore()
    const { seeds, loading, error } = useSeeds()
    const [orderUnit, setOrderUnit] = useState<OrderUnit | null>(null)
    const [fertilizers, setFertilizers] = useState<Fertilizer[]>([])
    const step = 0.01
    

    const { 
       register,
       handleSubmit,
       watch,
       setValue,
       formState: { errors, isSubmitting },
    } = useForm<Inputs>()

    const seedsId = watch('seedsID')

    useEffect(() => {
      if (seeds && seedsId) {
        const selecteSeeds = seeds.find((item) => item.id === seedsId)

        if (selecteSeeds) {
          setFertilizers(selecteSeeds.fertilizers!)
        } else {
          setFertilizers([])
        }
      }
    }, [seeds, seedsId])

    const formSubmit: SubmitHandler<Inputs> = (form) => {
      try {
          const { landSize, seedsID, fertilizerID } = form
          const { fertilizerQty, seedsQty } = calculateQuantity(landSize)
          let seedsAmt = 0
          let fertilizerAmt = 0
          let seedsName = ''
          let fertilizerName = ''
          if (seeds) {
            const selectedSeeds = seeds.find(item => item.id === seedsID)
            if (selectedSeeds) {
              seedsName = selectedSeeds.name
              seedsAmt = selectedSeeds.price * seedsQty
              const selectedFertilizer = selectedSeeds.fertilizers!.find(item => item.id === fertilizerID)
              if (selectedFertilizer) {
                fertilizerName = selectedFertilizer.name
                fertilizerAmt = selectedFertilizer.price * fertilizerQty
              }
            }

            if (seedsAmt > 0 && fertilizerAmt > 0) {
              setOrderUnit({
                seedsID,
                seedsQty,
                fertilizerID,
                fertilizerQty,
                fertilizerName,
                seedsName,
                seedsAmt,
                fertilizerAmt,
                landSize,
              })
            } else {
              alert('Please select valid seeds and fertilizer.')
            }
          }
      } catch (error) {
          console.log(error)
      }
    }

    useEffect(() => {
      if (orderUnit) {
        addOrderUnit(orderUnit);
        setValue('seedsID', '');
        setValue('fertilizerID', '');
        setValue('landSize', 0);
        setFertilizers([]);
        setOrderUnit(null);
      }
    }, [orderUnit, addOrderUnit, setValue])

    if (loading) {
      return (
        <div className="loading-spinner">
          <LuLoader className="animate-spin" size={50} />
        </div>
      )
    }

    //console.log(orderUnit)

  return (
    <div className="main-body">
        <HomeCompNav />
        <div className="body-content">
          <div className="form-details">
            {error && <div className='text-red-700'>{error.message}</div>}
            <div className="form-header">
              <LuCopyPlus />
              <span className='font-bold text-2xl'>Select Farm Inputs</span>
            </div>
            <div className="form-container">
              <form onSubmit={handleSubmit(formSubmit)} className="form">
                <FormInput<Inputs> id='landSize' name="Landsize (Acres)" required 
                  register={register} errors={errors} type="number" step={step}
                />
                <FormSelect<Inputs> id='seedsID' name="Select Seeds" items={seeds!} required register={register} errors={errors} />
                {fertilizers && fertilizers.length > 0 &&
                  <FormSelect<Inputs> id='fertilizerID' name="Select Fertilizer" items={fertilizers} 
                    required register={register} errors={errors} 
                  />
                }
                <div className='form-button-container'>
                  <div className='form-button-item'>
                      <button type='submit' disabled={isSubmitting} className='form-button'>
                          {isSubmitting? (
                              <LuLoader className='animate-spin' />
                          ) : (
                              <LuCopyPlus size={20} />
                          )}
                          
                          <span className='text-button'>Add to Cart</span>
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
