"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitOwnerRequestAction } from "@/actions/owner-request.actions";

export default function BecomeOwnerForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
    if (!businessName.trim()) return toast.error("Business name is required");
    if (!phone.trim()) return toast.error("Phone is required");
    if (!country.trim()) return toast.error("Country is required");
    if (!reason.trim()) return toast.error("Please tell us why you want to list");

    setLoading(true);

    const result = await submitOwnerRequestAction({
      businessName: businessName.trim(),
      phone: phone.trim(),
      country: country.trim(),
      reason: reason.trim(),
    });

    if (result.success) {
      toast.success("Request submitted! We'll review it shortly.");
      router.refresh();
    } else {
      toast.error(String(result.error) || "Failed to submit");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white border rounded-2xl p-6 space-y-5">
      <h2 className="font-semibold text-gray-900">Submit Your Request</h2>

      <div className="space-y-1.5">
        <Label>Business / Property Name *</Label>
        <Input
          placeholder="e.g. Sunrise Hotels Ltd"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Phone *</Label>
          <Input
            placeholder="+1 234 567 8900"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Country *</Label>
          <Input
            placeholder="United Kingdom"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Why do you want to list on StayInn? *</Label>
        <textarea
          placeholder="Tell us about your property and why you want to join..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm min-h-[100px] outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Request"}
      </Button>
    </div>
  );
}