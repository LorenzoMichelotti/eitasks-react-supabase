import * as Slider from "@radix-ui/react-slider";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface SliderProps {
  thumbAlwaysVisible: boolean;
  value: number[];
  setValue: Dispatch<SetStateAction<number>>;
  callback?: () => any;
  locked?: boolean;
}

export default function Slider2({
  thumbAlwaysVisible = false,
  value = [0],
  setValue,
  callback,
  locked,
}: SliderProps) {
  const [displayValue, setDisplayValue] = useState([0]);

  function handleOnValueChange(e: number[]) {
    setDisplayValue(e);
  }

  function handleOnValueCommit(e: number[]) {
    setValue && setValue(e[0]);
  }

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  return (
    <form className="group h-full w-full flex items-center">
      <Slider.Root
        disabled={locked}
        className={`relative items-center select-none touch-none flex h-full w-10/12 mr-4 ${
          locked ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        defaultValue={[0]}
        onValueChange={handleOnValueChange}
        onValueCommit={handleOnValueCommit}
        value={displayValue}
        max={100}
        step={5}
        aria-label="Volume"
      >
        <Slider.Track className="relative flex-grow bg-black/50 h-4 w-full rounded-full">
          <Slider.Range
            className={`absolute rounded-full h-full ${
              displayValue[0] > 85
                ? "bg-[#34d399]"
                : displayValue[0] > 60
                ? "bg-[#0ea5e9]"
                : displayValue[0] > 25
                ? "bg-[#facc15]"
                : "bg-[#ec4899]"
            } 
            transition-colors`}
          />
        </Slider.Track>
        <Slider.Thumb
          className={`bg-white transition-opacity block w-8 h-8 rounded-full outline-none focus:scale-110 ${
            locked
              ? "opacity-0"
              : !thumbAlwaysVisible && "opacity-0 group-hover:opacity-100"
          }`}
        />
      </Slider.Root>
      <span
        className={`
          text-[#ec4899] w-3/12 text-center flex items-center space-x-2 font-semibold text-xl
          ${
            displayValue[0] > 85
              ? "text-[#34d399]"
              : displayValue[0] > 60
              ? "text-[#0ea5e9]"
              : displayValue[0] > 25
              ? "text-[#facc15]"
              : "text-[#ec4899]"
          }
        `}
      >
        <input
          onChange={(e) => {
            let newValue = Number(e.target.value);
            if (newValue > 100) newValue = 100;
            if (newValue < 0) newValue = 0;
            if (isNaN(newValue)) return;
            setValue(Math.round(newValue));
          }}
          onKeyDown={(e) =>
            e.key === "Enter" && !e.shiftKey && callback && callback()
          }
          value={displayValue.toString()}
          type={"text"}
          className={`bg-white border-2 dark:border-none dark:bg-black/50 w-full rounded-lg text-center text-lg p-0 sm:p-1 md:p-2`}
        />
        <span className="hidden sm:flex pointer-events-none select-none">
          %
        </span>
      </span>
    </form>
  );
}
