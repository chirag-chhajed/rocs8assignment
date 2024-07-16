"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { useVerifyMutation } from "@/store/api/authApi";
import { updateAccessToken } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
const formSchema = z.object({
  otp: z.string().length(8),
});

type FormValues = z.infer<typeof formSchema>;

export default function VerificationForm({
  id,
  email,
}: {
  id: string;
  email: string;
}) {
  console.log(email);
  const router = useRouter();
  const form = useForm<FormValues>({
    defaultValues: {
      otp: "",
    },
    resolver: zodResolver(formSchema),
  });
  const { handleSubmit, formState } = form;
  const dispatch = useAppDispatch();
  const [verify, { isLoading }] = useVerifyMutation();
  if (!id || !email) {
    router.push("/signup");
  }
  const onSubmit = async (data: FormValues) => {
    toast.promise(verify({ ...data, id }).unwrap(), {
      loading: "Verifying your email...",
      success: (result) => {
        dispatch(updateAccessToken({ accessToken: result.accessToken }));
        return "Email verified successfully";
      },
      error: (error) => `Error: ${error.data?.error || "Something went wrong"}`,
    });
  };
  return (
    <main className="flex justify-center px-10">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="my-10 rounded-[20px] border border-neutral-300 bg-white px-16 py-10 space-y-8 lg:max-w-[576px] h-full"
        >
          <h2 className="text-3xl text-center font-semibold">
            Verify your email
          </h2>
          <p className="text-center">
            Enter the 8 digit code you have received on{" "}
            <span className="font-medium">swa***@gmail.com</span>
          </p>
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <InputOTP maxLength={8} {...field}>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                    <InputOTPSlot index={6} />
                    <InputOTPSlot index={7} />
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="uppercase font-medium text-center w-full tracking-wider"
            type="submit"
            disabled={formState.isSubmitting || isLoading}
          >
            verify
          </Button>
        </form>
      </Form>
    </main>
  );
}
