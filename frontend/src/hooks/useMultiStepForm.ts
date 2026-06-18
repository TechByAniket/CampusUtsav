import { type CollegeFormData } from "@/schemas/college.schema"
import { useState } from "react";

const collegeSteps: any[] = [];

// /* -------------------------------------------------
//    Step-wise Zod schemas
//    Each index corresponds to a step in collegeSteps
// -------------------------------------------------- */
// const collegeStepSchemas = [
//     collegeIdentitySchema,
//     collegeLocationSchema,
//     collegeAdminSchema,
//     collegeOnlinePresenceSchema,
//     collegeAuthSchema
// ]


/* -------------------------------------------------
   Custom Hook: useMultiStepForm
   This hook manages:
   - step navigation
   - shared form data
   - submission state
-------------------------------------------------- */
export const useMultiStepForm = () =>{
    const [currentStep, setCurrentStep] = useState(0);

    /* 
     Stores form data progressively.
     Partial<T> is used because each step
     collects only a subset of the full data.
  */
    const [formData, setFormData] = useState<Partial<CollegeFormData>>({}); // Partial<T> is a TypeScript utility type.
    const [isSubmitted, setIsSubmitted] = useState(false);

    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === collegeSteps.length - 1;

    /* Returns Zod schema for the current step */
    const getCurrentStepSchema = () => collegeSteps[currentStep].schema;

    const goToNextStep = () => {
        if(!isLastStep) setCurrentStep((curStep) => curStep + 1);
    }

    const goToPreviousStep = () => {
        if(!isFirstStep) setCurrentStep((curStep) => curStep - 1);
    }

    /* 
     Merge current step data into the global form state.
     This keeps previously entered data intact.
  */
    const updateForm = (newData: Partial<CollegeFormData>) =>{
        setFormData((prev) => ({...prev, ...newData}));
    }

    /* 
     Final submission handler.
     At this point, full data is available
     and validated using the final schema.
  */
    const submitForm = (data:CollegeFormData) =>{
        console.log("Final Submitted Data:", data);
        setIsSubmitted(true);
    }

    const resetForm = () =>{
        setFormData({});
        setCurrentStep(0);
        setIsSubmitted(false);
    }

    return{
        currentStep, 
        isFirstStep,
        isLastStep,
        formData,
        isSubmitted,
        collegeSteps,

        goToNextStep,
        goToPreviousStep,
        updateForm,
        submitForm,
        resetForm,
        getCurrentStepSchema,
    }
}