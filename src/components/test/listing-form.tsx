"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ListingForm() {
  const searchParams = useSearchParams();

  // Prefill defaults for dev
  const devDefaults =
    process.env.NODE_ENV === "development"
      ? {
          name: "Coaching with Corey",
          link: "https://coaching.childactor101.com",
          description:
            "Private audition coaching, self-tape strategy, and charisma-building for young actors.",
          introduction: "Kids and teens, ages 7–17, working in TV and film.",
          unique:
            "My Prep101 system and bold choice framework make kids stand out to casting — fast.",
          format: "Online",
          notes:
            "Includes a printed guide and self-tape feedback option. Coaching is based on 25+ years in the industry.",
          email: "coaching@childactor101.com",
          phone: "(323) 593-6442",
          city: "Los Angeles",
          state: "CA",
          zip: "90066",
          bondNumber: "2346732",
          plan: "Premium",
          performerPermit: "true",
          bonded: "true",
          categories: "rec4gFz49LQTQpzhw,recxsGFD5Xs9eSrrT",
          tags: "tag-1,tag-2,tag-3",
          iconId: "supabase-1758872013372"
        }
      : {};

  // Initialize state with dev defaults
  const [formData, setFormData] = useState<Record<string, string>>(devDefaults);

  // Override with query string if present
  useEffect(() => {
    const queryOverrides: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      queryOverrides[key] = value;
    }
    setFormData((prev) => ({ ...prev, ...queryOverrides }));
  }, [searchParams]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Convert form data to the format expected by the transform
    const submitData = {
      name: formData.name,
      link: formData.link,
      description: formData.description,
      introduction: formData.introduction,
      unique: formData.unique,
      format: formData.format,
      notes: formData.notes,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      bondNumber: formData.bondNumber,
      plan: formData.plan,
      performerPermit: formData.performerPermit === "true",
      bonded: formData.bonded === "true",
      categories: formData.categories ? formData.categories.split(",") : [],
      tags: formData.tags ? formData.tags.split(",") : [],
      iconId: formData.iconId
    };

    console.log("Submitting:", submitData);

    try {
      const response = await fetch("/api/test-transform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();
      console.log("Transform result:", result);
      alert("Check console for transform result");
    } catch (error) {
      console.error("Error:", error);
      alert("Error occurred - check console");
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Test Airtable Transform</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Listing Name"
          value={formData.name || ""}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="link"
          placeholder="Website"
          value={formData.link || ""}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <textarea
          name="description"
          placeholder="What You Offer?"
          value={formData.description || ""}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <textarea
          name="introduction"
          placeholder="Who Is It For?"
          value={formData.introduction || ""}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <textarea
          name="unique"
          placeholder="Why Is It Unique?"
          value={formData.unique || ""}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="format"
          placeholder="Format (Online/In-person/Hybrid)"
          value={formData.format || ""}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <textarea
          name="notes"
          placeholder="Extras/Notes"
          value={formData.notes || ""}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="email"
          placeholder="Email"
          value={formData.email || ""}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="phone"
          placeholder="Phone"
          value={formData.phone || ""}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="city"
          placeholder="City"
          value={formData.city || ""}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="state"
          placeholder="State"
          value={formData.state || ""}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="zip"
          placeholder="Zip"
          value={formData.zip || ""}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="bondNumber"
          placeholder="Bond Number"
          value={formData.bondNumber || ""}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="plan"
          placeholder="Plan"
          value={formData.plan || ""}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <div className="flex gap-4">
          <label>
            <input
              type="checkbox"
              name="performerPermit"
              checked={formData.performerPermit === "true"}
              onChange={(e) => setFormData(prev => ({ ...prev, performerPermit: e.target.checked ? "true" : "false" }))}
            />
            Performer Permit
          </label>
          <label>
            <input
              type="checkbox"
              name="bonded"
              checked={formData.bonded === "true"}
              onChange={(e) => setFormData(prev => ({ ...prev, bonded: e.target.checked ? "true" : "false" }))}
            />
            Bonded
          </label>
        </div>
        <input
          name="categories"
          placeholder="Categories (comma-separated IDs)"
          value={formData.categories || ""}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="tags"
          placeholder="Tags (comma-separated)"
          value={formData.tags || ""}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="iconId"
          placeholder="Icon ID"
          value={formData.iconId || ""}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Test Transform
        </button>
      </form>
    </div>
  );
}
