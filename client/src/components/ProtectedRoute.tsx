import { useEffect, useState } from "react"
import { api } from "../lib/axios"
import { Navigate } from "react-router-dom"

import type { ReactNode } from "react"
import Loading from "./Loading"


const ProtectedRoute = ({children}: {children: ReactNode}) => {

    const [loading, setLoading] = useState(true)
    const [isAuth, setIsAuth] = useState(false)

    useEffect(()=>{
        api.get("/auth/me", {
            withCredentials: true
        })
        .then(()=>{
            setLoading(false)
            setIsAuth(true)
            localStorage.setItem("isLoggedIn", "true")
        })
        .catch(()=>{
            setLoading(false)
            setIsAuth(false)
            localStorage.removeItem("isLoggedIn")
        })
    },[])

    if (loading) return <Loading />

    return isAuth? children : <Navigate to="/login"/>
}

export default ProtectedRoute