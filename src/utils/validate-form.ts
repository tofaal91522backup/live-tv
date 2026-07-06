import { z } from "zod";

export const validateForm = <T extends z.ZodTypeAny>(
  schema: T,
  formData: FormData
): { errors: any } | null => {
  const data: Record<string, any> = {};


  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }
  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  return null;
};
