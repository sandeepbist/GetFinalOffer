"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface BasicInfoProps {
  formData: {
    fullName: string;
    email: string;
    password: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BasicInfoStep: React.FC<BasicInfoProps> = ({
  formData,
  onChange,
}) => (
  <div className="space-y-6">
    <div className="space-y-1">
      <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
        Full Name
      </Label>
      <Input
        id="fullName"
        name="fullName"
        placeholder="Enter your full name"
        value={formData.fullName}
        onChange={onChange}
        className="text-sm"
        required
      />
    </div>

    <div className="space-y-1">
      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
        Email Address
      </Label>
      <Input
        id="email"
        name="email"
        type="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={onChange}
        className="text-sm"
        required
      />
    </div>

    <div className="md:col-span-2 space-y-1">
      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
        Password
      </Label>
      <Input
        id="password"
        name="password"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={onChange}
        className="text-sm"
        required
      />
    </div>
  </div>
);
