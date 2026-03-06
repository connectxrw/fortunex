"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { LoaderIcon, LocateFixedIcon, MapPinIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { contactInfoFormSchema, type TContactInfoFormSchema } from "./schema";

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { "Accept-Language": "en" } },
    );
    const data = await res.json();
    const { city, town, village, state, country } = data.address ?? {};
    const place = city ?? town ?? village ?? state ?? "";
    return [place, country].filter(Boolean).join(", ");
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}
const REGX = /^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/;
export function BusinessContactInfo({
  email,
  phone,
  location,
  latitude,
  longitude,
  category,
}: {
  email: string | undefined;
  phone: string | undefined;
  location: string | undefined;
  latitude: number | undefined | null;
  longitude: number | undefined | null;
  category?: string;
}) {
  const updateBusinessContactInfo = useMutation(
    api.business.index.updateBusinessContactInfo,
  );
  const updateBusinessCoordinates = useMutation(
    api.business.index.updateBusinessCoordinates,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [latStr, setLatStr] = useState<string>(
    latitude != null ? String(latitude) : "",
  );
  const [lngStr, setLngStr] = useState<string>(
    longitude != null ? String(longitude) : "",
  );

  const isRestaurant = category === "restaurant";

  const form = useForm<TContactInfoFormSchema>({
    resolver: zodResolver(contactInfoFormSchema),
    defaultValues: {
      email: email ?? "",
      phone: phone ?? "",
      location: location ?? "",
      latitude: latitude ?? undefined,
      longitude: longitude ?? undefined,
    },
  });

  async function onSubmit(data: TContactInfoFormSchema) {
    try {
      setIsLoading(true);
      await updateBusinessContactInfo({
        email: data.email,
        phone: data.phone,
        location: data.location,
      });
      if (data.latitude != null && data.longitude != null) {
        await updateBusinessCoordinates({
          latitude: data.latitude,
          longitude: data.longitude,
        });
      }
      toast.success("Contact info updated successfully");
    } catch (error) {
      if (error instanceof ConvexError) {
        toast.error(error.data.message || "Failed to update contact info");
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update contact info",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleCoordPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData("text");
    const match = text.trim().match(REGX);
    if (match) {
      const lat = Number.parseFloat(match[1]);
      const lng = Number.parseFloat(match[2]);
      if (
        !(Number.isNaN(lat) || Number.isNaN(lng)) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
      ) {
        e.preventDefault();
        setLatStr(match[1]);
        setLngStr(match[2]);
        form.setValue("latitude", lat, { shouldDirty: true });
        form.setValue("longitude", lng, { shouldDirty: true });
        toast.success("Coordinates pasted");
      }
    }
  }

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const address = await reverseGeocode(lat, lng);
        form.setValue("location", address, { shouldDirty: true });
        form.setValue("latitude", lat, { shouldDirty: true });
        form.setValue("longitude", lng, { shouldDirty: true });
        setLatStr(String(lat));
        setLngStr(String(lng));
        setIsDetecting(false);
        toast.success("Location detected — click Save Changes to apply");
      },
      (err) => {
        setIsDetecting(false);
        if (err.code === err.PERMISSION_DENIED) {
          toast.error(
            "Location access denied — enable it in your browser settings",
          );
        } else {
          toast.error("Unable to detect location");
        }
      },
      { timeout: 10_000 },
    );
  };

  const hasCoords =
    form.watch("latitude") != null && form.watch("longitude") != null;

  return (
    <div className="w-full max-w-3xl">
      <form
        className="pb-6"
        id="form-customize-contact-info"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Contact Info</FieldLegend>

            <FieldGroup>
              {/* Email & Phone */}
              {(["email", "phone"] as const).map((key) => (
                <Controller
                  control={form.control}
                  key={key}
                  name={key}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`form-${key}`}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        disabled={isLoading}
                        id={`form-${key}`}
                        placeholder={key}
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              ))}

              {/* Location text */}
              <Controller
                control={form.control}
                name="location"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-sm">Location</span>
                      {isRestaurant && (
                        <span className="font-normal text-muted-foreground text-sm">
                          Shown on your profile
                        </span>
                      )}
                    </div>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      disabled={isLoading || isDetecting}
                      id="form-location"
                      placeholder="e.g. Kigali, Rwanda"
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Coordinates row */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-sm">Coordinates</span>
                    <span className="mb-2 font-normal text-muted-foreground text-sm">
                      Required for "Near Me" feature
                    </span>
                  </div>
                  <Button
                    className={cn(
                      "h-7 gap-1.5 rounded-full text-xs",
                      hasCoords && "text-emerald-600 dark:text-emerald-400",
                    )}
                    disabled={isDetecting || isLoading}
                    onClick={handleDetectLocation}
                    size="sm"
                    type="button"
                    variant="ghost"
                  >
                    {isDetecting ? (
                      <LoaderIcon className="h-3.5 w-3.5 animate-spin" />
                    ) : hasCoords ? (
                      <LocateFixedIcon className="h-3.5 w-3.5" />
                    ) : (
                      <MapPinIcon className="h-3.5 w-3.5" />
                    )}
                    {isDetecting ? "Detecting…" : "Auto-detect"}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Controller
                    control={form.control}
                    name="latitude"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-latitude">
                          Latitude
                        </FieldLabel>
                        <Input
                          aria-invalid={fieldState.invalid}
                          disabled={isLoading || isDetecting}
                          id="form-latitude"
                          inputMode="decimal"
                          onChange={(e) => {
                            const str = e.target.value;
                            setLatStr(str);
                            if (str === "") {
                              field.onChange(undefined);
                            } else {
                              const num = Number.parseFloat(str);
                              if (!Number.isNaN(num)) {
                                field.onChange(num);
                              }
                            }
                          }}
                          onPaste={handleCoordPaste}
                          placeholder="-1.9441"
                          type="text"
                          value={latStr}
                        />
                        {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="longitude"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-longitude">
                          Longitude
                        </FieldLabel>
                        <Input
                          aria-invalid={fieldState.invalid}
                          disabled={isLoading || isDetecting}
                          id="form-longitude"
                          inputMode="decimal"
                          onChange={(e) => {
                            const str = e.target.value;
                            setLngStr(str);
                            if (str === "") {
                              field.onChange(undefined);
                            } else {
                              const num = Number.parseFloat(str);
                              if (!Number.isNaN(num)) {
                                field.onChange(num);
                              }
                            }
                          }}
                          onPaste={handleCoordPaste}
                          placeholder="30.0619"
                          type="text"
                          value={lngStr}
                        />
                        {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
                <p className="text-muted-foreground text-xs">
                  Find your coordinates on{" "}
                  <a
                    className="underline underline-offset-2 hover:text-foreground"
                    href="https://maps.google.com"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Google Maps
                  </a>{" "}
                  by right-clicking your location — then paste the result
                  directly into either field above, or use Auto-detect.
                </p>
              </div>
            </FieldGroup>
          </FieldSet>
        </FieldGroup>
      </form>

      <Button
        className="rounded-full"
        disabled={isLoading}
        form="form-customize-contact-info"
        size="sm"
        type="submit"
        variant="secondary"
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
