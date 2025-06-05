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
import Link from "next/link";
import { Lock, Mail } from "lucide-react";
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 px-8"
        noValidate
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Mail className="h-4 w-4 text-gray-400" />
                Email address
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="you@example.com"
                  className="text-base"
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Lock className="h-4 w-4 text-gray-400" />
                Password
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="••••••••"
                  className="text-base"
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="remember"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(val) => field.onChange(!!val)}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal text-gray-600">
                  Remember me
                </FormLabel>
              </FormItem>
            )}
          />
          <Link
            href="/auth/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full mt-4 text-base font-semibold">
          Sign In
        </Button>
      </form>
    </Form>
  );
}
