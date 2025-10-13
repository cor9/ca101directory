"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  AlertCircle,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Save,
  Upload,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface BadgeApplicationFormProps {
  userId: string;
}

interface ApplicationData {
  id?: string;
  vendor_id: string;
  business_info?: {
    name: string;
    description: string;
    category: string;
    location: string;
  };
  testimonials: string[];
  references: string[];
  credentials: string[];
  status: "draft" | "submitted" | "approved" | "rejected";
  admin_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export function BadgeApplicationForm({ userId }: BadgeApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [application, setApplication] = useState<ApplicationData>({
    vendor_id: userId,
    testimonials: [],
    references: [],
    credentials: [],
    status: "draft",
  });

  const supabase = createClientComponentClient();
  const totalSteps = 5;

  // Load existing application on mount
  useEffect(() => {
    loadExistingApplication();
  }, [userId]);

  const loadExistingApplication = async () => {
    try {
      const { data, error } = await supabase
        .from("vendor_badge_applications")
        .select("*")
        .eq("vendor_id", userId)
        .single();

      if (data && !error) {
        setApplication(data);
        // If application is submitted or approved, show status
        if (data.status === "submitted") {
          setCurrentStep(6); // Show review status
        } else if (data.status === "approved") {
          setCurrentStep(7); // Show approved status
        } else if (data.status === "rejected") {
          setCurrentStep(8); // Show rejected status
        }
      }
    } catch (error) {
      console.error("Error loading application:", error);
    }
  };

  const saveDraft = async () => {
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from("vendor_badge_applications")
        .upsert({
          ...application,
          status: "draft",
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setApplication(data);
      toast.success("Draft saved successfully!");
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const submitApplication = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("vendor_badge_applications")
        .upsert({
          ...application,
          status: "submitted",
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setApplication(data);
      setCurrentStep(6);
      toast.success("Application submitted successfully!");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFile = async (
    file: File,
    type: "testimonials" | "references" | "credentials",
  ) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/${type}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("badge_docs")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("badge_docs")
        .getPublicUrl(uploadData.path);

      // Update application with new file URL
      setApplication((prev) => ({
        ...prev,
        [type]: [...prev[type], urlData.publicUrl],
      }));

      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file. Please try again.");
    }
  };

  const removeFile = (
    index: number,
    type: "testimonials" | "references" | "credentials",
  ) => {
    setApplication((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                We'll automatically pull your business information from your
                active listing. Please verify the details below are correct.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Business Name
                  </label>
                  <p className="text-gray-900">
                    {application.business_info?.name || "Loading..."}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <p className="text-gray-900">
                    {application.business_info?.description || "Loading..."}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <p className="text-gray-900">
                    {application.business_info?.category || "Loading..."}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <p className="text-gray-900">
                    {application.business_info?.location || "Loading..."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Parent Testimonials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Upload at least 3 testimonials from families who have worked
                with you. These should demonstrate your professionalism and
                positive impact on young performers.
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload testimonial files
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    if (e.target.files) {
                      Array.from(e.target.files).forEach((file) =>
                        uploadFile(file, "testimonials"),
                      );
                    }
                  }}
                  className="hidden"
                  id="testimonials-upload"
                />
                <label
                  htmlFor="testimonials-upload"
                  className="inline-block bg-brand-blue text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-brand-blue/90"
                >
                  Choose Files
                </label>
              </div>

              {application.testimonials.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">
                    Uploaded Testimonials ({application.testimonials.length})
                  </h4>
                  {application.testimonials.map((url, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded"
                    >
                      <span className="text-sm text-gray-700">
                        Testimonial {index + 1}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFile(index, "testimonials")}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> Testimonials should include
                  parent/guardian name and contact info. Screenshots of emails
                  or text messages are acceptable.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Industry References
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Provide references from at least 2 industry professionals who
                can vouch for your work. These should be peers, colleagues, or
                industry contacts with direct knowledge of your capabilities.
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload reference files
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    if (e.target.files) {
                      Array.from(e.target.files).forEach((file) =>
                        uploadFile(file, "references"),
                      );
                    }
                  }}
                  className="hidden"
                  id="references-upload"
                />
                <label
                  htmlFor="references-upload"
                  className="inline-block bg-brand-blue text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-brand-blue/90"
                >
                  Choose Files
                </label>
              </div>

              {application.references.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">
                    Uploaded References ({application.references.length})
                  </h4>
                  {application.references.map((url, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded"
                    >
                      <span className="text-sm text-gray-700">
                        Reference {index + 1}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFile(index, "references")}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Tip:</strong> References from casting directors,
                  agents, managers, or other coaches carry the most weight in
                  the review process.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Optional Credentials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                While not required, relevant certifications, degrees, or
                professional credentials can strengthen your application and
                demonstrate your commitment to ongoing education.
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload credential files (optional)
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    if (e.target.files) {
                      Array.from(e.target.files).forEach((file) =>
                        uploadFile(file, "credentials"),
                      );
                    }
                  }}
                  className="hidden"
                  id="credentials-upload"
                />
                <label
                  htmlFor="credentials-upload"
                  className="inline-block bg-gray-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-700"
                >
                  Choose Files
                </label>
              </div>

              {application.credentials.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">
                    Uploaded Credentials ({application.credentials.length})
                  </h4>
                  {application.credentials.map((url, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded"
                    >
                      <span className="text-sm text-gray-700">
                        Credential {index + 1}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFile(index, "credentials")}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Review & Submit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600">
                Please review your application before submitting. You can still
                make changes by going back to previous steps.
              </p>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Application Summary</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>
                      • Testimonials: {application.testimonials.length} uploaded
                    </li>
                    <li>
                      • References: {application.references.length} uploaded
                    </li>
                    <li>
                      • Credentials: {application.credentials.length} uploaded
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Review Process
                  </h4>
                  <p className="text-sm text-blue-800">
                    Once submitted, our team will review your application within
                    5-7 business days. You'll receive an email notification with
                    the decision.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-2">
                    Code of Ethics Agreement
                  </h4>
                  <p className="text-sm text-yellow-800">
                    By submitting this application, you agree to uphold the
                    Child Actor 101 Code of Ethics, including our commitment to
                    safety first, professional integrity, respect for minors and
                    families, inclusivity, accountability, and continuous
                    growth.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <AlertCircle className="w-5 h-5" />
                Application Submitted
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Thank you for submitting your 101 Approved Badge application!
              </p>
              <p className="text-gray-600">
                Our team will review your application within 5-7 business days.
                You'll receive an email notification with the decision.
              </p>
              <Badge
                variant="outline"
                className="text-blue-600 border-blue-600"
              >
                Status: Under Review
              </Badge>
            </CardContent>
          </Card>
        );

      case 7:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                Application Approved!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <p className="text-green-800 font-medium">
                  🎉 Congratulations! You've been verified as a 101 Approved
                  professional.
                </p>
              </div>
              <p className="text-gray-600">
                Your badge will appear on your listing within 24 hours. You can
                now use the 101 Approved badge in your marketing materials.
              </p>
              <Badge className="bg-green-600 text-white">
                Status: Approved
              </Badge>
            </CardContent>
          </Card>
        );

      case 8:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                Application Rejected
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Unfortunately, your application was not approved at this time.
              </p>
              {application.admin_notes && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-2">Admin Notes</h4>
                  <p className="text-sm text-red-800">
                    {application.admin_notes}
                  </p>
                </div>
              )}
              <p className="text-gray-600">
                You may reapply after addressing the feedback provided. Please
                contact support if you have questions about the decision.
              </p>
              <Badge variant="outline" className="text-red-600 border-red-600">
                Status: Rejected
              </Badge>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true; // Business info is auto-loaded
      case 2:
        return application.testimonials.length >= 3;
      case 3:
        return application.references.length >= 2;
      case 4:
        return true; // Credentials are optional
      case 5:
        return (
          application.testimonials.length >= 3 &&
          application.references.length >= 2
        );
      default:
        return false;
    }
  };

  const showNavigation = currentStep <= 5;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      {showNavigation && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>
              Step {currentStep} of {totalSteps}
            </span>
            <span>
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>
      )}

      {/* Step Content */}
      {renderStep()}

      {/* Navigation */}
      {showNavigation && (
        <div className="flex justify-between items-center pt-6 border-t">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button variant="outline" onClick={prevStep}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
            <Button variant="outline" onClick={saveDraft} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
          </div>

          <div>
            {currentStep < totalSteps ? (
              <Button onClick={nextStep} disabled={!canProceed()}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={submitApplication}
                disabled={!canProceed() || isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? "Submitting..." : "Submit Application"}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Status Messages */}
      {currentStep === 2 && application.testimonials.length < 3 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            You need at least 3 testimonials to proceed. You currently have{" "}
            {application.testimonials.length}.
          </p>
        </div>
      )}

      {currentStep === 3 && application.references.length < 2 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            You need at least 2 industry references to proceed. You currently
            have {application.references.length}.
          </p>
        </div>
      )}
    </div>
  );
}
