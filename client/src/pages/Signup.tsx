import PixelBlast from "../components/PixelBlast";
import { useState } from "react";
import { api, axiosError } from "../lib/axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import type { ChangeEvent, FormEvent } from "react";
import type { AxiosResponse } from "axios";
import type { APIRes } from "../types/stats";

const Signup = () => {
  const navigate = useNavigate()
  interface formType {
    username: string;
    email: string;
    password: string;
  }

  const [form, setForm] = useState<formType>({
    username: "",
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState<string>("");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const callAPI = async (data: formType) => {
    try {
      const response: AxiosResponse<APIRes> = await api.post(
        "/auth/signup",
        data,
      );
      toast.success(response.data.msg);
      localStorage.setItem("isLoggedIn", "true");
      navigate('/dashboard')
    } catch (e) {
      const err=axiosError(e)
      toast.error(err);
      console.log(e);
    }
  };

  const validate = (data: formType) => {
    const { username, email, password } = data;

    if (!username || !email || !password) {
      return setMsg("Please Enter Data");
    }
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;
    if (!usernameRegex.test(username)) {
      return setMsg("Username can Only Contain Letters, Number and _");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setMsg("Invalid Email Address");
    }
    callAPI(form);
  };

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    validate(form);
  }

  return (
    <div className="bg-[#16171d] text-white max-w-screen h-screen flex justify-center items-center text-center flex-col relative p-10">
      <div className="w-screen h-full absolute z-10">
        <PixelBlast
          variant="square"
          pixelSize={2}
          color="#214f9b"
          patternScale={1.5}
          patternDensity={0.85}
          enableRipples
          rippleSpeed={0.3}
          rippleThickness={0.1}
          rippleIntensityScale={1}
          speed={1.65}
          transparent
          edgeFade={0.16}
        />
      </div>
      <div className="flex justify-center absolute items-center z-50 p-2 backdrop-blur-sm border border-white/25 bg-[# 74741a] rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.25)] w-150">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 py-10 w-100"
        >
          <h2 className="text-3xl font-semibold text-white text-center tracking-wide">
            Create Account
          </h2>

          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="bg-white/5 border border-white/20 text-white placeholder:text-white/40 
               p-3 rounded-lg outline-none 
               focus:border-blue-400 focus:bg-white/10 transition"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="bg-white/5 border border-white/20 text-white placeholder:text-white/40 
               p-3 rounded-lg outline-none 
               focus:border-blue-400 focus:bg-white/10 transition"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="bg-white/5 border border-white/20 text-white placeholder:text-white/40 
               p-3 rounded-lg outline-none 
               focus:border-blue-400 focus:bg-white/10 transition"
          />

          <button
            type="submit"
            className="mt-2 bg-linear-to-r from-blue-500 to-blue-600 
               hover:from-blue-600 hover:to-blue-700 
               text-white p-3 rounded-lg font-medium 
               transition shadow-lg hover:shadow-blue-500/30"
          >
            Sign Up
          </button>
          <p>
            Already have an account?
            <Link to="/login" className="text-blue-300">
              {" "}
              Login
            </Link>
          </p>
          <p className="text-red-400">{msg}</p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
