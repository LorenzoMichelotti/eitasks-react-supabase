import * as Slider from "@radix-ui/react-slider";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface SliderProps {
  thumbAlwaysVisible: boolean;
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
  callback?: () => any;
  locked?: boolean;
}

export default function Slider2({
  thumbAlwaysVisible = false,
  value = 0,
  callback,
  locked,
}: SliderProps) {
  return (
    <form className="group h-full w-full flex items-center pointer-events-none">
      <Slider.Root
        disabled={true}
        className={`relative items-center select-none touch-none flex h-full w-10/12 mr-4`}
        defaultValue={[0]}
        value={[value]}
        max={100}
        step={5}
        aria-label="Volume"
      >
        <Slider.Track className="relative overflow-clip flex-grow bg-black/50 h-6 w-full rounded-full">
          <Slider.Range
            className={`absolute rounded-full h-full ${
              value > 85
                ? "bg-[#34d399]"
                : value > 60
                ? "bg-[#0ea5e9]"
                : value > 25
                ? "bg-[#facc15]"
                : "bg-[#ec4899]"
            } 
            transition-colors`}
          />
        </Slider.Track>
        {/* <Slider.Thumb
          className={`bg-white transition-opacity block w-8 h-8 rounded-full outline-none focus:scale-110 ${
            locked
              ? "opacity-0"
              : !thumbAlwaysVisible && "opacity-0 group-hover:opacity-100"
          }`}
        /> */}
      </Slider.Root>
      <span
        className={`
          text-[#ec4899] w-3/12 h-6 justify-center text-center bg-brand-darkest rounded-full flex items-center space-x-2 font-semibold text-xl
          ${
            value > 85
              ? "text-[#34d399]"
              : value > 60
              ? "text-[#0ea5e9]"
              : value > 25
              ? "text-[#facc15]"
              : "text-[#ec4899]"
          }
        `}
      >
        {value} %
      </span>
    </form>
  );
}
