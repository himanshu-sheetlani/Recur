import { useState, useEffect } from "react";
import logo from "../assets/logo.svg";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import type { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import type { APIRes } from "../types/stats";
import { api } from "../lib/axios";
import { LogOut, History, Plus } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

interface NavbarProps {
  setPopup: Dispatch<SetStateAction<boolean>>;
}

const Navbar = ({ setPopup }: NavbarProps) => {
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
        console.log(e);
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
    <>
      <div className="flex justify-between fixed top-5 items-center z-10 p-2 px-4 md:px-8 backdrop-blur-sm border-b border-white/25 bg-[#7474741a] rounded-2xl w-[92%] max-w-5xl">
        <div>
          <img src={logo} alt="LOGO" className="h-8 md:h-10 w-auto" />
        </div>
        {isLoggedIn ? (
          <button onClick={() => setPopup(true)}>
            <div className="bg-[#214f9b] hover:bg-[#1a3f7c] transition-colors w-12 h-12 md:w-15 md:h-15 absolute top-2 md:top-3 left-1/2 rounded-full border-t-2 border-x-2 border-white/50 -translate-x-1/2 flex justify-center items-center">
              <Plus className="w-8 h-8 md:w-10 md:h-10" />
            </div>
          </button>
        ) : (
          ""
        )}

        {isLoggedIn ? (
          <div className="flex items-center gap-1 md:gap-2">
            <Link to="/history">
              <Button variant="outline" className="text-black flex items-center gap-1.5 text-xs md:text-sm px-2 md:px-4 py-1.5 md:py-2">
                <History className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span className="hidden sm:inline">History</span>
              </Button>
            </Link>
            <Button variant="destructive" className="flex items-center gap-1.5 text-xs md:text-sm px-2 md:px-4 py-1.5 md:py-2" onClick={logout}>
              <LogOut className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Log out</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-1 md:gap-2">
            <Link to="/signup">
              <Button variant="outline" className="text-black text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2">
                Signup
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="default" className="text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2">
                Login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
