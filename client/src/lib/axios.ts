import axios from "axios";

const backendURL= import.meta.env.VITE_API_BASE_URL + "/api"

const api = axios.create({
    baseURL: backendURL,
    timeout: 10000
})

const axiosError = (err:unknown): string =>{
    if (axios.isAxiosError(err)){
        return err.response?.data?.msg || "Something went wrong"
    }
    else{
        return "Unexpected error"
    }
}

export {api, axiosError}