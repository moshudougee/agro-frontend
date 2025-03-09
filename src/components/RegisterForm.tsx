import { SubmitHandler, useForm } from "react-hook-form";
import { useAuthMutations, useAuthStore } from "../store/auth";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { LuCopyPlus, LuLoader } from "react-icons/lu";
import { FaUserPlus } from "react-icons/fa";
import FormInput from "./FormInput";

type Inputs = {
    email: string;
    password: string;
}
const RegisterForm = () => {
    const { error, clearError, isAuthenticated, loading } = useAuthStore()
    const { registerUser, isRegistering } = useAuthMutations()
    const navigate = useNavigate();

    useEffect(() => {
        clearError()
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

    const formSubmit: SubmitHandler<Inputs> = (form) => {
        const { email, password } = form;
        const role: ROLE = "FARMER";
        registerUser(email, password, role);
        if (!error && isAuthenticated) navigate("/");
    }

    useEffect(() => {
        if (isAuthenticated) navigate("/")
    }, [isAuthenticated, navigate])

    if (loading) {
        return (
            <div className="loading-spinner">
                <LuLoader className="animate-spin" size={50} />
            </div>
        )
    }
  return (
    <div className="form-details">
        {error && 
            <div className='text-red-700'>
                {typeof error === "string" ? error : "An unexpected error occurred."}
            </div>
        }
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
                            disabled={isSubmitting || isRegistering}
                            className='form-button'
                        >
                            {isSubmitting || isRegistering ? (
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