/* eslint-disable react-hooks/set-state-in-effect */
import { api } from "../lib/axios";
import { axiosError } from "../lib/axios";
import { useEffect, useState } from "react";
import type { AxiosResponse } from "axios";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import Main from "../components/dashboard/Main";
import toast from "react-hot-toast";
import { AlertCircle, RefreshCw } from "lucide-react";

import type { stats } from "../types/stats";
import SideBar from "../components/dashboard/SideBar";

const Dashboard = () => {
  const [data, setData] = useState<stats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: AxiosResponse<stats> = await api.get("/dashboard/stats");
      setData(response.data);
    } catch (e) {
      const err = axiosError(e);
      setError(err);
      toast.error(err);
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  if (!data) {
    if (error) {
      return (
        <div className="bg-[#16171d] text-white min-h-screen flex flex-col justify-center items-center gap-8 px-4 md:px-10 lg:px-15 pt-28 pb-10 max-w-full">
          <Layout fetchData={fetchData} />
          <div className="max-w-md w-full bg-[#1c1d24]/60 backdrop-blur-md border border-[#2a2c38] rounded-2xl p-8 text-center shadow-2xl flex flex-col items-center gap-6 relative z-10">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 animate-pulse">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-100">Failed to Load Stats</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                We couldn't retrieve your practice statistics. Please check your connection or server status.
              </p>
              {error && (
                <div className="mt-3 p-3 bg-red-950/20 rounded-lg border border-red-500/10 text-xs text-red-400 font-mono break-words max-w-full">
                  {error}
                </div>
              )}
            </div>
            <button
              onClick={fetchData}
              disabled={loading}
              className="w-full py-3 px-5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:pointer-events-none disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Retrying...' : 'Retry Connection'}
            </button>
          </div>
        </div>
      );
    }
    return <Loading />;
  }
  
  return (
    <div className="bg-[#16171d] text-white min-h-screen flex flex-col lg:flex-row justify-center items-start gap-8 px-4 md:px-10 lg:px-15 pt-28 pb-10 max-w-full">
      <Layout fetchData={fetchData}/>
      <div className="w-full lg:w-[70%] xl:w-3/4 flex flex-col">
        <Main data={data} />
      </div>
      <div className="w-full lg:w-[30%] xl:w-1/4">
        <SideBar/>
      </div>
    </div>
  );
};

export default Dashboard;
