import { z } from "zod";

const createAdmin = z.object({
  ///
  password: z.string(),
  admin: z.object({
    email: z.string().email(),
    name: z.string(),
    contactNumber: z.string(),
  }),
});

export const UserValidation = {
  createAdmin,
};
