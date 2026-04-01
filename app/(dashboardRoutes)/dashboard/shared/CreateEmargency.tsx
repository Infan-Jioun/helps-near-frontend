/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Loader2,
  MapPin,
  AlertTriangle,
  ShieldAlert,
  HeartPulse,
  Flame,
  Car,
  Waves,
  Siren,
  CircleAlert,
  ImageIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { emergencyApi } from "@/lib/emergencyApi";

const EMERGENCY_TYPES = [
  { value: "MEDICAL", label: "Medical", icon: HeartPulse, color: "text-rose-500", activeBg: "bg-rose-50 border-rose-300" },
  { value: "FIRE", label: "Fire", icon: Flame, color: "text-orange-500", activeBg: "bg-orange-50 border-orange-300" },
  { value: "ACCIDENT", label: "Accident", icon: Car, color: "text-yellow-600", activeBg: "bg-yellow-50 border-yellow-300" },
  { value: "FLOOD", label: "Flood", icon: Waves, color: "text-blue-500", activeBg: "bg-blue-50 border-blue-300" },
  { value: "CRIME", label: "Crime", icon: Siren, color: "text-purple-500", activeBg: "bg-purple-50 border-purple-300" },
  { value: "OTHER", label: "Other", icon: CircleAlert, color: "text-slate-500", activeBg: "bg-slate-100 border-slate-300" },
] as const;

type EmergencyTypeValue = (typeof EMERGENCY_TYPES)[number]["value"];

const DISTRICTS = [
  "Dhaka", "Chittagong", "Rajshahi", "Khulna", "Sylhet",
  "Barisal", "Rangpur", "Mymensingh", "Comilla", "Tangail",
  "Gazipur", "Narayanganj",
];

const formSchema = z.object({
  type: z.enum(
    ["MEDICAL", "FIRE", "ACCIDENT", "FLOOD", "CRIME", "OTHER"],
    { message: "Emergency type is required" }
  ),
  description: z.string().max(1000).optional(),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
  latitude: z
    .string()
    .min(1, "Latitude is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) >= -90 && Number(v) <= 90, {
      message: "Must be between -90 and 90",
    }),
  longitude: z
    .string()
    .min(1, "Longitude is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) >= -180 && Number(v) <= 180, {
      message: "Must be between -180 and 180",
    }),
  address: z.string().max(255).optional(),
  district: z.string().optional(),
  isPriority: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateEmergency() {
  const [geoLoading, setGeoLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "OTHER" as EmergencyTypeValue,
      description: "",
      imageUrl: "",
      latitude: "",
      longitude: "",
      address: "",
      district: "",
      isPriority: false,
    },
  });

  const isPriority = form.watch("isPriority");
  const descLength = form.watch("description")?.length ?? 0;

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        form.setValue("latitude", pos.coords.latitude.toFixed(6), { shouldValidate: true });
        form.setValue("longitude", pos.coords.longitude.toFixed(6), { shouldValidate: true });
        toast.success("Location detected");
        setGeoLoading(false);
      },
      () => {
        toast.error("Could not detect location");
        setGeoLoading(false);
      }
    );
  };

  const onSubmit = async (values: FormValues) => {
    try {
      await emergencyApi.create({
        type: values.type,
        description: values.description || undefined,
        imageUrl: values.imageUrl || undefined,
        latitude: Number(values.latitude),
        longitude: Number(values.longitude),
        address: values.address || undefined,
        district: values.district || undefined,
        isPriority: values.isPriority,
      });
      toast.success("Emergency reported", {
        description: "Your report has been submitted. Help is on the way.",
      });
      form.reset();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error("Submission failed", { description: message });
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-start px-4 py-10 font-sans">
      <div className="w-full max-w-lg lg:max-w-3xl xl:max-w-4xl">

        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
        
          {isPriority && (
            <span className="ml-auto text-[10px] font-bold tracking-widest text-amber-600 border border-amber-300 bg-amber-50 rounded-full px-2.5 py-0.5 uppercase">
              Priority
            </span>
          )}
        </div>

        {isPriority && (
          <Alert className="mb-5 border-amber-200 bg-amber-50 rounded-2xl">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-sm text-amber-700">
              Priority reports are selected immediately to first responders.
            </AlertDescription>
          </Alert>
        )}

        {/* Card */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 space-y-6">
          <Form {...(form as any)}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              {/* Incident Type */}
              <FormField
                control={form.control as any}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-500 text-xs font-semibold tracking-widest uppercase">
                      Incident Type <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {EMERGENCY_TYPES.map((t) => {
                        const Icon = t.icon;
                        const isActive = field.value === t.value;
                        return (
                          <button
                            key={t.value}
                            type="button"
                            onClick={() => field.onChange(t.value as EmergencyTypeValue)}
                            className={cn(
                              "flex flex-col items-center gap-2 rounded-2xl border px-2 py-3.5 text-sm transition-all duration-150 cursor-pointer",
                              isActive
                                ? `${t.activeBg} ${t.color} shadow-sm`
                                : "border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-300 hover:bg-slate-100"
                            )}
                          >
                            <Icon className={cn("h-5 w-5", isActive ? t.color : "text-slate-400")} />
                            <span className="text-[11px] font-semibold">{t.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    <FormMessage className="text-red-500 text-xs mt-1" />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control as any}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-slate-500 text-xs font-semibold tracking-widest uppercase">
                        Description
                      </FormLabel>
                      <span className="text-[11px] text-slate-400">{descLength}/1000</span>
                    </div>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={4}
                        required
                        maxLength={1000}
                        placeholder="Describe what happened..."
                        className="resize-none bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:ring-red-400/30 focus-visible:border-red-300 rounded-2xl text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              {/* Location */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs font-semibold tracking-widest uppercase">
                    Location <span className="text-red-500">*</span>
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleGetLocation}
                    disabled={geoLoading}
                    className="h-7 gap-1.5 text-xs text-blue-500 hover:text-blue-600 hover:bg-blue-50 px-2 rounded-full"
                  >
                    {geoLoading ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <MapPin className="h-3 w-3" />
                    )}
                    {geoLoading ? "Detecting..." : "Use my location"}
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control as any}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Latitude"
                            className="bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:ring-red-400/30 focus-visible:border-red-300 rounded-2xl text-sm"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control as any}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Longitude"
                            className="bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:ring-red-400/30 focus-visible:border-red-300 rounded-2xl text-sm"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Address */}
              <FormField
                control={form.control as any}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-500 text-xs font-semibold tracking-widest uppercase">
                      Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Street / Area"
                        maxLength={255}
                        required
                        className="bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:ring-red-400/30 focus-visible:border-red-300 rounded-2xl text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              {/* District */}
              <FormField
                control={form.control as any}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-500 text-xs font-semibold tracking-widest uppercase">
                      District
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-800 focus:ring-red-400/30 focus:border-red-300 rounded-2xl text-sm">
                          <SelectValue placeholder="Select district" className="text-slate-400" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border-slate-200 rounded-2xl shadow-lg text-slate-800">
                        {DISTRICTS.map((d) => (
                          <SelectItem
                            key={d}
                            value={d}
                            className="focus:bg-slate-50 focus:text-slate-900 rounded-xl text-sm"
                          >
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              {/* Image URL */}
              <FormField
                control={form.control as any}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-500 text-xs font-semibold tracking-widest uppercase">
                      Image URL
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <Input
                          {...field}
                          placeholder="https://..."
                          className="pl-9 bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:ring-red-400/30 focus-visible:border-red-300 rounded-2xl text-sm"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              {/* Priority */}
              <FormField
                control={form.control as any}
                name="isPriority"
                render={({ field }) => (
                  <FormItem className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5">
                    <div className="flex items-start gap-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-0.5 border-amber-400 data-[state=checked]:bg-amber-400 data-[state=checked]:border-amber-400"
                        />
                      </FormControl>
                      <div className="space-y-0.5">
                        <FormLabel className="text-amber-700 text-sm font-semibold cursor-pointer flex items-center gap-1.5">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                          Mark as high priority
                        </FormLabel>
                        <p className="text-xs text-amber-600/70 leading-relaxed">
                          Use only for life-threatening situations requiring immediate response.
                        </p>
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full h-12 rounded-2xl bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold tracking-wide text-sm transition-all duration-150 shadow-sm shadow-red-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4" />
                    Submit Emergency Report
                  </span>
                )}
              </Button>

            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}