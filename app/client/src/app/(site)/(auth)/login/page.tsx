"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().trim(),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const [inputType, setInputType] = useState<"text" | "password">("text");

  const form = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });
  return (
    <main className="flex justify-center px-10">
      <Form {...form}>
        <form className="my-10 rounded-[20px] border border-neutral-300 bg-white px-16 py-10 space-y-8 lg:max-w-[576px] h-full">
          <h2 className="text-3xl font-semibold text-center capitalize">
            Login
          </h2>
          <div className="space-y-3">
            <p className="font-medium text-2xl text-center">
              Welcome back to ECOMMERCE
            </p>
            <p className="text-center text-base">
              The next gen business marketplace
            </p>
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter" />
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
                  <div className="relative flex items-center">
                    <Input {...field} type={inputType} placeholder="Enter" />
                    <button
                      type="button"
                      aria-label={
                        inputType === "text" ? "Hide secret" : "Show secret"
                      }
                      className="absolute right-3 z-10 hover:underline hover:text-neutral-500"
                      onClick={() =>
                        inputType === "text"
                          ? setInputType("password")
                          : setInputType("text")
                      }
                    >
                      {inputType === "password" ? "Show" : "Hide"}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="uppercase font-medium text-center w-full tracking-wider"
            type="submit"
          >
            login
          </Button>
          <Separator />
          <div className="flex items-center justify-center space-x-2">
            <p className="text-neutral-500 text-base">
              Don&apos;t Have an Account?
            </p>
            <Link
              className="uppercase font-medium text-center tracking-wider hover:underline"
              href="/signup"
            >
              sign up
            </Link>
          </div>
        </form>
      </Form>
    </main>
  );
}
