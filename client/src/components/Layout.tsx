import Navbar from "./Navbar";
import CreateAttempt from "./CreateAttempt";
import { useState } from "react";

const Layout = ({fetchData}) => {
  const [popup, setPopup] = useState(false);
  return (
    <div className="flex justify-center text-white">
      <Navbar setPopup={setPopup} />
      <CreateAttempt popup={popup} setPopup={setPopup} fetchData={fetchData}/>
    </div>
  );
};

export default Layout;
