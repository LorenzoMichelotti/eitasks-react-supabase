import {
  motion,
  useDragControls,
  useForceUpdate,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

export default function Progress({ value }: { value: number }) {
  const x = useMotionValue(0);
  const animX = useSpring(x, { damping: 10, bounce: 0.05 });
  const progressBarRef = useRef<HTMLDivElement>(null);

  function scale(
    number: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
  ) {
    return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  useEffect(() => {
    if (!progressBarRef.current) return;
    x.set(scale(Number(value), 0, 100, 0, progressBarRef.current?.offsetWidth));
  }, [value, progressBarRef]);

  return (
    <motion.div
      layout
      className="flex items-center space-x-4 rounded-2xl py-2 w-full"
    >
      <motion.div
        layout
        ref={progressBarRef}
        className="relative bg-black/50 w-10/12 rounded-full h-4"
      >
        <motion.div
          draggable={false}
          className="absolute left-0 top-0 w-full h-full flex items-center"
        >
          <motion.div
            style={{
              width: animX,
              backgroundColor:
                value > 75
                  ? "#34d399"
                  : value > 50
                  ? "#0ea5e9"
                  : value > 35
                  ? "#facc15"
                  : "#ec4899",
            }}
            className="h-full bg-[#ec4899] transition-colors rounded-full w-full "
          ></motion.div>
        </motion.div>
      </motion.div>
      <motion.span
        style={{
          color:
            value > 75
              ? "#34d399"
              : value > 50
              ? "#0ea5e9"
              : value > 35
              ? "#facc15"
              : "#ec4899",
        }}
        className="text-[#ec4899] text-center flex items-center space-x-2 font-semibold text-xl"
      >
        <span className="rounded-lg text-center whitespace-nowrap">
          {value} %
        </span>
      </motion.span>
    </motion.div>
  );
}
