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

export default function Slider({
  value,
  setValue,
}: {
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
}) {
  const x = useMotionValue(0);
  const animX = useSpring(x, { damping: 10, bounce: 0.05 });
  const progressBarRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  // const [value, setValue] = useState(0);
  const [dragging, setDragging] = useState(false);

  const color = useTransform(
    x,
    [
      16,
      (progressBarRef.current?.offsetWidth - 16) * 0.45,
      (progressBarRef.current?.offsetWidth - 16) * 0.75,
      progressBarRef.current?.offsetWidth - 16,
    ],
    ["#ec4899", "#facc15", "#0ea5e9", "#34d399"]
  );

  function scale(
    number: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
  ) {
    return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  function startDrag(event: any) {
    event.preventDefault();
    setDragging(true);
    dragControls.start(event, { snapToCursor: true });
    event.stopPropagation();
  }

  useMotionValueEvent(x, "change", (latest: any) => {
    let newValue = scale(
      latest,
      16,
      progressBarRef.current?.offsetWidth - 16,
      0,
      100
    );
    if (dragging) {
      if (newValue >= 1) {
        newValue = Math.ceil(newValue / 5) * 5;
      } else newValue = 0;
    }
    if (newValue > 100) newValue = 100;
    if (newValue < 0) newValue = 0;
    setValue(newValue);
  });

  useEffect(() => {
    window.addEventListener("mouseup", (event: any) => {
      setDragging(false);
    });
    return () =>
      window.removeEventListener("mouseup", (event: any) => {
        setDragging(false);
      });
  }, []);

  useEffect(() => {
    x.set(
      scale(Number(value), 0, 100, 16, progressBarRef.current?.offsetWidth - 16)
    );
  }, [value]);

  return (
    <motion.div
      layout
      className="flex items-center space-x-4 rounded-2xl p-4 w-full"
    >
      <motion.div
        layout
        ref={progressBarRef}
        className="cursor-pointer relative bg-black/50 w-full rounded-full h-4"
      >
        <motion.div
          draggable={false}
          onMouseDown={startDrag}
          className="absolute left-0 top-0 w-full h-full flex items-center"
        >
          <motion.div
            style={{ width: animX, backgroundColor: color }}
            className="h-full bg-white/50 rounded-full w-full "
          ></motion.div>
          <motion.div
            drag="x"
            _dragX={x}
            whileDrag={{ scale: 1.2 }}
            dragControls={dragControls}
            dragConstraints={progressBarRef}
            dragMomentum={false}
            dragElastic={0}
            style={{ x: animX }}
            className="bg-white cursor-pointer shadow-2xl absolute -left-4 w-8 h-8 rounded-full"
          ></motion.div>
        </motion.div>
      </motion.div>
      <motion.span
        style={{ color }}
        className="text-[#ec4899] w-7/12 sm:w-5/12 md:4/12 text-center flex items-center space-x-2 font-semibold text-xl"
      >
        <input
          onChange={(e) => {
            x.set(
              scale(
                Number(e.target.value),
                0,
                100,
                16,
                progressBarRef.current?.offsetWidth - 16
              )
            );
          }}
          value={Math.round(value)}
          type={"number"}
          className=" bg-black/50 w-full rounded-lg p-0 sm:p-1 md:p-2 text-center"
        />
        <span className="hidden sm:flex pointer-events-none select-none">
          %
        </span>
      </motion.span>
    </motion.div>
  );
}
