"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import HeaderUserButton from "@/components/header-user-button";
import { SelectProjects } from "@/components/select-projects";

export default function AppHeader() {
  const pathname = usePathname();
  const showProjectSelector = pathname !== "/";

  return (
    <header className="flex justify-between items-center p-4 h-16 border-b gap-4">
      <Link
        href="/"
        className="text-xl font-semibold text-white hover:opacity-80 transition"
      >
        <Image
          src="/logo_light.png"
          alt="Manije logo"
          width={28}
          height={28}
          priority
          className="block dark:hidden"
        />
        <Image
          src="/logo_dark.png"
          alt="Manije logo"
          width={28}
          height={28}
          priority
          className="hidden dark:block"
        />
      </Link>
      {showProjectSelector && (
        <div className="flex flex-row items-start gap-4 flex-2">
          <SelectProjects />
        </div>
      )}
      <HeaderUserButton />
    </header>
  );
}
