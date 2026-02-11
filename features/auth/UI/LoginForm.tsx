"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth/auth-client";
import { LoadingIndicator } from "@/components/ui/loading-indicator";

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

export function LoginForm() {
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await signIn.email(
        {
          email: values.email,
          password: values.password,
          rememberMe: values.remember,
          callbackURL: "/",
        },
        {
          onSuccess: () => {
            router.push("/");
          },
          onError: (ctx) => {
            form.setError("email", {
              type: "server",
              message: ctx.error.message,
            });
          },
        }
      );
    } catch {
      form.setError("email", {
        type: "network",
        message: "Network error. Please try again.",
      });
    }
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0, duration: 0.3 }}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-text-muted uppercase tracking-wider">Email</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted group-focus-within:text-primary transition-colors" />
                    <Input
                      {...field}
                      placeholder="name@company.com"
                      className="pl-10 h-10"
                    />
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
          transition={{ delay: 0.1, duration: 0.3 }}
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
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter password"
                      className="pl-10 h-10"
                    />
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
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <FormField
            control={form.control}
            name="remember"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-y-0 py-1">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(val) => field.onChange(!!val)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </FormControl>
                <FormLabel className="text-sm font-medium text-text-muted cursor-pointer">
                  Remember me for 30 days
                </FormLabel>
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10 shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingIndicator label="Signing in..." />
            ) : (
              "Sign In"
            )}
          </Button>
        </motion.div>
      </form>
    </Form>
  );
}
