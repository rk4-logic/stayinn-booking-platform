"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AIDescriptionGeneratorProps {
  propertyName: string;
  propertyType: string;
  location: string;
  amenities: string[];
  onGenerated: (description: string) => void;
}

export default function AIDescriptionGenerator({
  propertyName,
  propertyType,
  location,
  amenities,
  onGenerated,
}: AIDescriptionGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");

  const handleGenerate = async () => {
    // Validate we have enough info
    if (!propertyName.trim()) {
      toast.error("Please enter a property name first");
      return;
    }

    setLoading(true);
    setPreview("");

    try {
      const response = await fetch("/api/ai/description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyName,
          propertyType,
          location,
          amenities,
        }),
      });

      if (!response.ok) throw new Error("Generation failed");

      const data = await response.json();
      setPreview(data.description);
    } catch (error) {
      toast.error("Failed to generate description");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUse = () => {
    // Pass generated text back to parent form
    onGenerated(preview);
    toast.success("Description applied!");
    setPreview("");
  };

  return (
    <div className="space-y-3 border rounded-xl p-4 bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-semibold text-gray-900">
          AI Description Generator
        </span>
        <span className="text-xs text-gray-500">
          Powered by Claude
        </span>
      </div>

      <p className="text-xs text-gray-500">
        Fill in property details above and let AI write a professional
        description for you.
      </p>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleGenerate}
        disabled={loading || !propertyName.trim()}
        className="gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="h-3 w-3" />
            Generate Description
          </>
        )}
      </Button>

      {/* Preview */}
      {preview && (
        <div className="space-y-2">
          <Textarea
            value={preview}
            onChange={(e) => setPreview(e.target.value)}
            rows={6}
            className="text-sm resize-none bg-white"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleUse}>
              Use This Description
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleGenerate}
              disabled={loading}
            >
              Regenerate
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}