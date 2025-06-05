"use client";

import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

const COMPANY_SIZES = [
  "1–10",
  "11–50",
  "51–200",
  "201–500",
  "501–1000",
  "1001+",
];

export function RecruiterCompanyStep() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="companyName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Acme Corp" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="companyWebsite"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Website (example.com)</FormLabel>
            <FormControl>
              <Input {...field} type="url" placeholder="acme.com" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="companySize"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Size</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size…" />
                </SelectTrigger>
                <SelectContent>
                  {COMPANY_SIZES.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="companyDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Company Description{" "}
              <span className="text-sm text-gray-400">(optional)</span>
            </FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="A brief summary of what your company does."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
