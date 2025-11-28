import React from "react";
import HomeCards from "@/components/temp-components/home-cards";

const Page = () => {
  return (
    <section className="mt-5 w-full max-w-4xl mx-auto md:p-10 p-5">
      <h2 className="inline-block bg-gradient-to-r from-[#4E82EE] to-[#D96570] bg-clip-text md:text-5xl text-4xl text-transparent font-medium">
        Hello, Guest
      </h2>

      <h3 className="md:text-5xl text-4xl text-wrap text-accentGray/50">
        Sign in to get started
      </h3>

      <HomeCards />
    </section>
  );
};

export default Page;
