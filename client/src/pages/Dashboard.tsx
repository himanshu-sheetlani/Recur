/* eslint-disable react-hooks/set-state-in-effect */
import { api } from "../lib/axios";
import { axiosError } from "../lib/axios";
import { useEffect, useState } from "react";
import type { AxiosResponse } from "axios";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import Main from "../components/dashboard/Main";
import toast from "react-hot-toast";

import type { stats } from "../types/stats";
import SideBar from "../components/dashboard/SideBar";

const Dashboard = () => {
  const [data, setData] = useState<stats | null>(null);

  const fetchData = async () => {
    try {
      const response: AxiosResponse<stats> = await api.get("/dashboard/stats");
      setData(response.data);
    } catch (e) {
      const err = axiosError(e);
      toast.error(err);
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  if (!data) {
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
