import logo from "../assets/logo.svg"
import { Button } from "./ui/button"
import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <div className='flex justify-between absolute top-5 items-center z-50 p-2 px-20 backdrop-blur-sm border-b border-white/25 bg-[#7474741a] rounded-2xl w-250'>
        <div>
            <img src={logo} alt="LOGO" className="h-10 w-auto"/>
        </div>
        <div className="flex ">
            <Link to="/signup">
                <Button variant="outline" className="mx-2">Signup</Button>
            </Link>
            <Link to="/login">
                <Button variant="default" className="mx-2">Login</Button>
            </Link>
        </div>
    </div>
  )
}

export default Navbar