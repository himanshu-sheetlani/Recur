import { useState, useEffect } from "react";
import logo from "../assets/logo.svg";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import type { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import type { APIRes } from "../types/stats";
import { api } from "../lib/axios";
import { LogOut, History, Plus, Menu, X, Home, Loader2 } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

interface NavbarProps {
  setPopup: Dispatch<SetStateAction<boolean>>;
}

const Navbar = ({ setPopup }: NavbarProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      const response: AxiosResponse<APIRes> = await api.post("/auth/logout");
      toast.success(response.data.msg);
      setIsLoggedIn(false);
      localStorage.removeItem("isLoggedIn");
      navigate("/login");
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl flex flex-col items-center">
      <div className="flex justify-between items-center w-full p-2 px-4 md:px-8 backdrop-blur-md border border-white/20 bg-[#16171d]/80 rounded-2xl relative shadow-lg">
        <Link 
          to={isLoggedIn ? "/dashboard" : "/"} 
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <img src={logo} alt="LOGO" className="h-8 md:h-10 w-auto" />
        </Link>

        {isLoggedIn && (
          <button 
            onClick={() => setPopup(true)}
            className="hidden md:block absolute left-1/2 -translate-x-1/2 group cursor-pointer"
          >
            <div className="bg-[#214f9b] hover:bg-[#1a3f7c] hover:scale-105 transition-all w-12 h-12 md:w-15 md:h-15 rounded-full border-t-2 border-x-2 border-white/50 flex justify-center items-center shadow-md">
              <Plus className="w-8 h-8 md:w-10 md:h-10 text-white group-hover:rotate-90 transition-transform duration-300" />
            </div>
          </button>
        )}

        {isLoggedIn ? (
          <div className="hidden md:flex items-center gap-2">
            <Link to="/dashboard">
              <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10 flex items-center gap-1.5 text-sm px-4 py-2">
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </Link>
            <Link to="/history">
              <Button variant="outline" className="text-black flex items-center gap-1.5 text-sm px-4 py-2">
                <History className="h-4 w-4" />
                <span>History</span>
              </Button>
            </Link>
            <Button 
              variant="destructive" 
              className="flex items-center gap-1.5 text-sm px-4 py-2 disabled:opacity-50" 
              onClick={logout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
            </Button>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-2">
            <Link to="/signup">
              <Button variant="outline" className="text-black text-sm px-4 py-2">
                Signup
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="default" className="text-sm px-4 py-2">
                Login
              </Button>
            </Link>
          </div>
        )}

        <div className="flex md:hidden items-center gap-2">
          {isLoggedIn && (
            <button 
              onClick={() => setPopup(true)} 
              className="bg-[#214f9b] hover:bg-[#1a3f7c] active:scale-95 transition-all p-2 rounded-full border border-white/30 flex justify-center items-center shadow-md cursor-pointer"
              title="Add Attempt"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          )}
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="w-full mt-2 p-4 bg-[#16171d]/90 border border-white/20 rounded-2xl backdrop-blur-md flex flex-col gap-2 md:hidden shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          {isLoggedIn ? (
            <div className="flex flex-col gap-1 w-full text-left">
              <Link 
                to="/dashboard" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors text-white text-sm font-medium"
              >
                <Home className="h-5 w-5 text-gray-400" />
                <span>Dashboard</span>
              </Link>
              
              <Link 
                to="/history" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors text-white text-sm font-medium"
              >
                <History className="h-5 w-5 text-gray-400" />
                <span>History</span>
              </Link>
              
              <div className="h-px bg-white/10 my-1" />
              
              <button 
                onClick={() => {
                  if (isLoggingOut) return;
                  setIsMenuOpen(false);
                  logout();
                }}
                disabled={isLoggingOut}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors text-sm font-medium text-left cursor-pointer w-full disabled:opacity-50 disabled:pointer-events-none"
              >
                {isLoggingOut ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <LogOut className="h-5 w-5" />
                )}
                <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1 w-full text-left">
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors text-white text-sm font-medium"
              >
                <Home className="h-5 w-5 text-gray-400" />
                <span>Home</span>
              </Link>
              
              <div className="h-px bg-white/10 my-1" />
              
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Link 
                  to="/signup" 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full"
                >
                  <Button variant="outline" className="w-full text-black justify-center py-2.5">
                    Signup
                  </Button>
                </Link>
                <Link 
                  to="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full"
                >
                  <Button variant="default" className="w-full justify-center py-2.5">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
