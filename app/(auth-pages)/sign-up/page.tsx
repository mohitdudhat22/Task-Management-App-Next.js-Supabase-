"use client";

import { signUpAction } from "@/app/actions";
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
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the schema using Zod
const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default function Signup(props: { searchParams: Promise<Message> }) {
  const [searchParams, setSearchParams] = React.useState<Message | null>(null);

  React.useEffect(() => {
    props.searchParams.then(setSearchParams);
  }, [props.searchParams]);

  const theme = useTheme();

  // Initialize the form with react-hook-form and zod
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = (data: any) => {
    // Handle form submission
    signUpAction(data);
  };

  return (
    <Card className="relative overflow-hidden">
      <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}  />
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>
          Create an account to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col min-w-64 max-w-64 mx-auto">
          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <Label htmlFor="email">Email</Label>
            <Input {...register("email")} placeholder="you@example.com" required />
            {errors.email && <span>{errors.email.message}</span>}
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              {...register("password")}
              placeholder="Your password"
              required
            />
            {errors.password && <span>{errors.password.message}</span>}
            <SubmitButton formAction={signUpAction} pendingText="Signing up...">
              Sign up
            </SubmitButton>
            {searchParams && <FormMessage message={searchParams} />}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-foreground">
          Already have an account?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
