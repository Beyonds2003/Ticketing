import * as z from "zod";

export const userValidation = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must contain at least 6 character(s)",
  }),
});
