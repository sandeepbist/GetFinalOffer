"use client";

import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "sonner";
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
import type { PartnerOrganisationDTO } from "@/features/organisation/partner-organisations-dto";
import { User, Building2, Mail, Lock } from "lucide-react";
import { LoadingIndicator } from "@/components/ui/loading-indicator";

interface RecruiterFormValues {
  fullName: string;
  organisationId: string;
  email: string;
  password: string;
}

export default function RecruiterSignupWizard() {
  const form = useForm<RecruiterFormValues>({
    defaultValues: {
      fullName: "",
      organisationId: "",
      email: "",
      password: "",
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

  const [organisations, setOrganisations] = React.useState<PartnerOrganisationDTO[]>([]);
  const [organisationsLoading, setOrganisationsLoading] = React.useState(true);

  useEffect(() => {
    getAllPartnerOrganisations()
      .then(setOrganisations)
      .catch(() => toast.error("Failed to load organisations"))
      .finally(() => setOrganisationsLoading(false));
  }, []);

  const onSubmit = async (values: RecruiterFormValues) => {
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
        message: `Must use @${org.domain} email`,
      });
      return;
    }

    type SignUpParams = Parameters<typeof signUp.email>[0];

    const { data, error } = await signUp.email({
      name: values.fullName,
      email: values.email,
      password: values.password,
      role: "recruiter",
      callbackURL: "/dashboard",
    } as SignUpParams & { role: "recruiter" });

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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0, duration: 0.3 }}
        >
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-text-muted uppercase tracking-wider">Full Name</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted group-focus-within:text-primary transition-colors" />
                    <Input {...field} placeholder="Jane Smith" className="pl-10 h-10" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.3 }}
        >
          <FormField
            control={form.control}
            name="organisationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-text-muted uppercase tracking-wider">Organisation</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted z-10 pointer-events-none" />
                    <Select
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                        trigger("email");
                      }}
                      disabled={organisationsLoading}
                    >
                      <SelectTrigger className="pl-10 h-10">
                        <SelectValue
                          placeholder={organisationsLoading ? "Loading organisations..." : "Select your company"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {organisations.map((org) => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.3 }}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-text-muted uppercase tracking-wider">Work Email</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted group-focus-within:text-primary transition-colors" />
                    <Input {...field} type="email" placeholder="you@company.com" className="pl-10 h-10" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24, duration: 0.3 }}
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-text-muted uppercase tracking-wider">Password</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted group-focus-within:text-primary transition-colors" />
                    <Input {...field} type="password" placeholder="Min. 6 characters" className="pl-10 h-10" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.3 }}
          className="pt-2"
        >
          <Button
            type="submit"
            disabled={isSubmitting || organisationsLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10 shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
          >
            {isSubmitting || organisationsLoading ? (
              <LoadingIndicator
                label={organisationsLoading ? "Preparing form..." : "Creating account..."}
              />
            ) : (
              "Sign Up"
            )}
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="text-xs text-center text-text-muted"
        >
          By clicking continue, you agree to our Terms of Service and Privacy Policy.
        </motion.p>
      </form>
    </FormProvider>
  );
}
