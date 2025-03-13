"use client";

import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShineBorder } from "@/components/magicui/shine-border";
import { useTheme } from "next-themes";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Define the schema using Zod
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default function Login({ 
  searchParams 
}: { 
  searchParams: { redirect?: string; message?: string } 
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  
  // Use state to store the redirect path
  const [redirectPath, setRedirectPath] = React.useState('/projects');
  
  // Set the redirect path from searchParams on mount
  useEffect(() => {
    if (searchParams?.redirect) {
      setRedirectPath(searchParams.redirect);
    }
    console.log("Redirect path from params:", searchParams?.redirect);
    console.log("Final redirect path:", redirectPath);
  }, [searchParams]);

  const theme = useTheme();

  // Initialize the form with react-hook-form and zod
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsLoading(true);
    try {
      console.log("Starting sign in with redirect to:", redirectPath);
      
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('redirectTo', redirectPath);
      
      const result = await signInAction(formData);
      console.log("Sign in result:", result);
      
      if (result.success) {
        toast.success(result.message);
        console.log("Redirecting to:", result.redirect || redirectPath);
        
        // Force a hard navigation instead of client-side routing
        window.location.href = result.redirect || redirectPath;
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Sign in failed');
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col min-w-64">
          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <Label htmlFor="email">Email</Label>
            <Input {...register("email")} placeholder="you@example.com" required />
            {errors.email && <span>{errors.email.message}</span>}
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                className="text-xs text-foreground underline"
                href="/forgot-password"
              >
                Forgot Password?
              </Link>
            </div>
            <Input
              type="password"
              {...register("password")}
              placeholder="Your password"
              required
            />
            {errors.password && <span>{errors.password.message}</span>}
            <SubmitButton
              pendingText="Signing in..."
              disabled={isLoading}
              className="mt-2"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </SubmitButton>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-foreground">
          Don't have an account?{" "}
          <Link className="text-foreground font-medium underline" href="/sign-up">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
