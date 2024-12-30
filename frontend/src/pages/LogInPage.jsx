import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {Eye,EyeOff, Loader2} from "lucide-react" 
import { Link } from 'react-router-dom';
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const LogInPage =() => {
    const [showPassWord, setShowPassword] = useState(false)
    const [formData,setFormData] = useState({
        email : "",
        password : ""
    });
    const {login,isLoggingIn} = useAuthStore()

    const handleSubmit = (e)=> {
        e.preventDefault();
        login(formData)
    }

    return <div className="min-h-screen grid lg:grid-cols-2">
                    {/*left side of the grid*/}
                    <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                        <div className="w-full max-w-md space-y-8">
                            {/* Logo Section */}
                            <div className="flex flex-col items-center mb-6">
                                    <div className="w-16 h-14 flex items-center justify-center group p-2 transition duration-300 mb-0">
                                        {/* Example: Initials or Logo */}
                                        <svg
                                        viewBox="0 0 512 512"
                                        fill="currentColor"
                                        className="h-24 w-14 opacity-50 group-hover:opacity-100 group-hover:-translate-y-3 transition-all duration-300"
                                        >
                                        <path d="M447.1 0h-384C27.85 0-.9 28.75-.9 63.1v287.1c0 35.25 28.75 63.1 64 63.1h96v83.98c0 9.836 11.02 15.55 19.12 9.7l124.9-93.68h144c35.25 0 64-28.75 64-63.1V63.1C511.1 28.75 483.2 0 447.1 0zM464 352c0 8.75-7.25 16-16 16H288l-80 60v-60H64c-8.75 0-16-7.25-16-16V64c0-8.75 7.25-16 16-16h384c8.75 0 16 7.25 16 16v288z" />
                                        </svg>
                                    </div>
                                    <h1 className="mt-0 text-3xl font-bold text-slate-300">
                                    Welcome Back
                                    </h1>
                                    <h2 className="mt-4 text-xl font-bold text-gray-500">
                                       Sign in to your account
                                    </h2>
                                    </div>
                                    <form onSubmit={handleSubmit} className="space-y-6 mb-0 pb-0"> 

                                        <label className="input input-bordered flex items-center gap-2 group hover:bg-gray-700 hover:-translate-y-1 p-2 transition duration-300">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 16 16"
                                            fill="currentColor"
                                            className="h-4 w-4 opacity-70 group-hover:opacity-100 transition duration-300"
                                        >
                                            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                                            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                                        </svg>
                                        <input
                                            type="email"
                                            className="grow group-hover:placeholder-gray-500 focus:outline-none transition duration-300"
                                            placeholder="Email : someone@example.com "
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                        </label>

                                        <label className="input input-bordered flex items-center gap-2 group hover:bg-gray-700 hover:-translate-y-1 p-2 transition duration-300 ">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 16 16"
                                                fill="currentColor"
                                                className="h-4 w-4 opacity-70 group-hover:opacity-100 transition duration-300 ">
                                                <path
                                                fillRule="evenodd"
                                                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                                clipRule="evenodd" />
                                            </svg>
                                            <input type={showPassWord ? "text" : "password"} 
                                            className="grow  group-hover:placeholder-gray-500 focus:outline-none transition duration-300" 
                                            placeholder="••••••••••••" 
                                            value={formData.password} 
                                            onChange={(e)=> setFormData({...formData,password:e.target.value})} />

                                            <button 
                                                type="button" 
                                                className="  pr-3 flex items-center"
                                                onClick={()=> setShowPassword(!showPassWord)}
                                            >
                                                {showPassWord ? (<EyeOff className="size-5 text-base-content/40"/>):
                                                (<Eye className="size-5 text-base-content/40"/>)}
                                                
                                            </button>
                                        </label>
                                        
                                        <button type="submit" className=" btn hover:bg-slate-500 bg-slate-700 w-full text-slate-200 mb-0 pb-0" disabled={isLoggingIn} >
                                            { isLoggingIn ? (
                                                <>
                                                    <Loader2 className="size-5 animate-spin "/>
                                                    Loading...
                                                </>
                                                
                                            ):(
                                                "Sign in"
                                            )}
                                        </button>
                                    </form>
                                    <p className="mt-0 pt-0 ml-28">
                                        Don&apos;t have an Account? <Link to="/signup" className="link link-primary">Sign up</Link>
                                    </p>

                        
                        </div>
                    </div>
                    {/*Right side of the grid */}
                    
                    <AuthImagePattern
                        title="Join our community"
                        subtitle="connect with friends, share moments , and stay connected with your loved ones..."/>
            </div>
}

export default LogInPage