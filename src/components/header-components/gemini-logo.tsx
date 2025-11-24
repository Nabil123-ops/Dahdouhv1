import { FaCaretDown, FaRegCheckCircle } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5"; // Dahdouh AI icon
import DevButton from "../dev-components/dev-button";
import DevPopover from "../dev-components/dev-popover";

const DahdouhAILogo = () => {
  return (
    <DevPopover
      popButton={
        <DevButton size="sm" rounded="sm" className="text-lg gap-2">
          Dahdouh AI
          <FaCaretDown />
        </DevButton>
      }
    >
      <div className="py-2">
        {/* Active Model */}
        <DevButton
          variant="v3"
          className="w-full !justify-between gap-3 group"
          rounded="none"
        >
          <span className="flex items-center gap-2">
            <IoSparkles className="text-lg text-purple-400" />
            Dahdouh AI (Default)
          </span>
          <FaRegCheckCircle className="text-xl text-purple-500" />
        </DevButton>

        {/* Info / Premium — optional */}
        <DevButton
          ripple={false}
          className="cursor-auto w-full !justify-start gap-3 group"
          rounded="none"
        >
          <span className="flex items-center gap-2 opacity-50">
            <IoSparkles className="text-lg text-blue-400" />
            Coming soon: Dahdouh AI Plus 🚀
          </span>
        </DevButton>
      </div>
    </DevPopover>
  );
};

export default DahdouhAILogo;