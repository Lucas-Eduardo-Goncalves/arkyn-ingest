import { z } from "zod";

const userIdSchema = z.string().uuid();

export { userIdSchema };
