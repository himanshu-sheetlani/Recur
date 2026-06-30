import { useState, useEffect } from "react";
import logo from "../assets/logo.svg";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import type { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import type { APIRes } from "../types/stats";
import { api } from "../lib/axios";
import { LogOut, History } from "lucide-react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/auth/me");
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
      } catch (e) {
        setIsLoggedIn(false);
        localStorage.removeItem("isLoggedIn");
        console.log(e)
      }
    };
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      const response: AxiosResponse<APIRes> = await api.post("/auth/logout");
      toast.success(response.data.msg);
      setIsLoggedIn(false);
      localStorage.removeItem("isLoggedIn");
      navigate("/login");
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="flex justify-between fixed top-5 items-center z-50 p-2 px-20 backdrop-blur-sm border-b border-white/25 bg-[#7474741a] rounded-2xl w-250">
      <div>
        <img src={logo} alt="LOGO" className="h-10 w-auto" />
      </div>
      {isLoggedIn ? (
        <div className="bg-[#214f9b] w-5 h-5">

        </div>
      ): ("")}

      {isLoggedIn ? (
        <div className="flex ">
          <Link to="/history">
            <Button variant="outline" className="mx-2 text-black">
              <History />
              History
            </Button>
          </Link>
            <Button variant="destructive" className="mx-2" onClick={logout}>
              <LogOut />    
              Log out
            </Button>
        </div>
      ) : (
        <div className="flex ">
          <Link to="/signup">
            <Button variant="outline" className="mx-2 text-black">
              Signup
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="default" className="mx-2">
              Login
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
