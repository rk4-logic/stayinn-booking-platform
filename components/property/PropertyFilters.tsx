"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
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
import { PROPERTY_TYPE_OPTIONS } from "@/lib/constants/property";

export default function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [country, setCountry] = useState(searchParams.get("country") ?? "");
  const [propertyType, setPropertyType] = useState(
    searchParams.get("propertyType") ?? "all"
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (country) params.set("country", country);
    if (propertyType && propertyType !== "all") {
      params.set("propertyType", propertyType);
    }
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    params.set("page", "1");
    router.replace(`/properties?${params.toString()}`);
  }, [city, country, propertyType, minPrice, maxPrice, router]);

  const clearFilters = useCallback(() => {
    setCity("");
    setCountry("");
    setPropertyType("all");
    setMinPrice("");
    setMaxPrice("");
    router.replace("/properties");
  }, [router]);

  return (
    <div className="bg-white rounded-xl border p-5 space-y-5 sticky top-24">
      <h3 className="font-semibold text-gray-900">Filters</h3>

      <div className="space-y-1.5">
        <Label>City</Label>
        <Input
          placeholder="e.g. London"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Country</Label>
        <Input
          placeholder="e.g. United Kingdom"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Property Type</Label>
        <Select value={propertyType} onValueChange={setPropertyType}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            {PROPERTY_TYPE_OPTIONS.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Price per night</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Min"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <Input
            placeholder="Max"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <Button onClick={applyFilters} className="w-full">
          Apply Filters
        </Button>
        <Button onClick={clearFilters} variant="ghost" className="w-full">
          Clear All
        </Button>
      </div>
    </div>
  );
}