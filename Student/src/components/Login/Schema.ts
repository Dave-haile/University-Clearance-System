import { z } from "zod";
export const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });
export type FromFields = z.infer<typeof schema>;