
import axios from 'axios'
import { useEffect, useState } from "react"
function useSession(){
const [session, setsession] = useState<null|JSON>(null)

useEffect(() => {
  
    axios.get('http://localhost:3000/session',{withCredentials:true}).then(res=>setsession(res.data)).catch((e)=>{})
}, [])




return{session,setsession}

}

export default useSession