import { SubmitHandler, useForm } from "react-hook-form";
import { useAuthStore } from "../store/auth";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { LuCopyPlus, LuLoader } from "react-icons/lu";
import { FaUserPlus } from "react-icons/fa";
import FormInput from "./FormInput";

type Inputs = {
    email: string;
    password: string;
}
const RegisterForm = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { registerUser, error, clearError, isAuthenticated, loading } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        clearError(); // clear error on component mount
    }, [clearError])

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>({
        defaultValues: {
        email: "",
        password: "",
        },
    });

    const pattern = {
        value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
        message: 'Email is invalid',
    }

    const formSubmit: SubmitHandler<Inputs> = async (form) => {
        try {
            setIsLoading(true)
            const { email, password } = form;
            const role: ROLE = "FARMER";
            await registerUser(email, password, role);
            if (!error) navigate("/login");
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isAuthenticated) navigate("/")
    }, [isAuthenticated, navigate])

    if (isLoading || loading) {
        return (
            <div className="loading-spinner">
                <LuLoader className="animate-spin" size={50} />
            </div>
        )
    }
  return (
    <div className="form-details">
        {error && <div className='text-red-700'>{error}</div>}
        <div className='form-header'>
            <FaUserPlus />
            <span className='font-bold text-2xl'>Register</span>
        </div>
        <div className="form-container">
            <form onSubmit={handleSubmit(formSubmit)} className="form">
                <FormInput<Inputs> id='email' name='Email' required register={register} pattern={pattern} errors={errors} />
                <FormInput<Inputs> id='password' name='Password' type='password' required register={register} errors={errors} />
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
                            
                            <span className='text-button'>Register</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
        <hr className='border w-10/12 mt-5' />
        <div>
            Already have an account?{' '}
            <Link className="text-amber-800" to='/login'>
                Login
            </Link>
        </div>
    </div>
  )
}

export default RegisterForm