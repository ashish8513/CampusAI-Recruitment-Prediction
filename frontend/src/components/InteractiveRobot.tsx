"use client";

import { useRef, useState, useEffect, useCallback, type RefObject } from "react";

type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, { box: string; maxPupil: number }> = {
  sm: { box: "h-10 w-10", maxPupil: 4 },
  md: { box: "h-16 w-16", maxPupil: 6 },
  lg: { box: "h-72 w-72 md:h-96 md:w-96", maxPupil: 12 },
};

function EyePupil({
  eyeRef,
  pupil,
  blink,
  socketClass,
  pupilClass,
  highlightClass,
}: {
  eyeRef: RefObject<HTMLDivElement | null>;
  pupil: { x: number; y: number };
  blink: boolean;
  socketClass: string;
  pupilClass: string;
  highlightClass: string;
}) {
  return (
    <div ref={eyeRef} className={`relative rounded-full bg-cyan-400/30 ${socketClass}`}>
      <div
        className={`absolute left-1/2 top-1/2 rounded-full bg-cyan-300 shadow-[0_0_15px_#22d3ee] ${pupilClass} ${
          blink ? "scale-y-0" : ""
        }`}
        style={{
          transform: `translate(calc(-50% + ${pupil.x}px), calc(-50% + ${pupil.y}px))`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <div className={`absolute rounded-full bg-slate-900 ${highlightClass}`} />
      </div>
    </div>
  );
}

export default function InteractiveRobot({
  size = "lg",
  className = "",
}: {
  size?: Size;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);
  const [leftPupil, setLeftPupil] = useState({ x: 0, y: 0 });
  const [rightPupil, setRightPupil] = useState({ x: 0, y: 0 });
  const [headTilt, setHeadTilt] = useState(0);
  const [blink, setBlink] = useState(false);

  const calcPupilForEye = useCallback(
    (eyeEl: HTMLDivElement | null, clientX: number, clientY: number, maxOffset: number) => {
      if (!eyeEl) return { x: 0, y: 0 };
      const rect = eyeEl.getBoundingClientRect();
      const ecx = rect.left + rect.width / 2;
      const ecy = rect.top + rect.height / 2;
      const dx = clientX - ecx;
      const dy = clientY - ecy;
      const dist = Math.hypot(dx, dy) || 1;
      const clamp = Math.min(maxOffset, dist / 25);
      return {
        x: (dx / dist) * clamp,
        y: (dy / dist) * clamp,
      };
    },
    []
  );

  const track = useCallback(
    (clientX: number, clientY: number) => {
      if (!ref.current) return;
      const max = SIZES[size].maxPupil;
      setLeftPupil(calcPupilForEye(leftEyeRef.current, clientX, clientY, max));
      setRightPupil(calcPupilForEye(rightEyeRef.current, clientX, clientY, max));

      const headRect = ref.current.getBoundingClientRect();
      const hx = headRect.left + headRect.width / 2;
      const dx = clientX - hx;
      setHeadTilt(Math.max(-10, Math.min(10, (dx / window.innerWidth) * 18)));
    },
    [size, calcPupilForEye]
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => track(e.clientX, e.clientY);
    const onClick = (e: MouseEvent) => track(e.clientX, e.clientY);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
    };
  }, [track]);

  useEffect(() => {
    const id = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 120);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const s = SIZES[size];
  const isLarge = size === "lg";
  const isSmall = size === "sm";

  if (isSmall) {
    return (
      <div
        ref={ref}
        className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 ${s.box} ${className}`}
        aria-hidden
      >
        <div className="relative flex justify-center gap-1.5 pt-0.5">
          <EyePupil
            eyeRef={leftEyeRef}
            pupil={leftPupil}
            blink={blink}
            socketClass="h-3 w-3"
            pupilClass="h-2 w-2"
            highlightClass="right-0 top-0 h-0.5 w-0.5"
          />
          <EyePupil
            eyeRef={rightEyeRef}
            pupil={rightPupil}
            blink={blink}
            socketClass="h-3 w-3"
            pupilClass="h-2 w-2"
            highlightClass="right-0 top-0 h-0.5 w-0.5"
          />
        </div>
      </div>
    );
  }

  const socketLg = isLarge ? "h-14 w-14" : "h-5 w-5";
  const pupilLg = isLarge ? "h-8 w-8" : "h-3 w-3";
  const hiLg = isLarge ? "right-1.5 top-1.5 h-2.5 w-2.5" : "right-0 top-0 h-0.5 w-0.5";

  return (
    <div
      ref={ref}
      className={`relative flex items-center justify-center ${s.box} ${className}`}
      aria-hidden
    >
      <div
        className={`relative flex flex-col items-center ${isLarge ? "w-full max-w-sm" : "w-full h-full"}`}
        style={{ transform: `rotate(${headTilt}deg)`, transition: "transform 0.15s ease-out" }}
      >
        <div className={`flex flex-col items-center ${isLarge ? "mb-1" : ""}`}>
          <div className={`rounded-full bg-amber-400 ${isLarge ? "h-3 w-3" : "h-2 w-2"}`} style={{ boxShadow: "0 0 12px #fbbf24" }} />
          <div className={`bg-slate-400 ${isLarge ? "h-6 w-1" : "h-3 w-0.5"}`} />
        </div>

        <div
          className={`relative rounded-2xl bg-gradient-to-b from-slate-300 to-slate-400 shadow-xl ${
            isLarge ? "h-44 w-52 rounded-3xl border-4 border-slate-500" : "h-14 w-14 rounded-xl border-2 border-slate-500"
          }`}
        >
          <div
            className={`absolute inset-x-2 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 ${
              isLarge ? "top-4 bottom-6" : "top-1 bottom-1 inset-x-0.5"
            }`}
          >
            <div
              className={`absolute flex justify-center gap-6 ${isLarge ? "top-10" : "top-[20%]"} left-0 right-0`}
            >
              <EyePupil
                eyeRef={leftEyeRef}
                pupil={leftPupil}
                blink={blink}
                socketClass={socketLg}
                pupilClass={pupilLg}
                highlightClass={hiLg}
              />
              <EyePupil
                eyeRef={rightEyeRef}
                pupil={rightPupil}
                blink={blink}
                socketClass={socketLg}
                pupilClass={pupilLg}
                highlightClass={hiLg}
              />
            </div>
            <div
              className={`absolute left-1/2 -translate-x-1/2 rounded-b-full border-b-4 border-cyan-400 ${
                isLarge ? "bottom-8 h-6 w-16" : "bottom-1 h-1 w-4 border-b-2"
              }`}
            />
          </div>
        </div>

        {isLarge && (
          <>
            <div className="-mt-2 h-4 w-32 rounded-b-lg bg-gradient-to-r from-campus-600 to-accent" />
            <div className="mt-2 flex gap-8">
              <div className="h-16 w-5 rounded-full bg-gradient-to-b from-slate-400 to-slate-500" />
              <div className="h-20 w-28 rounded-2xl bg-gradient-to-br from-campus-500 to-accent shadow-lg" />
              <div className="h-16 w-5 rounded-full bg-gradient-to-b from-slate-400 to-slate-500" />
            </div>
            <p className="mt-4 text-center text-xs text-slate-400">Click anywhere — both eyes follow you</p>
          </>
        )}
      </div>

      {isLarge && <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-accent/20 blur-3xl" />}
    </div>
  );
}
