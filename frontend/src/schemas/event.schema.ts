import { url, z } from "zod";

/* -------------------------------------------------------------------------- */
/*                               BASIC DETAILS                                */
/* -------------------------------------------------------------------------- */

export const eventBasicSchema = z.object({
  title: z
    .string()
    .min(5, "Event title must be at least 5 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters"),
  event_type: z
    .string()
    .min(3, "Event type is required"),
});

/* -------------------------------------------------------------------------- */
/*                              SCHEDULE & VENUE                              */
/* -------------------------------------------------------------------------- */

export const eventScheduleSchema = z
  .object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    start_time: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid start time"),
    end_time: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid end time"),
    venue: z
      .string()
      .min(3, "Venue is required"),
  })
  .refine(
    (data) => data.start_time < data.end_time,
    {
      message: "End time must be after start time",
      path: ["end_time"],
    }
  );

/* -------------------------------------------------------------------------- */
/*                          REGISTRATION & FEES                                */
/* -------------------------------------------------------------------------- */

export const eventRegistrationSchema = z.object({
  fees: z
    .number()
    .min(0, "Fees cannot be negative"),
  max_participants: z
    .number()
    .min(1, "At least one participant required"),
  registration_link: z
    .string()
    .url("Invalid registration link")
});

/* -------------------------------------------------------------------------- */
/*                            TEAM SETTINGS                                    */
/* -------------------------------------------------------------------------- */

export const eventTeamSchema = z
  .object({
    team_event: z.boolean(),
    team_size: z
      .number()
      .min(2, "Minimum team size is 2")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.team_event && !data.team_size) {
      ctx.addIssue({
        path: ["team_size"],
        message: "Team size is required for team events",
        code: z.ZodIssueCode.custom,
      });
    }
  });

/* -------------------------------------------------------------------------- */
/*                              MEDIA & FILES                                  */
/* -------------------------------------------------------------------------- */

export const attachmentSchema = z.object({
  name: z.string(),
  url: z.string().url(),
});

export const eventMediaSchema = z.object({
  poster_url: z
    .string()
    .url("Invalid poster URL")
    .optional(),
  attachments: z
    .string()
    .url("Invalid attachment URL")
    .optional(),
});

/* -------------------------------------------------------------------------- */
/*                        CONTACT & VISIBILITY                                  */
/* -------------------------------------------------------------------------- */

export const contactDetailsSchema = z.object({
  name: z
    .string()
    .min(2, "Contact name is required"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid phone number"),
  email: z
    .string()
    .email("Invalid email address")
    .optional(),
});

export const extraInfoSchema = z.object({
  instructions: z.string().optional(),
  rules: z.string().optional(),
});

export const eventMetaSchema = z.object({
  contact_details: contactDetailsSchema,
  extra_info: extraInfoSchema.optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published", "cancelled"]),
  is_active: z.boolean(),
  is_featured: z.boolean(),
});
