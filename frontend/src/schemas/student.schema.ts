import { z } from "zod";

export const studentCollegeLookupByIdSchema = z.object({
  collegeId: z.number().int().positive("Select a valid college"),
});

export const studentCollegeLookupByNameSchema = z.object({
  collegeName: z.string().min(3, "Enter college name"),
});

export const studentIdentitySchema = z.object({
  name: z.string().min(5, "Enter full name"),
  gender: z.enum(["Male", "Female", "Other"]),
  identificationNumber: z.string().min(5, "College UID number required"),
  rollNo: z.number().int().positive(),
});

export const studentAcademicSchema = z.object({
//   branchId: z.number().int().positive(),
//   division: z.string().min(1),
  admissionYear: z.number().int().min(2000),
  year: z.enum(["FY, SY, TY, Final"]),
});

export const studentContactSchema = z.object({
  email: z.string().email(),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
});

export const studentProfileSchema = z.object({
  interests: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
});


export const studentAuthSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});
