import DevPopover from "../dev-components/dev-popover";
import DevButton from "../dev-components/dev-button";
import { MdArrowOutward } from "react-icons/md";
import { IoDiamond } from "react-icons/io5"; 

export default function CustomGeminiKey() {
  return (
    <DevPopover
      contentClick={false}
      popButton={
        <DevButton variant="v1" className="gap-2 text-sm md:!flex !hidden">
          <IoDiamond className="text-lg text-purple-400" />
          Try Dahdouh AI Advanced
        </DevButton>
      }
    >
      <div className="w-60 h-fit p-3 space-y-3">
        <h3 className="text-sm font-semibold">Dahdouh AI Advanced</h3>

        <p className="text-xs opacity-70 leading-relaxed">
          Enjoy faster responses, higher limits, priority access  
          and premium AI features with Dahdouh AI Advanced.
        </p>

        <a
          className="text-sm opacity-80 hover:underline hover:text-accentBlue flex items-center gap-1"
          href="/pricing"
        >
          Learn More 
          <MdArrowOutward className="inline text-lg" />
        </a>
      </div>
    </DevPopover>
  );
}