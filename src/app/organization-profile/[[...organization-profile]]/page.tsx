"use client";
import {
  OrganizationList,
  OrganizationProfile,
  useOrganization,
} from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ManijeButton } from "@/components/ui/manije-button";

export default function OrganizationProfilePage() {
  const router = useRouter();
  const { organization } = useOrganization();

  return (
    <div className="flex flex-col justify-center h-full p-6">
      <ManijeButton
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="mb-4 w-auto px-2 self-start"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </ManijeButton>
      {organization && (
        <div className="flex flex-col items-center justify-center h-full p-6 w-full">
          <OrganizationProfile />
        </div>
      )}

      <div className="flex flex-col items-center justify-center h-full p-6">
        <h2 className="text-lg font-semibold mb-4">
          Select an organization to manage
        </h2>
        <OrganizationList />
      </div>
    </div>
  );
}
