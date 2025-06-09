"use client";

import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { getAllPartnerOrganisations } from "@/features/organisation/partner-organisations-use-cases";
import { registerRecruiter } from "@/features/recruiter/recruiter-use-cases";
import { signUp } from "@/lib/auth/auth-client";
import { PartnerOrganisationDTO } from "@/features/organisation/partner-organisations-dto";

interface RecruiterFormValues {
  fullName: string;
  organisationId: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RecruiterSignupWizard() {
  const form = useForm<RecruiterFormValues>({
    defaultValues: {
      fullName: "",
      organisationId: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const {
    handleSubmit,
    trigger,
    setError,
    formState: { isSubmitting },
  } = form;

  const router = useRouter();

  const [organisations, setOrganisations] = React.useState<
    PartnerOrganisationDTO[]
  >([]);
  useEffect(() => {
    getAllPartnerOrganisations()
      .then(setOrganisations)
      .catch(() => toast.error("Failed to load organisations"));
  }, []);

  const onSubmit = async (values: RecruiterFormValues) => {
    if (values.password !== values.confirmPassword) {
      setError("confirmPassword", {
        type: "validate",
        message: "Passwords must match",
      });
      return;
    }

    const org = organisations.find((o) => o.id === values.organisationId);
    if (!org) {
      setError("organisationId", {
        type: "required",
        message: "Please select your organisation",
      });
      return;
    }

    const emailDomain = values.email.split("@")[1]?.toLowerCase();
    if (emailDomain !== org.domain.toLowerCase()) {
      setError("email", {
        type: "validate",
        message: `Invalid domain`,
      });
      return;
    }

    const { data, error } = await signUp.email({
      name: values.fullName,
      email: values.email,
      password: values.password,
      role: "recruiter",
      callbackURL: "/dashboard",
    });
    if (error || !data?.user) {
      toast.error(error?.message || "Signup failed");
      return;
    }

    const { success, error: regErr } = await registerRecruiter({
      userId: data.user.id,
      organisationId: values.organisationId,
    });
    if (!success) {
      toast.error(regErr || "Failed to save recruiter profile");
      return;
    }

    toast.success("Check your email to complete signup");
    router.push("/dashboard");
  };

  return (
    <FormProvider {...form}>
      <Card className="w-full border-0 max-w-lg mx-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6 p-8">
            <h2 className="text-2xl font-bold">Join as a Recruiter</h2>

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Jane Smith" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="organisationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organisation</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                        trigger("email");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Search or select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {organisations.map((org) => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.name}
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
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="you@your-company.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="••••••••" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="••••••••" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex justify-end p-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className={isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
            >
              {isSubmitting ? "Signing Up…" : "Sign Up"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </FormProvider>
  );
}
