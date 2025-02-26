import React from "react";
import Link from "next/link";
import HeaderNavTabs from "./HeaderNavTabs";
import { Button } from "~/components/ui/button";
import { HeaderTopBar } from "./HeaderTopBar";

const MainHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <HeaderTopBar />
      <div className="hidden w-full md:flex">
        <HeaderNavTabs />
      </div>
    </header>
  );
};

export default MainHeader;
