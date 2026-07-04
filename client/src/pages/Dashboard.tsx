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
    <div className="bg-[#16171d] text-white max-w-screen min-h-screen flex justify-center items-center flex-wrap px-15 pt-25">
      <Layout fetchData={fetchData}/>
        <div className="text-center w-3/4 min-h-screen flex justify-center flex-col p-10 pt-0 pl-0 pb-0">
          <Main data={data} />
        </div>
        <SideBar/>
        {/* <h1 className="text-4xl font-bold m-10">
            Dashboard
        </h1>
        <Button className="p-5 m-5 text-lg" variant='destructive' onClick={logout}>Logout</Button> */}
    </div>
  );
};

export default Dashboard;
