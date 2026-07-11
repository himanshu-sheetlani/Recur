import axios from "axios";

const backendURL= import.meta.env.VITE_API_BASE_URL + "/api"

const api = axios.create({
    baseURL: backendURL,
    timeout: 10000,
    withCredentials: true,
})

const axiosError = (err:unknown): string =>{
    if (axios.isAxiosError(err)){
        if (typeof err.response?.data === "string") {
            return err.response.data
        }
        return err.response?.data?.msg || err.response?.data || "Something went wrong... Try again later"
    }
    else{
        return "Unexpected error"
    }
}

export {api, axiosError}