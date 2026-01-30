"use client";

import React from "react";
import { useForm } from "react-hook-form";
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
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input {...field} placeholder="name@company.com" className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-all" />
                </div>
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
              <div className="flex items-center justify-between">
                <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</FormLabel>
              </div>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input {...field} type="password" placeholder="••••••••" className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-all" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="remember"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2 space-y-0 py-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(val) => field.onChange(!!val)}
                />
              </FormControl>
              <FormLabel className="text-sm font-medium text-slate-600 cursor-pointer">
                Remember me for 30 days
              </FormLabel>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-10 shadow-lg shadow-blue-500/20"
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
      </form>
    </Form>
  );
}