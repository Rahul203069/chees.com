
import Board from "./Components/Board"

import { useState } from "react"
import { useEffect } from "react"
import  { createContext } from 'react';
import { FaFlag } from "react-icons/fa";
import {ClipLoader} from 'react-spinners'
const MyContext = createContext(''); 
const Game = () => {
const [message, setmessage] = useState('')
const [socket, setsocket] = useState<WebSocket|null>(null)
const [loader, setloader] = useState(false)
const [Side, setSide] = useState<'WHITE'|'BLACK'|''>('')


useEffect(() => { 



  }, [message])

    useEffect(() => {
        const ws= new WebSocket('ws://localhost:8080')
        
        ws.onopen=()=>{
            setsocket(ws)
          
        }
        ws.onclose=()=>{
            setsocket(null)
        }

        ws.onmessage=(e)=>{

            setmessage(JSON.parse(e.data));
            if(JSON.parse(e.data).type==="START_GAME"){
                setloader(false)
                setSide(JSON.parse(e.data).payload.color)
                console.log(JSON.parse(e.data).payload.color)
            }
        }






        
    }, [])
    
    return (
        <MyContext.Provider value={Side}>

        <div className="w-screen h-screen bg-neutral-700 flex ">
    <div className="h-full w-20 bg-neutral-800">
    <div className="text-white w-full flex justify-center text-4xl mt-4"></div>
    </div>
    <div className="h-full w-full flex ">
        
       <div className="m-6 flex-shrink-0 "><Board socket={socket} Side={Side} message={message}></Board></div>
       <div className="w-min px-9 bg-neutral-800 marker:">

       <div className=" mt-40">
   
       {JSON.stringify(message)}
       {Side.length===0&&<div onClick={()=>{    setloader(!loader);  socket?.send(JSON.stringify({type:'START_GAME',message:''})) }} className="bg-green-500 font-bold text-3xl  text-white p-3 rounded-xl justify-center mt-6 flex items-center gap-3 px-8 cursor-pointer transition-all  hover:bg-green-400 w-60"><div>{loader?< div className="flex gap-5 items-center"><ClipLoader></ClipLoader> <div className="text-sm">Finding Opponent</div></div>:'Play'} </div></div>}
       
       {Side.length>0&&<div  onClick={()=>{socket?.send(JSON.stringify({type:'RE_GAME',message:`${Side}`}))}} className='text-white bg-neutral-700 shadow-lg cursor-pointer rounded-lg mt-5  text-xl w-60 flex gap-4 justify-center p-3  '> <FaFlag></FaFlag> Resgine  </div>}
       </div>
       
       </div>
    </div>
    
        </div>
        </MyContext.Provider>
      )
}

export default Game