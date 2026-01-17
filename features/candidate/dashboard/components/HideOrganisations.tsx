"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { Check, Eye, EyeOff, ShieldAlert, Plus, Building2 } from "lucide-react";
import type { PartnerOrganisationDTO } from "@/features/organisation/partner-organisations-dto";

interface HideOrganisationsProps {
  partnerOrgs: PartnerOrganisationDTO[];
  hiddenOrgs: string[];
  onToggle: (orgId: string) => void;
  onSave: () => void;
}

export function HideOrganisations({
  partnerOrgs,
  hiddenOrgs,
  onToggle,
  onSave,
}: HideOrganisationsProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");

  const filteredOrgs = partnerOrgs.filter((o) =>
    o.name.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <>
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-4 px-6 flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-slate-500" />
              Privacy & Visibility
            </CardTitle>
            <CardDescription className="text-xs">
              Control which companies cannot see your profile.
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setOpen(true)}
            className="bg-white hover:bg-slate-50"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Manage Blocklist
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            {hiddenOrgs.length > 0 ? (
              hiddenOrgs.map((id) => {
                const org = partnerOrgs.find((o) => o.id === id);
                return (
                  org && (
                    <Badge
                      key={id}
                      variant="secondary"
                      className="pl-2 pr-3 py-1.5 gap-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-100"
                    >
                      <ShieldAlert className="w-3 h-3" />
                      {org.name}
                    </Badge>
                  )
                );
              })
            ) : (
              <div className="w-full flex items-center justify-center py-6 px-4 border-2 border-dashed border-slate-100 rounded-lg bg-slate-50/30">
                <div className="flex items-center gap-3 text-slate-500">
                  <Eye className="w-5 h-5 opacity-50" />
                  <span className="text-sm font-medium">
                    Your profile is visible to all partner organisations.
                  </span>
                </div>
              </div>
            )}
          </div>

          {hiddenOrgs.length > 0 && (
            <p className="mt-4 text-xs text-slate-400">
              * These companies will not see your name, resume, or interview
              history in search results.
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 max-w-md overflow-hidden gap-0">
          <div className="p-6 pb-2">
            <h2 className="text-lg font-bold">Block Organisations</h2>
            <p className="text-sm text-slate-500 mt-1">
              Search for your current employer or any company you want to hide
              from.
            </p>
          </div>

          <div className="px-2">
            <Command className="rounded-lg border shadow-none">
              <CommandInput
                placeholder="Search companies (e.g. Airbnb, Stripe)..."
                value={filter}
                onValueChange={setFilter}
                className="border-none focus:ring-0"
              />
              <CommandList className="max-h-[300px] overflow-auto p-1">
                <CommandEmpty className="py-6 text-center text-sm text-slate-500">
                  No companies found.
                </CommandEmpty>
                <CommandGroup>
                  {filteredOrgs.map((org) => {
                    const selected = hiddenOrgs.includes(org.id);
                    return (
                      <CommandItem
                        key={org.id}
                        onSelect={() => onToggle(org.id)}
                        className={`flex items-center px-4 py-2.5 rounded-md cursor-pointer mb-1 ${selected ? "bg-red-50 aria-selected:bg-red-100" : ""}`}
                      >
                        <Building2 className="mr-3 h-4 w-4 text-slate-400" />
                        <span
                          className={`flex-1 ${selected ? "text-red-900 font-medium" : "text-slate-700"}`}
                        >
                          {org.name}
                        </span>
                        {selected && <Check className="h-4 w-4 text-red-600" />}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 mt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onSave();
                setOpen(false);
              }}
              className="bg-slate-900 hover:bg-slate-800"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
