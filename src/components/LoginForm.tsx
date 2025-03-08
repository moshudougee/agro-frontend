import { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth";
import { Link, useNavigate } from "react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { LuLoader, LuLogIn } from "react-icons/lu";
import FormInput from "./FormInput";
import { SiTicktick } from "react-icons/si";

type Inputs = {
    email: string;
    password: string;
}
const LoginForm = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { login, error, clearError, isAuthenticated, loading } = useAuthStore();
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
            await login(email, password);
            if (!error) navigate("/");
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isAuthenticated) navigate('/')
    }, [isAuthenticated, navigate])

    // Show loading spinner while waiting for user to login
    if (isLoading || loading) {
        return (
            <div className="flex justify-center items-center w-full h-full">
                <LuLoader className="animate-spin" size={50} />
            </div>
        )
    }
  return (
    <div className="form-details">
        {error && <div className='text-red-700'>{error}</div>}
        <div className='form-header'>
            <LuLogIn />
            <span className='font-bold text-2xl'>Login</span>
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
                                <SiTicktick size={20} />
                            )}
                            
                            <span className='text-button'>Login</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
        <hr className='border w-10/12 mt-5' />
        <div>
            <span>Don&rsquo;t have an account?</span>{' '}
            <Link className="text-amber-800" to='/register'>
                Register
            </Link>
        </div>
    </div>
  )
}

export default LoginForm