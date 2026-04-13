import { useEffect, useRef } from "react";
import "./Loader.css";

export default function Loader({ onDone }) {
  const loaderRef = useRef();

  useEffect(() => {


    const totalAnimationTime = 3000; // 3 ثواني

    const timer = setTimeout(() => {

      loaderRef.current?.classList.add("fade-out");
      

      setTimeout(() => {
        onDone?.();
      }, 800);
    }, totalAnimationTime);

    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="loader-wrapper" ref={loaderRef}>
      <div className="brand">
        {"VELORA".split("").map((char, i) => (
          <span key={i} style={{ animationDelay: `${i * 0.13}s` }}>
            {char}
          </span>
        ))}
      </div>
      <div className="underline-wrap" />
      <div className="tagline">watch anything. anywhere.</div>
    </div>
  );
}