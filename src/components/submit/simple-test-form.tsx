"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function SimpleTestForm() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Simple Test Form</h1>
        <p className="text-muted-foreground">Testing basic form rendering</p>
      </div>

      <form className="space-y-6">
        <div className="space-y-2">
          <label className="text-lg font-semibold">Business Name</label>
          <Input placeholder="Enter business name" />
        </div>

        <div className="space-y-2">
          <label className="text-lg font-semibold">Website</label>
          <Input placeholder="Enter website URL" />
        </div>

        <div className="space-y-2">
          <label className="text-lg font-semibold">Description</label>
          <Textarea
            placeholder="Describe your service"
            className="min-h-[100px]"
          />
        </div>

        <Button type="submit" className="w-full">
          Submit Test Form
        </Button>
      </form>
    </div>
  );
}

