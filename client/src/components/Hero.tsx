import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    // <div className="">
    <div className="text-center">
      <h1 className="text-6xl font-bold pb-10">
        Stop forgetting DSA. <br />
        Start retaining it.
      </h1>
      <p className="text-xl font-normal my-5">
        Most developers forget 70% of what they solve. Recur makes sure you
        don’t.
      </p>
      <Link to="/signup">
      <Button className="p-5 mt-10" variant="secondary">
        Start Practicing
      </Button>
      </Link>
    </div>
  );
};

export default Hero;
