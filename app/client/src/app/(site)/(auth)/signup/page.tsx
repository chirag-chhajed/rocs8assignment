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

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be minimum of 2 characters")
    .max(255),
  email: z.string().trim().email("Invalid email address"),
  password: z
    .string()
    .trim()
    .min(8, "Password must be minimum of 8 characters")
    .regex(
      /(?=.*[A-Z])(?=.*[a-z])/,
      "Password must contain upper and lower case letters"
    )
    .regex(
      /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])/,
      "Password must contain special characters"
    ),
});

type FormValues = z.infer<typeof formSchema>;

export default function SignupPage() {
  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });
  return (
    <main className="flex justify-center px-10">
      <Form {...form}>
        <form className="my-10 rounded-[20px] border border-neutral-300 bg-white px-16 py-10 space-y-8 lg:max-w-[576px] h-full">
          <h2 className="text-3xl text-center font-semibold">
            Create your account
          </h2>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter" />
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
                  <Input {...field} type="password" placeholder="Enter" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="uppercase font-medium text-center w-full tracking-wider"
            type="submit"
          >
            create account
          </Button>
          <div className="flex items-center justify-center space-x-2">
            <p className="text-neutral-500 text-base">Have an Account?</p>
            <Link
              className="uppercase font-medium text-center tracking-wider hover:underline"
              href="/login"
            >
              LOGIN
            </Link>
          </div>
        </form>
      </Form>
    </main>
  );
}
