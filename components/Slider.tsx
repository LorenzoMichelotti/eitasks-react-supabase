import { scale } from "@/services/Utils";
import {
  motion,
  useDragControls,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
} from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

export default function Slider({
  value = 0,
  setValue,
  autoHideInput = true,
  callback,
  size = "md",
  isLocked = false,
}: {
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
  autoHideInput?: boolean;
  callback?: () => any;
  size?: string;
  isLocked?: boolean;
}) {
  const x = useMotionValue(0);
  const animX = useSpring(x, { damping: 10, bounce: 0.05 });
  const progressBarRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const [dragging, setDragging] = useState(false);

  function startDrag(event: any) {
    event.preventDefault();
    if (isLocked) return;
    setDragging(true);
    dragControls.start(event, { snapToCursor: true });
    updateDisplay(x.get());
    event.stopPropagation();
  }

  function updateDisplay(value: number) {
    if (progressBarRef.current?.offsetWidth == undefined) return;
    let newValue = scale(
      value,
      16,
      progressBarRef.current?.offsetWidth - 16,
      0,
      100
    );
    newValue = Math.ceil(Math.round(newValue) / 5) * 5;
    if (newValue >= 100) newValue = 100;
    if (newValue < 0) newValue = 0;
    setValue(newValue);
  }

  useMotionValueEvent(x, "change", (latest: any) => {
    if (!dragging) return;
    updateDisplay(latest);
  });

  useEffect(() => {
    window.addEventListener("mouseup", (event: any) => {
      setDragging(false);
    });
    window.addEventListener("touchend", (event: any) => {
      setDragging(false);
    });
    return () =>
      window.removeEventListener("mouseup", (event: any) => {
        setDragging(false);
      });
    window.removeEventListener("touchend", (event: any) => {
      setDragging(false);
    });
  }, []);

  useEffect(() => {
    if (dragging || progressBarRef.current?.offsetWidth == undefined) return;
    if (value < 100)
      x.set(scale(value, 0, 100, 0, progressBarRef.current?.offsetWidth - 16));
    else x.set(progressBarRef.current?.offsetWidth);
  }, [value]);

  return (
    <motion.button
      layout
      className={`flex items-center space-x-4 rounded-2xl ${
        size === "md" ? "p-2 md:p-4" : "p-1 md:p-2"
      } w-full`}
    >
      <motion.div
        layout
        ref={progressBarRef}
        className={`cursor-pointer relative bg-slate-200 dark:bg-black/50 w-full rounded-full ${
          size === "md" ? "h-4" : "h-2"
        } group`}
      >
        <motion.div
          draggable={false}
          onMouseDown={startDrag}
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
            className="h-full bg-white/50 rounded-full w-full "
          ></motion.div>
          <motion.div
            drag="x"
            _dragX={x}
            whileDrag={{ scale: 1.2 }}
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={progressBarRef}
            dragMomentum={false}
            dragElastic={0}
            style={{ x: animX }}
            className={`${
              autoHideInput &&
              "opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity"
            } bg-white cursor-pointer shadow-md border-2 dark:border-none absolute -left-4 ${
              size === "md" ? "w-8 h-8" : "w-4 h-4"
            } rounded-full`}
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
        className="text-[#ec4899] w-7/12 sm:w-5/12 md:4/12 text-center flex items-center space-x-2 font-semibold text-xl"
      >
        <input
          onChange={(e) => {
            let newValue = Number(e.target.value);
            if (newValue > 100) newValue = 100;
            if (newValue < 0) newValue = 0;
            if (isNaN(newValue)) return;
            setValue(Math.round(newValue));

            if (dragging) return;
            x.set(
              scale(
                Number(e.target.value),
                0,
                100,
                16,
                (progressBarRef.current?.offsetWidth || 0) - 16
              )
            );
          }}
          onKeyDown={(e) =>
            e.key === "Enter" && !e.shiftKey && callback && callback()
          }
          value={value.toString()}
          type={"text"}
          className={`bg-white border-2 dark:border-none dark:bg-black/50 w-full rounded-lg text-center ${
            size === "md"
              ? "text-lg p-0 sm:p-1 md:p-2"
              : "text-sm p-0 sm:p-0 md:p-1"
          }`}
        />
        <span className="hidden sm:flex pointer-events-none select-none">
          %
        </span>
      </motion.span>
    </motion.button>
  );
}
