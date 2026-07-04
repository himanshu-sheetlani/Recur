import PixelBlast from "../components/PixelBlast";
import Hero from "../components/landing/Hero";
import Layout from "../components/Layout";


const Landing = () => {
  return (
    <div className="bg-[#16171d] min-h-screen w-full flex justify-center items-center text-center flex-col relative py-20 px-4">
      <div className="w-screen h-full absolute z-10">
        <PixelBlast
            variant="square"
            pixelSize={2}
            color="#214f9b"
            patternScale={1.5}
            patternDensity={0.85}
            enableRipples
            rippleSpeed={0.3}
            rippleThickness={0.1}
            rippleIntensityScale={1}
            speed={1.65}
            transparent
            edgeFade={0.16}
        />
      </div>
      <Layout/>
      <div className="text-white text-4xl font-bold z-20 relative">
        <Hero/>
      </div>
    </div>
  );
};

export default Landing;
