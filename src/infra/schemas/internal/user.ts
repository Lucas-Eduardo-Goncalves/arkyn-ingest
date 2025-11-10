import { z } from "zod";

const userIdSchema = z.object({
  userId: z.string().uuid(),
});

export { userIdSchema };
