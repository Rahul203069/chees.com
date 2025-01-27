
import { FaChess } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useSession from "./hooks/useSession";
import { SiChessdotcom } from "react-icons/si";
import { IoMdLogIn } from "react-icons/io";
import { useState } from "react";
const Home = () => {
    const navigate=useNavigate()
    const {session}= useSession()
    const [isgameon, setisgameon] = useState(false)
  return (
    <div className="w-screen h-screen bg-neutral-700 flex ">
<div className="h-full w-20 bg-neutral-800">
<div className="text-white w-full flex justify-center text-4xl mt-4"><SiChessdotcom></SiChessdotcom></div>
</div>
<div className="h-full w-full flex ">
  
   <div className="m-6 flex-shrink-0 "> <img className="w-[550px] h-[550px] rounded-lg" src="https://www.chess.com/bundles/web/images/offline-play/standardboard.1d6f9426.png"></img></div>
   <div className=" mt-40">

<div className="text-white font-bold text-4xl">Play Chess Online on the #1 Site!</div>
   

   <div onClick={()=>{navigate('/Game')}} className="bg-green-500 font-bold text-3xl w-max text-white p-5 rounded-xl mt-6 flex items-center gap-3 px-8 cursor-pointer transition-all hover:bg-green-400"><FaChess></FaChess><div>Play Online<div className="flex-col-reverse text-xs font-medium">play with somenone at your level</div></div></div>
   <div onClick={()=>{navigate('/Sign')}} className="bg-neutral-500 font-bold text-3xl w-max text-white p-5 rounded-xl mt-6 flex items-center gap-3 px-8 cursor-pointer transition-all hover:bg-neutral-400"><IoMdLogIn></IoMdLogIn><div>Login<div className="flex-col-reverse text-xs font-medium">play with somenone at your level</div></div></div>
   
   
   
   </div>
</div>

    </div>
  )
}

export default Home