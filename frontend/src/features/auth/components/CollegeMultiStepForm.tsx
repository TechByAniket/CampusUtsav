import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { collegeAdmin, collegeAdminSchema, collegeAuth, collegeAuthSchema, CollegeIdentity, collegeIdentitySchema, collegeLocation, collegeLocationSchema, collegeOnlinePresence, collegeOnlinePresenceSchema } from "@/schemas/college.schema";
import type { ZodTypeAny } from "zod";
import { FormField } from "./FormField";

export type Props = {
  defaultValues: Record<string, any>;
  schema: ZodTypeAny;
  updateForm: (data: Record<string, any>) => void;
  goNext: () => void;
  submitForm: () => void;
  isLastStep: boolean;
};

export const CollegeIdentityForm: React.FC<Props> = ({
  defaultValues,
  schema,
  updateForm,
  goNext,        
  submitForm,    
  isLastStep,    
}) => {
  const form = useForm<CollegeIdentity>({
    resolver: zodResolver(schema as typeof collegeIdentitySchema),
    defaultValues: defaultValues as Partial<CollegeIdentity>,
  });

  // step fully controls validation + navigation
  const onSubmit = (data: CollegeIdentity) => {
    updateForm(data);

    if (isLastStep) {
      submitForm();   // FINAL submit
    } else {
      goNext();       // Move to next step
    }
  };

  return (
    <form
      id="step-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-2"
    >
      <FormField
          label="College Name"
          name="name"
          register={form.register}
          error={form.formState.errors.name}
          inputProps={{ placeholder: "Enter full college name" }}
        />

        <FormField
          label="Short Form"
          name="shortForm"
          register={form.register}
          error={form.formState.errors.shortForm}
          inputProps={{ placeholder: "Eg. MIT" }}
        />

        <FormField
          label="Affiliation"
          name="affiliation"
          register={form.register}
          error={form.formState.errors.affiliation}
          inputProps={{ placeholder: "University / Board" }}
        />

    </form>
  );
};


export const CollegeLocationForm: React.FC<Props> = ({
  defaultValues,
  schema,
  updateForm,
  goNext,        
  submitForm,    
  isLastStep,    
}) => {
  const form = useForm<collegeLocation>({
    resolver: zodResolver(schema as typeof collegeLocationSchema),
    defaultValues: defaultValues as Partial<collegeLocation>,
  });

  // step fully controls validation + navigation
  const onSubmit = (data: collegeLocation) => {
    updateForm(data);

    if (isLastStep) {
      submitForm();   // FINAL submit
    } else {
      goNext();       // Move to next step
    }
  };

  return (
    <form
      id="step-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-2"
    >
      {/* College Address */}
      <FormField
        label="Address"
        name="address"
        register={form.register}
        error={form.formState.errors.address}
        inputProps={{ placeholder: "Eg. 123 Main St" }}
      />

      {/* City */}
      <FormField
        label="City"
        name="city"
        register={form.register}
        error={form.formState.errors.city}
        inputProps={{ placeholder: "Eg. Navi Mumbai" }}
      />

      {/* District */}
      <FormField
        label="District"
        name="district"
        register={form.register}
        error={form.formState.errors.district}
        inputProps={{ placeholder: "Eg. Thane" }}
      />

      {/* State */}
      <FormField
        label="State"
        name="state"
        register={form.register}
        error={form.formState.errors.state}
        inputProps={{ placeholder: "Eg. Maharashtra" }}
      />
    </form>
  );
};


export const CollegeAdminForm: React.FC<Props> = ({
  defaultValues,
  schema,
  updateForm,
  goNext,        
  submitForm,    
  isLastStep,    
}) => {
  const form = useForm<collegeAdmin>({
    resolver: zodResolver(schema as typeof collegeAdminSchema),
    defaultValues: defaultValues as Partial<collegeAdmin>,
  });

  // step fully controls validation + navigation
  const onSubmit = (data: collegeAdmin) => {
    updateForm(data);

    if (isLastStep) {
      submitForm();   // FINAL submit
    } else {
      goNext();       // Move to next step
    }
  };

  return (
    <form
      id="step-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-2"
    >
      {/* College Admin Name */}
      <FormField
        label="Admin Name"
        name="adminName"
        register={form.register}
        error={form.formState.errors.adminName}
        inputProps={{ placeholder: "Enter full admin name" }}
      />

      {/* Email */}
      <FormField
        label="Email (must use college domains)"
        name="email"
        register={form.register}
        error={form.formState.errors.email}
        inputProps={{ placeholder: "Eg. admin@college.edu" }}
      />

      {/* Phone */}
      <FormField
        label="Phone"
        name="phone"
        register={form.register}
        error={form.formState.errors.phone}
        inputProps={{ placeholder: "Eg. 1123456789" }}
      />

    </form>
  );
};

export const CollegeOnlinePresenceForm: React.FC<Props> = ({
  defaultValues,
  schema,
  updateForm,
  goNext,        
  submitForm,    
  isLastStep,    
}) => {
  const form = useForm<collegeOnlinePresence>({
    resolver: zodResolver(schema as typeof collegeOnlinePresenceSchema),
    defaultValues: defaultValues as Partial<collegeOnlinePresence>,
  });

  // step fully controls validation + navigation
  const onSubmit = async (data: collegeOnlinePresence) => {

    const isValid = await form.trigger();
    if (!isValid) return;


    updateForm({
      ...data,
      // pick file from input OR already stored
      logo: data.logo?.[0] ?? defaultValues.logo,
      collegeImg: data.collegeImg?.[0] ?? defaultValues.collegeImg,
    });

    if (isLastStep) {
      submitForm();   // FINAL submit
    } else {
      goNext();       // Move to next step
    }
  };

  return (
    <form
      id="step-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-2"
    >
      {/* College Logo */}
      <FormField
        label="College Logo"
        name="logo"
        register={(name: string) =>
          form.register(name as any, {
            onChange: (e) => e.target.files,
          })
        }
        error={form.formState.errors.logo}
        inputProps={{ type: "file", accept: "image/*" }}
      />

      {/* College Image */}
      <FormField
        label="College Image"
        name="collegeImg"
        register={(name: string) =>
          form.register(name as any, {
            onChange: (e) => e.target.files,
          })
        }
        error={form.formState.errors.collegeImg}
        inputProps={{ type: "file", accept: "image/*" }}
      />

      {/* College Website */}
      <FormField
        label="Website URL"
        name="websiteUrl"
        register={form.register}
        error={form.formState.errors.websiteUrl}
        inputProps={{ placeholder: "https://www.college.edu" }}
      />

      {/* Instagram URL */}
      <FormField
        label="Instagram URL"
        name="instagramUrl"
        register={form.register}
        error={form.formState.errors.instagramUrl}
        inputProps={{ placeholder: "https://www.instagram.com/college_name" }}
      />

      {/* LinkedIn URL */}
      <FormField
        label="LinkedIn URL"
        name="linkedInUrl"
        register={form.register}
        error={form.formState.errors.linkedInUrl}
        inputProps={{ placeholder: "https://www.linkedin.com/school/college-name" }}
      />


    </form>
  );
};

export const CollegeAuthForm: React.FC<Props> = ({
  defaultValues,
  schema,
  updateForm,
  goNext,        
  submitForm,    
  isLastStep,    
}) => {
  const form = useForm<collegeAuth>({
    resolver: zodResolver(schema as typeof collegeAuthSchema),
    defaultValues: defaultValues as Partial<collegeAuth>,
  });

  // step fully controls validation + navigation
  const onSubmit = (data: collegeAuth) => {
    updateForm(data);

    if (isLastStep) {
      submitForm();   // FINAL submit
    } else {
      goNext();       // Move to next step
    }
  };

  return (
    <form
      id="step-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-2"
    >
      {/* Create Password */}
      <FormField
        label="Create Password"
        name="password"
        register={form.register}
        error={form.formState.errors.password}
        inputProps={{
          type: "password",
          placeholder: "Enter full admin name",
        }}
      />

      <div className="flex flex-col text-xs md:text-sm lg:text-sm">
        <p>Password must be at least 8 characters</p>
        <p>Must contain at least one uppercase letter</p>
        <p>Must contain at least one number</p>
      </div>

    </form>
  );
};
