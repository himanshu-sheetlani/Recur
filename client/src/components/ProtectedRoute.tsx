import { useEffect, useState } from "react"
import { api } from "../lib/axios"
import { Navigate } from "react-router-dom"

import type { ReactNode } from "react"


const ProtectedRoute = ({children}: {children: ReactNode}) => {

    const [loading, setLoading] = useState(true)
    const [isAuth, setIsAuth] = useState(false)

    useEffect(()=>{
        api.get("/me", {
            withCredentials: true
        })
        .then(()=>{
            setLoading(false)
            setIsAuth(true)
        })
        .catch(()=>{
            setLoading(false)
            setIsAuth(false)
        })
    },[])

    if (loading) return <div>Loading...</div>

    return isAuth? children : <Navigate to="/login"/>
}

export default ProtectedRoute