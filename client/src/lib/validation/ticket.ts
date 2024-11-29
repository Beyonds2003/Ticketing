import * as z from "zod";

export const ticketValidation = z.object({
  title: z.string().min(4, {
    message: "Title should have at least 3 characters.",
  }),
  price: z.coerce.number().nonnegative(),
});
