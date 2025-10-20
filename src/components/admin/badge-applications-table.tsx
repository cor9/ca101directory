"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  Clock,
  Award,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface BadgeApplication {
  id: string;
  vendor_id: string;
  business_info: any;
  testimonials: string[];
  industry_references: string[];
  credentials: string[];
  status: "draft" | "submitted" | "approved" | "rejected";
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  email?: string;
  full_name?: string;
  listing_name?: string;
  categories?: string[];
}

interface BadgeApplicationsTableProps {
  applications: BadgeApplication[];
}

export function BadgeApplicationsTable({
  applications: initialApplications,
}: BadgeApplicationsTableProps) {
  const [applications, setApplications] =
    useState<BadgeApplication[]>(initialApplications);
  const [selectedApp, setSelectedApp] = useState<BadgeApplication | null>(
    null,
  );
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const supabase = createClientComponentClient();

  const handleViewApplication = (app: BadgeApplication) => {
    setSelectedApp(app);
    setAdminNotes(app.admin_notes || "");
    setIsReviewDialogOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedApp) return;

    setIsProcessing(true);
    try {
      // Update application status
      const { error: updateError } = await supabase
        .from("vendor_badge_applications")
        .update({
          status: "approved",
          admin_notes: adminNotes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedApp.id);

      if (updateError) throw updateError;

      // Update the listing to show badge_approved
      const { error: listingError } = await supabase
        .from("listings")
        .update({ badge_approved: true })
        .eq("owner_id", selectedApp.vendor_id);

      if (listingError) {
        console.error("Error updating listing badge status:", listingError);
      }

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.id === selectedApp.id
            ? { ...app, status: "approved", admin_notes: adminNotes }
            : app,
        ),
      );

      toast.success("Application approved! Badge has been granted.");
      setIsReviewDialogOpen(false);
      setSelectedApp(null);
    } catch (error) {
      console.error("Error approving application:", error);
      toast.error("Failed to approve application. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApp) return;
    if (!adminNotes.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from("vendor_badge_applications")
        .update({
          status: "rejected",
          admin_notes: adminNotes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedApp.id);

      if (error) throw error;

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.id === selectedApp.id
            ? { ...app, status: "rejected", admin_notes: adminNotes }
            : app,
        ),
      );

      toast.success("Application rejected. Vendor will be notified.");
      setIsReviewDialogOpen(false);
      setSelectedApp(null);
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast.error("Failed to reject application. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            <Clock className="w-3 h-3 mr-1" />
            Pending Review
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="outline" className="bg-gray-50 text-paper">
            <FileText className="w-3 h-3 mr-1" />
            Draft
          </Badge>
        );
      default:
        return null;
    }
  };

  const filteredApplications =
    filterStatus === "all"
      ? applications
      : applications.filter((app) => app.status === filterStatus);

  return (
    <>
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[
          { value: "all", label: "All" },
          { value: "submitted", label: "Pending" },
          { value: "approved", label: "Approved" },
          { value: "rejected", label: "Rejected" },
          { value: "draft", label: "Drafts" },
        ].map((filter) => (
          <button
            key={filter.value}
            onClick={() => setFilterStatus(filter.value)}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              filterStatus === filter.value
                ? "text-brand-blue border-b-2 border-brand-blue"
                : "text-paper hover:text-paper"
            }`}
          >
            {filter.label}
            {filter.value !== "all" && (
              <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                {
                  applications.filter((app) => app.status === filter.value)
                    .length
                }
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-paper uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-paper uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-paper uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-paper uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-paper uppercase tracking-wider">
                  Documents
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-paper uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-paper">
                      <Award className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-lg font-medium mb-1">
                        No applications found
                      </p>
                      <p className="text-sm">
                        {filterStatus === "all"
                          ? "No badge applications have been submitted yet."
                          : `No ${filterStatus} applications.`}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-paper">
                          {app.full_name || "N/A"}
                        </div>
                        <div className="text-sm text-paper">{app.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-paper">
                          {app.listing_name || "N/A"}
                        </div>
                        {app.categories && app.categories.length > 0 && (
                          <div className="text-sm text-paper">
                            {app.categories[0]}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                    <td className="px-6 py-4 text-sm text-paper">
                      {formatDistanceToNow(new Date(app.created_at), {
                        addSuffix: true,
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-paper">
                        <div>{app.testimonials.length} testimonials</div>
                        <div>{app.industry_references.length} references</div>
                        {app.credentials.length > 0 && (
                          <div>{app.credentials.length} credentials</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewApplication(app)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Review
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-orange" />
              Review Badge Application
            </DialogTitle>
            <DialogDescription>
              Review the vendor's application for the 101 Approved badge
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-6">
              {/* Vendor Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-paper mb-3">
                  Vendor Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-paper">Name:</span>
                    <span className="ml-2 font-medium">
                      {selectedApp.full_name}
                    </span>
                  </div>
                  <div>
                    <span className="text-paper">Email:</span>
                    <span className="ml-2 font-medium">{selectedApp.email}</span>
                  </div>
                  <div>
                    <span className="text-paper">Business:</span>
                    <span className="ml-2 font-medium">
                      {selectedApp.listing_name}
                    </span>
                  </div>
                  <div>
                    <span className="text-paper">Status:</span>
                    <span className="ml-2">{getStatusBadge(selectedApp.status)}</span>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="font-semibold text-paper mb-3">
                  Submitted Documents
                </h3>
                <div className="space-y-4">
                  {/* Testimonials */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-paper">
                        Parent Testimonials
                      </h4>
                      <Badge variant="outline">
                        {selectedApp.testimonials.length} files
                      </Badge>
                    </div>
                    {selectedApp.testimonials.length === 0 ? (
                      <p className="text-sm text-paper">
                        No testimonials uploaded
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {selectedApp.testimonials.map((url, index) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-brand-blue hover:underline"
                          >
                            <FileText className="w-4 h-4" />
                            Testimonial {index + 1}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* References */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-paper">
                        Industry References
                      </h4>
                      <Badge variant="outline">
                        {selectedApp.industry_references.length} files
                      </Badge>
                    </div>
                    {selectedApp.industry_references.length === 0 ? (
                      <p className="text-sm text-paper">
                        No references uploaded
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {selectedApp.industry_references.map((url, index) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-brand-blue hover:underline"
                          >
                            <FileText className="w-4 h-4" />
                            Reference {index + 1}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Credentials */}
                  {selectedApp.credentials.length > 0 && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-paper">
                          Professional Credentials
                        </h4>
                        <Badge variant="outline">
                          {selectedApp.credentials.length} files
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {selectedApp.credentials.map((url, index) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-brand-blue hover:underline"
                          >
                            <FileText className="w-4 h-4" />
                            Credential {index + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <Label htmlFor="admin-notes" className="mb-2">
                  Admin Notes
                  {selectedApp.status === "submitted" && (
                    <span className="text-sm text-paper ml-2">
                      (Required for rejection)
                    </span>
                  )}
                </Label>
                <Textarea
                  id="admin-notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this application (visible to vendor if rejected)..."
                  rows={4}
                  className="w-full"
                />
              </div>

              {/* Previous Admin Notes (if exists) */}
              {selectedApp.admin_notes &&
                selectedApp.status !== "submitted" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">
                          Previous Admin Notes
                        </h4>
                        <p className="text-sm text-blue-800">
                          {selectedApp.admin_notes}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsReviewDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            {selectedApp?.status === "submitted" && (
              <>
                <Button
                  variant="outline"
                  onClick={handleReject}
                  disabled={isProcessing}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  {isProcessing ? "Processing..." : "Reject"}
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {isProcessing ? "Processing..." : "Approve"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

