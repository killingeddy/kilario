"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function FishFollower() {
  const fishRef = useRef(null);
  const fishPos = useRef({ x: 200, y: 200 });
  const mousePos = useRef({ x: 200, y: 200 });

  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    function handleMouseMove(e) {
      mousePos.current = { x: e.clientX, y: e.clientY };
    }

    window.addEventListener("mousemove", handleMouseMove);

    let frame;

    function animate() {
      const dx = mousePos.current.x - fishPos.current.x;
      const dy = mousePos.current.y - fishPos.current.y;
      const distance = Math.hypot(dx, dy);

      const followDistance = 70;

      if (distance > followDistance) {
        fishPos.current.x += dx * 0.04;
        fishPos.current.y += dy * 0.04;

        // cria rastro ocasionalmente
        if (Math.random() < 0.15) {
          setRipples((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              x: fishPos.current.x,
              y: fishPos.current.y,
            },
          ]);
        }
      }

      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      if (fishRef.current) {
        fishRef.current.style.transform = `
          translate(${fishPos.current.x}px, ${fishPos.current.y}px)
          translate(-50%, -50%)
          rotate(${angle}deg)
        `;
      }

      frame = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (ripples.length === 0) return;

    const timeout = setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 2000);

    return () => clearTimeout(timeout);
  }, [ripples]);

  useEffect(() => {
    document.body.style.cursor = 'url("/anzol.png") 16 16, auto';

    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  return (
    <>
      <div
        ref={fishRef}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          pointerEvents: "none",
          zIndex: -9999,
        }}
      >
        <Image src="/peixe.png" alt="peixe" width={250} height={250} />
      </div>
    </>
  );
}
