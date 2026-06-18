import { z } from "zod";

/* ---------------- College Identity ---------------- */
export const collegeIdentitySchema = z.object({
  name: z.string().min(10, "Enter full college name"),
  shortForm: z.string().min(3, "At least 3 characters required"),
  affiliation: z.string().min(5, "Affiliation status required"),
  branchIds: z.array(z.number()).min(1, "Select at least one branch"),
});

/* ---------------- College Location ---------------- */
export const collegeLocationSchema = z.object({
  address: z.string().min(10, "Enter full address"),
  city: z.string().min(2, "City name required"),
  district: z.string().min(2, "District name required"),
  state: z.string().min(3, "State name required"),
});

/* ---------------- College Admin / Contact ---------------- */
export const collegeAdminSchema = z.object({
  adminName: z.string().min(5, "Enter admin full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  officialDomains: z.string().min(1, "Enter official email domain(s)"),
});

/* ---------------- File Upload Schema ---------------- */

const fileSchema = z
  .any()
  .refine((fileList) => !!fileList?.length, { message: "Please upload a file" })
  .refine(
    (fileList) =>
      !fileList ||
      ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(fileList[0].type),
    { message: "Only PNG, JPG, JPEG or WEBP allowed" }
  )
  .refine(
    (fileList) => !fileList || fileList[0].size <= 2 * 1024 * 1024,
    { message: "File must be less than 2MB" }
  );

/* ---------------- College Online Presence ---------------- */
export const collegeOnlinePresenceSchema = z.object({
  websiteUrl: z
    .string()
    .url("Enter a valid website URL")
    .optional(),
  
  instagramUrl: z
    .string()
    .url("Enter a valid instagram URL")
    .optional()
    .or(z.literal("")),

  linkedInUrl: z
    .string()
    .url("Enter a valid LinkedIn URL")
    .optional()
    .or(z.literal("")),

  logo: fileSchema,
  collegeImg: fileSchema,
});

/* ---------------- College Authentication ---------------- */
export const collegeAuthSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});

export type CollegeIdentity = z.infer<typeof collegeIdentitySchema>;
export type collegeLocation = z.infer<typeof collegeLocationSchema>;
export type collegeAdmin = z.infer<typeof collegeAdminSchema>;
export type collegeOnlinePresence = z.infer<typeof collegeOnlinePresenceSchema>;
export type collegeAuth = z.infer<typeof collegeAuthSchema>;

export type CollegeFormData =
  CollegeIdentity &
  collegeLocation &
  collegeAdmin &
  collegeOnlinePresence &
  collegeAuth;
