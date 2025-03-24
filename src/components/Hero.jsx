// import { Canvas } from "@react-three/fiber";
// import { OrbitControls } from "@react-three/drei";
// import { FaLocationArrow } from "react-icons/fa6";
// import { Spotlight } from "./ui/Spotlight";
// import { TextGenerateEffect } from "./ui/TextGenerateEffect";
// import { Suspense } from "react";
// import Model from "./Robot_playground"

// // 🎨 Simple 3D Box Component (Replace with your 3D model)
// const Box = () => {
//   return (
//     <mesh>
//       <boxGeometry args={[2, 2, 2]} />
//       <meshStandardMaterial color="hotpink" />
//     </mesh>
//   );
// };

// const Hero = () => {
//   return (
//     <div className="pb-20 relative bg-background text-foreground h-screen">
//       {/* Background 3D Canvas */}
//       <Canvas
//         className="absolute top-0 left-0 w-full h-full z-0"
//         camera={{ position: [0, 0, 5] }}
//       >
//         <ambientLight intensity={0.5} />
//         <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} />
//         <Suspense fallback={null}>
//           <Model />
//         </Suspense>
//         <OrbitControls />
//       </Canvas>

      
//     </div>
{/* <div className="w-1/2 relative z-10 flex flex-col justify-center items-start space-y-6">
<p className="uppercase tracking-widest text-xs text-primary">
  Dynamic Web Magic with AI
</p>

<TextGenerateEffect
  words="Transforming Concepts into Seamless User Experiences"
  className="text-left text-[30px] sm:text-4xl md:text-5xl lg:text-6xl"
/>

<p className="md:tracking-wider text-sm md:text-lg lg:text-2xl">
  Building the Future with AI: Where Innovation Meets Intelligence
</p>
</div> */}
//   );
// };

// export default Hero;

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import { Suspense } from "react";
import Model from "./Robot_playground";

const Hero = () => {
  return (
    <div className="bg-background text-foreground w-screen h-screen flex items-center justify-center px-10 ">
      {/* 3D Model on the Left */}
      <div className="w-[50%] h-full" >
        <Canvas
          className="top-0 left-0 w-full h-full"
          camera={{ position: [0, 0, 5] }}
        >
          <ambientLight intensity={0.5} />
          <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} />
          <Suspense fallback={null}>
            <Model />
          </Suspense>
          <OrbitControls />
        </Canvas>
      </div>

      {/* Hero Content on the Right */}
      <div className="w-1/2 relative z-10 flex flex-col justify-center items-start space-y-6">
        <p className="uppercase tracking-widest text-xs text-primary">
          Dynamic Web Magic with AI
        </p>

        <TextGenerateEffect
          words="Transforming Concepts into Seamless User Experiences"
          className="text-left text-[30px] sm:text-4xl md:text-5xl lg:text-6xl"
        />

        <p className="md:tracking-wider text-sm md:text-lg lg:text-2xl">
          Building the Future with AI: Where Innovation Meets Intelligence
        </p>
      </div>
    </div>
  );
};

export default Hero;

