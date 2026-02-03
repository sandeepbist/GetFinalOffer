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
import { Lock, Mail, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth/auth-client";

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
                <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      {...field}
                      placeholder="name@company.com"
                      className="pl-10 h-10 bg-slate-50/50 border-slate-200 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
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
                <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 h-10 bg-slate-50/50 border-slate-200 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
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
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                </FormControl>
                <FormLabel className="text-sm font-medium text-slate-600 cursor-pointer">
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-10 shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:shadow-blue-500/30"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </motion.div>
      </form>
    </Form>
  );
}