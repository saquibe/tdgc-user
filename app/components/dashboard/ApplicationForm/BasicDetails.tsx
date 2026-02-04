"use client";
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { basicDetailsSchema } from "@/lib/basicDetailsSchema";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export type Step1FormValues = z.infer<typeof basicDetailsSchema>;
type NextStepData = Step1FormValues & { registrationCategory?: string };

interface Props {
  onNext: (data: NextStepData) => void;
  defaultValues?: Partial<Step1FormValues>;
  basicUserInfo?: { email: string; mobile_number: string } | null; // Add this

  onFileChange?: (name: string, file: File) => void;
}

interface FetchOptions {
  _id: string;
  name: string;
}

export default function BasicDetails({ onNext, defaultValues }: Props) {
  const [regCategories, setRegCategories] = useState<FetchOptions[]>([]);
  const [nationalities, setNationalities] = useState<FetchOptions[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const methods = useForm<Step1FormValues>({
    resolver: zodResolver(basicDetailsSchema),
    defaultValues,
  });

  const { handleSubmit, setValue } = methods;

  // 🔹 Fetch logged-in user's email & phone
  // Define what the API returns
  interface BasicProfileResponse {
    success: boolean;
    user: {
      id: string;
      full_name: string;
      email: string;
      mobile_number: string;
    };
  }

  useEffect(() => {
    const fetchBasicUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // 👇 Tell Axios what the response looks like
        const res = await axios.get<BasicProfileResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const { email, mobile_number } = res.data.user;
        setValue("email", email);
        setValue("mobile_number", mobile_number);
      } catch (error) {
        console.error("Failed to fetch basic user info:", error);
      }
    };

    fetchBasicUser();
  }, [setValue]);

  // 🔹 Fetch categories & nationalities
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, nationalitiesRes] = await Promise.all([
          axios.get<FetchOptions[]>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/categories`,
          ),
          axios.get<FetchOptions[]>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/nationalities`,
          ),
        ]);

        // Debug: log the actual response
        console.log("Categories response:", categoriesRes.data);
        console.log("Nationalities response:", nationalitiesRes.data);

        setRegCategories(categoriesRes.data);
        setNationalities(nationalitiesRes.data);
      } catch (error) {
        console.error("Failed to fetch form data:", error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, []);

  const onSubmit = (data: Step1FormValues) => {
    const selectedCategory = regCategories.find(
      (cat) => cat._id === data.regcategory_id,
    );
    if (selectedCategory) {
      onNext({ ...data, registrationCategory: selectedCategory.name });
    } else {
      onNext(data);
    }
  };

  if (isFetching) {
    return <div className="text-center py-10">Loading form data...</div>;
  }

  return (
    <div>
      <FormProvider {...methods}>
        <Form {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
          >
            {/* Registration Category */}
            <FormField
              name="regcategory_id"
              render={({ field }) => (
                <FormItem className="w-full md:col-span-2">
                  <FormLabel>
                    Registration Category{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full cursor-pointer">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Registration Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {regCategories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* First Name */}
            <FormField
              name="f_name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    First Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="Enter your first name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Middle Name */}
            <FormField
              name="m_name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="Enter your middle name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              name="l_name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Last Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="Enter your last name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender */}
            <FormField
              name="gender"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Gender <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full cursor-pointer">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Father's Name */}
            <FormField
              name="father_name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Father's Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="Father's Name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mother's Name */}
            <FormField
              name="mother_name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Mother's Name<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter mother's name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Place */}
            <FormField
              name="place"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Place<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="Place of birth"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date of Birth */}
            <FormField
              name="dob"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Date & Year of Birth <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-between text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                        >
                          {field.value
                            ? format(new Date(field.value), "dd/MM/yyyy")
                            : "Select date"}
                          <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(date?.toISOString())
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nationality */}
            <FormField
              name="nationality_id"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Nationality <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full cursor-pointer">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Nationality" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {nationalities.map((nat) => (
                        <SelectItem key={nat._id} value={nat._id}>
                          {nat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              name="category"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Category <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full cursor-pointer">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Open Category">
                        Open Category
                      </SelectItem>
                      <SelectItem value="Backward Classes">
                        Backward Classes
                      </SelectItem>
                      <SelectItem value="Scheduled Castes">
                        Scheduled Castes
                      </SelectItem>
                      <SelectItem value="Scheduled Tribes">
                        Scheduled Tribes
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email (auto-filled & locked) */}
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      value={field.value ?? ""}
                      className="w-full bg-gray-100 cursor-not-allowed text-gray-700"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mobile (auto-filled but editable) */}
            <FormField
              name="mobile_number"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Mobile Number <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      className="w-full"
                      placeholder="Enter mobile number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Telephone */}
            <FormField
              name="telephone_number"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Telephone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter telephone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-2 w-full">
                  <FormLabel>
                    Residential Address with Pincode{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PAN Number */}
            <FormField
              name="pan_number"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    PAN Card Number<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      maxLength={10}
                      inputMode="text"
                      placeholder="e.g. AAAAA1234A"
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PAN Upload */}
            <FormField
              name="pan_upload"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Upload PAN Card (PDF)
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      type="file"
                      accept="application/pdf"
                      className="block w-full h-10 text-sm text-gray-900 border border-gray-300 rounded-md bg-white file:h-full file:bg-[#EFEFEF] file:text-gray-700 file:font-medium file:border-1 file:rounded-l-md file:rounded-r-md file:px-4 file:cursor-pointer file:text-center"
                      onChange={(e) => onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Aadhaar Number */}
            <FormField
              name="aadhaar_number"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Aadhaar Card Number<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      inputMode="numeric"
                      maxLength={12}
                      pattern="\d*"
                      placeholder="xxxx xxxx xxxx"
                      onChange={(e) =>
                        field.onChange(e.target.value.replace(/\D/g, ""))
                      }
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Aadhaar Upload */}
            <FormField
              name="aadhaar_upload"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Upload Aadhaar Card (PDF)
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      type="file"
                      accept="application/pdf"
                      className="block w-full h-10 text-sm text-gray-900 border border-gray-300 rounded-md bg-white file:h-full file:bg-[#EFEFEF] file:text-gray-700 file:font-medium file:border-1 file:rounded-l-md file:rounded-r-md file:px-4 file:cursor-pointer file:text-center"
                      onChange={(e) => onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Registration Type */}
            <FormField
              name="regtype"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Registration Type <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full cursor-pointer">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Registration Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Regular (By Post - Fee includes postal charges)">
                        Regular (By Post - Fee includes postal charges)
                      </SelectItem>
                      <SelectItem value="Tatkal (By Hand)">
                        Tatkal (By Hand)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Signature Upload */}
            <FormField
              name="sign_upload"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Upload Signature (PDF){" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      type="file"
                      accept="application/pdf"
                      className="block w-full h-10 text-sm text-gray-900 border border-gray-300 rounded-md bg-white file:h-full file:bg-[#EFEFEF] file:text-gray-700 file:font-medium file:border-1 file:rounded-l-md file:rounded-r-md file:px-4 file:cursor-pointer file:text-center"
                      onChange={(e) => onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <div className="md:col-span-2 flex justify-center pt-6">
              <Button
                type="submit"
                className="bg-[#00694A] hover:bg-[#004d36] text-white"
              >
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
}
