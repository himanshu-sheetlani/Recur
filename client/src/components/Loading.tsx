// import { Loader } from "lucide-react"


// const Loading = () => {
//   return (
//     <div className="flex flex-col items-center justify-center h-screen">
//         <Loader/>
//         <h1>
//             loading... from loading page        
//         </h1>
//     </div>
//   )
// }

// export default Loading



import  { useEffect, useRef, useState } from 'react';
// Import the SVG file directly as a React component
import Logo from '../assets/logo.svg?react';  

export default function LogoLoadingScreen() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [length, setLength] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      // 1. Automatically find the path inside your imported logo file
      const path = containerRef.current.querySelector('path');
      if (path) {
        const totalLength = path.getTotalLength();
        setLength(totalLength);
        
        // 2. Dynamically apply Tailwind styles directly to the asset's path
        path.style.strokeDasharray = `${totalLength}`;
        path.style.strokeDashoffset = `${totalLength}`;
        path.style.setProperty('--logo-length', `${totalLength}`);
        
        // 3. Inject the Tailwind animation classes natively
        path.classList.add(
          'fill-none', 
          'stroke-cyan-400', 
          'stroke-[2px]', 
          '[stroke-linecap:round]', 
          'animate-logo-draw'
        );
      }
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950">
      {/* Container ref lets JavaScript access the SVG inside */}
      <div ref={containerRef} className="w-48 h-48 flex items-center justify-center">
        <Logo className="w-full h-full text-cyan-400" />
      </div>
    </div>
  );
}
