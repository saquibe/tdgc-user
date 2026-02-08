import * as z from "zod";

export const basicDetailsSchema = z.object({
  regcategory_id: z.string().min(1, "Registration category is required"),
  nationality_id: z.string().min(1, "Nationality is required"),

  f_name: z
    .string()
    .min(1, "First name is required")
    .regex(/^[a-zA-Z\s]+$/, "Only alphabets are allowed"),

  m_name: z
    .string()
    .regex(/^[a-zA-Z\s]*$/, "Only alphabets are allowed")
    .optional(),

  l_name: z
    .string()
    .min(1, "Last name is required")
    .regex(/^[a-zA-Z\s]+$/, "Only alphabets are allowed"),

  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Gender is required",
  }),

  father_name: z
    .string()
    .min(1, "Father's Name is required")
    .regex(/^[a-zA-Z\s]+$/, "Only alphabets are allowed"),

  mother_name: z
    .string()
    .min(1, "Mother's Name is required")
    .regex(/^[a-zA-Z\s]+$/, "Only alphabets are allowed"),

  place: z.string().min(1, "Place is required"),
  dob: z.string().min(1, "Date of birth is required"),

  category: z.enum([
    "Open Category",
    "Backward Classes",
    "Scheduled Castes",
    "Scheduled Tribes",
  ]),

  email: z.string().email("Invalid email format"),

  mobile_number: z
    .string()
    .length(10, "Mobile number must be 10 digits")
    .regex(/^[0-9]+$/, "Only numbers are allowed"),

  telephone_number: z
    .string()
    .regex(/^[0-9]*$/, "Only numbers are allowed")
    .optional(),

  address: z.string().min(10, "Address is required"),

  pan_number: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number"),

  aadhaar_number: z.string().regex(/^\d{12}$/, "Aadhaar must be 12 digits"),

  regtype: z.enum([
    "Regular (By Post - Fee includes postal charges)",
    "Tatkal (By Hand)",
  ]),

  pan_upload: z.custom<File>((file) => file instanceof File, {
    message: "PAN PDF is required",
  }),

  aadhaar_upload: z.custom<File>((file) => file instanceof File, {
    message: "Aadhaar PDF is required",
  }),

  sign_upload: z.custom<File>((file) => file instanceof File, {
    message: "Signature PDF is required",
  }),
});
