import React, { useState } from "react";
import Navbar from "./Navbar";
import CreateAttempt from "./CreateAttempt";

type LayoutProps = {
  fetchData?: () => void | Promise<void>;
};

const Layout: React.FC<LayoutProps> = ({ fetchData }) => {
  const [popup, setPopup] = useState(false);
  return (
    <div className="flex justify-center text-white absolute w-full left-0 right-0 z-50">
      <Navbar setPopup={setPopup} />
      <CreateAttempt popup={popup} setPopup={setPopup} fetchData={fetchData}/>
    </div>
  );
};

export default Layout;
