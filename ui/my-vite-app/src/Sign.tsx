import { FaGithub, FaGoogle } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc";

const Sign = () => {
  
  return (
    <div  className="w-screen h-screen flex justify-center  items-center  bg-neutral-700">
<div className=" p-5  rounded-lg bg-neutral-800 shadow-xl text-xl ">
    <div className="flex justify-center mb-7 text-white text-lg">
        Signup
    </div>
<div onClick={async()=>{ window.location.href= 'http://localhost:3000/auth/google' }}  className="w-full bg-white flex items-center p-4 rounded-lg mb-5 gap-8 cursor-pointer hover:bg-neutral-300 transition-all "> <FcGoogle></FcGoogle> Continue with Google</div>
<div className="w-full bg-white flex items-center p-4 rounded-lg gap-8 cursor-pointer  hover:bg-neutral-300 transition-all"> <FaGithub></FaGithub> Continue with GitHub</div>

</div>

    </div>
  )
}

export default Sign