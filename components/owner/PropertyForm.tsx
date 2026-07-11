"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createPropertyAction,
  updatePropertyAction,
} from "@/actions/property.actions";
import { PROPERTY_TYPE_OPTIONS } from "@/lib/constants/property";
import { Currency } from "@/types/common.types";
import type { PropertyFormProps } from "@/types/property.types";
import ImageUploader from "@/components/upload/ImageUploader";
import { UploadedImage } from "@/types/image.types";


export default function PropertyForm({
  propertyId,
  initialData,
}: PropertyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Basic Info
  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );
  const [propertyType, setPropertyType] = useState(
    initialData?.propertyType ?? ""
  );
  const [currency, setCurrency] = useState(
    initialData?.currency ?? Currency.USD
  );

  // Location
  const [address, setAddress] = useState(
    initialData?.location.address ?? ""
  );
  const [city, setCity] = useState(initialData?.location.city ?? "");
  const [state, setState] = useState(initialData?.location.state ?? "");
  const [country, setCountry] = useState(
    initialData?.location.country ?? ""
  );
  const [latitude, setLatitude] = useState(
    String(initialData?.location.latitude ?? "")
  );
  const [longitude, setLongitude] = useState(
    String(initialData?.location.longitude ?? "")
  );

  // Contact
  const [phone, setPhone] = useState(initialData?.contact.phone ?? "");
  const [whatsapp, setWhatsapp] = useState(
    initialData?.contact.whatsapp ?? ""
  );
  const [email, setEmail] = useState(initialData?.contact.email ?? "");

  // Amenities
  const [amenities, setAmenities] = useState(
    initialData?.amenities.join(", ") ?? ""
  );
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const handleSubmit = async () => {
    if (!name.trim()) return toast.error("Property name is required");
    if (!description.trim()) return toast.error("Description is required");
    if (!propertyType) return toast.error("Property type is required");
    if (!address.trim()) return toast.error("Address is required");
    if (!city.trim()) return toast.error("City is required");
    if (!state.trim()) return toast.error("State is required");
    if (!country.trim()) return toast.error("Country is required");
    if (!phone.trim()) return toast.error("Phone is required");
    if (!latitude || !longitude)
      return toast.error("Latitude and longitude are required");

    setLoading(true);

    const formData = {
      name: name.trim(),
      description: description.trim(),
      propertyType,
      currency,
      location: {
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        country: country.trim(),
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      contact: {
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || undefined,
        email: email.trim() || undefined,
      },
      amenities: amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      images: uploadedImages,
    };

    const result = propertyId
      ? await updatePropertyAction(propertyId, formData)
      : await createPropertyAction(formData);

    if (result.success) {
      toast.success(
        propertyId
          ? "Property updated successfully!"
          : "Property created! Pending admin approval."
      );
      router.push("/owner/properties");
      router.refresh();
    } else {
      toast.error("Something went wrong. Please check your inputs.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl border p-6 space-y-8 max-w-2xl">
      {/* Basic Info */}
      <section className="space-y-4">
        <h3 className="font-semibold text-gray-900 border-b pb-2">
          Basic Information
        </h3>

        <div className="space-y-1.5">
          <Label>Property Name *</Label>
          <Input
            placeholder="e.g. The Grand London Hotel"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Description *</Label>
          <textarea
            placeholder="Describe your property in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm min-h-[120px] outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Property Type *</Label>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_TYPE_OPTIONS.filter((t) => t.value !== "all").map(
                  (type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Currency).map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="space-y-4">
        <h3 className="font-semibold text-gray-900 border-b pb-2">
          Location
        </h3>

        <div className="space-y-1.5">
          <Label>Street Address *</Label>
          <Input
            placeholder="123 Main Street"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>City *</Label>
            <Input
              placeholder="London"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>State *</Label>
            <Input
              placeholder="England"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Country *</Label>
          <Input
            placeholder="United Kingdom"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Latitude *</Label>
            <Input
              placeholder="51.5074"
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Longitude *</Label>
            <Input
              placeholder="-0.1278"
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="space-y-4">
        <h3 className="font-semibold text-gray-900 border-b pb-2">
          Contact Information
        </h3>

        <div className="space-y-1.5">
          <Label>Phone *</Label>
          <Input
            placeholder="+44 20 1234 5678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>WhatsApp (optional)</Label>
            <Input
              placeholder="+44 20 1234 5678"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Email (optional)</Label>
            <Input
              placeholder="contact@hotel.com"
              type="email"
              value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="space-y-4">
        <h3 className="font-semibold text-gray-900 border-b pb-2">
          Amenities
        </h3>
        <div className="space-y-1.5">
          <Label>Amenities (comma separated)</Label>
          <Input
            placeholder="WiFi, Pool, Parking, Gym, Restaurant"
            value={amenities}
            onChange={(e) => setAmenities(e.target.value)}
          />
          <p className="text-xs text-gray-400">
            Separate each amenity with a comma
          </p>
        </div>
      </section>

      {/* Images */}
      <section className="space-y-4">
        <h3 className="font-semibold text-gray-900 border-b pb-2">
          Property Images
        </h3>
        <ImageUploader
          initialImages={initialData?.images ?? []}
          onChange={setUploadedImages}
          folder="stayinn/properties"
          maxFiles={10}
        />
      </section>

      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={loading}
        size="lg"
      >
        {loading
          ? "Saving..."
          : propertyId
            ? "Update Property"
            : "Create Property"}
      </Button>
    </div>
  );
}