"use client";
import {
  OrganizationList,
  OrganizationProfile,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useOrganization,
  UserButton,
} from "@clerk/nextjs";
import React, { useState } from "react";
import { Building2Icon } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export default function HeaderUserButton() {
  const [openOrgSwitcher, setOrgSwitcher] = useState(false);
  const [openOrgProfile, setOrgProfile] = useState(false);
  const { organization } = useOrganization();

  return (
    <div className="flex items-center gap-4">
      <SignedOut>
        <SignInButton />
        <SignUpButton />
      </SignedOut>
      <SignedIn>
        <UserButton>
          <UserButton.MenuItems>
            {organization && (
              <UserButton.Action
                label="Organization Profile"
                labelIcon={<Building2Icon className="h-4 w-4" />}
                onClick={() => setOrgProfile(true)}
              />
            )}
            <UserButton.Action
              label="Switch Organization"
              labelIcon={<Building2Icon className="h-4 w-4" />}
              onClick={() => setOrgSwitcher(true)}
            />
          </UserButton.MenuItems>
        </UserButton>
      </SignedIn>
      <Dialog open={openOrgSwitcher} onOpenChange={setOrgSwitcher}>
        <DialogContent className="bg-transparent w-fit p-0 m-0 border-none">
          <DialogTitle className="sr-only">Switch Organization</DialogTitle>
          <OrganizationList
            afterSelectOrganizationUrl="/home"
            afterSelectPersonalUrl="/home"
          />
        </DialogContent>
      </Dialog>
      <Dialog open={openOrgProfile} onOpenChange={setOrgProfile}>
        <DialogContent
          className="bg-transparent p-0 m-0 border-none items-center justify-center"
          style={{ maxWidth: "fit-content" }}
        >
          <DialogTitle className="sr-only">Organization Profile</DialogTitle>
          <div>
            <OrganizationProfile routing={"hash"} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
