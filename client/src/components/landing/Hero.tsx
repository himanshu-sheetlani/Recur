import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="text-center px-4 max-w-3xl mx-auto">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold pb-6 md:pb-10 leading-tight">
        Stop forgetting DSA. <br className="hidden sm:inline" />
        Start retaining it.
      </h1>
      <p className="text-base sm:text-lg md:text-xl font-normal my-4 md:my-5 max-w-xl mx-auto text-gray-300">
        Most developers forget 70% of what they solve. Recur makes sure you
        don’t.
      </p>
      <Link to="/signup">
        <Button className="p-4 md:p-5 mt-6 md:mt-10 text-sm md:text-base cursor-pointer" variant="secondary">
          Start Practicing
        </Button>
      </Link>
    </div>
  );
};

export default Hero;
