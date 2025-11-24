"use client";

import DevButton from "@/components/dev-components/dev-button";
import Image from "next/image";
import { GoSignOut } from "react-icons/go";
import { IoApps } from "react-icons/io5";
import { signIn, signOut } from "next-auth/react";
import DevPopover from "../dev-components/dev-popover";
import ReactTooltip from "../dev-components/react-tooltip";
import PortfolioProjects from "./portfolio-projects";
import CustomGeminiKey from "./custom-geminikey";

export default function SignInNow({ userData }: any) {

  return (
    <div className="flex items-center gap-2">
      <CustomGeminiKey />

      <DevPopover
        place="bottom-start"
        contentClick={false}
        popButton={
          <ReactTooltip tipData={"Projects"}>
            <DevButton rounded="full" variant="v3" asIcon className="text-sm md:!block !hidden">
              <IoApps className="text-3xl p-[6px]" />
            </DevButton>
          </ReactTooltip>
        }
      >
        <PortfolioProjects />
      </DevPopover>

      <div>
        {userData ? (
          <DevPopover
            contentClick={false}
            place="bottom-start"
            popButton={
              <Image
                src={userData.image}
                alt="img"
                width={35}
                height={35}
                className="rounded-full cursor-pointer"
              />
            }
          >
            <button
              onClick={() => signOut()}
              className="py-2 w-48 flex items-center gap-2 px-3"
            >
              <GoSignOut className="text-lg" />
              Sign Out
            </button>
          </DevPopover>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="text-sm bg-accentBlue/50 px-4 py-2 rounded"
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}