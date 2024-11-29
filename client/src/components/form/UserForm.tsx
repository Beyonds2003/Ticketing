"use client";
import { userValidation } from "@/lib/validation/user";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import * as z from "zod";
import { Button } from "../ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

type propsType = {
  formType: "signup" | "signin";
};

const UserForm = ({ formType }: propsType) => {
  const [error, setError] = React.useState<string>("");

  const route = useRouter();

  const form = useForm<z.infer<typeof userValidation>>({
    resolver: zodResolver(userValidation),
  });

  const [isPending, startTransition] = useTransition()

  const onSubmit = async (values: z.infer<typeof userValidation>) => {
    try {
      const { data } = await axios.post(`/api/users/${formType}`, {
        email: values.email,
        password: values.password,
      })
      console.log(data)
      startTransition(() => {
        route.push("/");
      })
    } catch (error: any) {
      setError(error.response.data.errors[0].message);
    }
  };

  return (
    <section className="bg-milk min-w-[450px] rounded-lg p-6">
      <div className="flex items-center mb-6 gap-6">
        <h1 className={`text-3xl font-bold`}>
          {formType === "signup" ? "Sign Up" : "Sign In"}
        </h1>
        {error.length > 0 && (
          <p className="text-red-600 text-lg">{`(${error})`}</p>
        )}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl font-semibold">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    className="text-lg border-black focus:border-none "
                    required
                    {...field}
                  />
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
                <FormLabel className="text-xl font-semibold">
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="text-lg border-black focus:border-none"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isPending}
            className="text-xl font-semibold hover:bg-primary bg-secondary px-6 text-black"
          >
            Submit
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default UserForm;
