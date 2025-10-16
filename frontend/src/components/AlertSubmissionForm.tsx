import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, Upload } from "lucide-react";

interface AlertSubmissionFormProps {
  onSubmitSuccess?: () => void;
}

const AlertSubmissionForm = ({ onSubmitSuccess }: AlertSubmissionFormProps) => {
  const [formData, setFormData] = useState({
    category: "",
    otherCategory: "",
    pincode: "",
    address: "",
    city: "",
    date: "",
    time: "",
    description: "",
    urgencyLevel: "",
    isVerified: false,
    files: [] as File[],
    fileCaptions: [] as string[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (formData.files.length + files.length > 3) {
        alert("Maximum 3 files allowed");
        return;
      }

      const validFiles = Array.from(files).filter(file => {
        const validTypes = ["image/jpeg", "image/png", "video/mp4"];
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (!validTypes.includes(file.type)) {
          alert("Only JPG, PNG, and MP4 files are allowed");
          return false;
        }
        if (file.size > maxSize) {
          alert("File size must be less than 10MB");
          return false;
        }
        return true;
      });

      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...validFiles],
        fileCaptions: [...prev.fileCaptions, ...validFiles.map(() => "")],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.category || !formData.pincode || !formData.description || !formData.urgencyLevel) {
      alert("Please fill in all required fields");
      return;
    }

    // Validate description length
    if (formData.description.length < 100 || formData.description.length > 1000) {
      alert("Description must be between 100 and 1000 characters");
      return;
    }

    if (!formData.isVerified) {
      alert("Please verify that the information is accurate");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare form data for backend
      const submitData = new FormData();
      submitData.append("category", formData.category);
      submitData.append("pincode", formData.pincode);
      submitData.append("address", formData.address);
      submitData.append("city", formData.city);
      submitData.append("date", formData.date);
      submitData.append("time", formData.time);
      submitData.append("description", formData.description);
      submitData.append("urgency_level", formData.urgencyLevel);
      submitData.append("latitude", "0.0"); // Default, can add geolocation later
      submitData.append("longitude", "0.0");
      
      if (formData.category === "other" && formData.otherCategory) {
        submitData.append("other_category", formData.otherCategory);
      }

      // Add verification flag
      submitData.append("is_verified", formData.isVerified.toString());

      // Add files and their captions if any
      formData.files.forEach((file) => {
        submitData.append("files", file);
      });
      
      // Add file captions as a JSON string
      if (formData.fileCaptions.length > 0) {
        submitData.append("file_captions", JSON.stringify(formData.fileCaptions));
      }

      // Submit to backend using API service
      const response = await fetch("http://127.0.0.1:8000/submit-alert", {
        method: "POST",
        body: submitData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      alert(`✅ Alert submitted successfully!\n\nPostgreSQL ID: ${result.postgresql_id}\nFirebase ID: ${result.firebase_id}\n\nYour alert is now active and visible to responders.`);
      
      // Reset form
      setFormData({
        category: "",
        otherCategory: "",
        pincode: "",
        address: "",
        city: "",
        date: "",
        time: "",
        description: "",
        urgencyLevel: "",
        isVerified: false,
        files: [],
        fileCaptions: [],
      });

      // Close the dialog
      onSubmitSuccess?.();
      
    } catch (error) {
      console.error("Error submitting alert:", error);
      alert("❌ Failed to submit alert. Please make sure the backend server is running and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-background">
      <p className="text-muted-foreground mb-6">
        Fill out the form below to submit an alert. Required fields are marked with *
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Alert Category */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Alert Details</h3>
          <div className="space-y-2">
            <Label htmlFor="category">Alert Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fraud">Fraud</SelectItem>
                <SelectItem value="natural-disaster">Natural Disaster</SelectItem>
                <SelectItem value="fire">Fire</SelectItem>
                <SelectItem value="medical">Medical Emergency</SelectItem>
                <SelectItem value="suspicious">Suspicious Activity</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {formData.category === "other" && (
              <Input
                placeholder="Specify category"
                value={formData.otherCategory}
                onChange={(e) => setFormData(prev => ({ ...prev, otherCategory: e.target.value }))}
                className="mt-2"
              />
            )}
          </div>
        </div>

        {/* Location Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Location Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pincode">Pin Code *</Label>
              <Input
                id="pincode"
                placeholder="Enter PIN code"
                value={formData.pincode}
                onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City / District *</Label>
              <Input
                id="city"
                placeholder="Enter city or district"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Exact Address / Landmark *</Label>
            <Textarea
              id="address"
              placeholder="Enter exact location or nearby landmark"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            />
          </div>
        </div>

        {/* Incident Timing */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Incident Timing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date of Incident *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time of Incident *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Incident Description */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Incident Details</h3>
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what happened, who was involved, and any immediate danger. (Minimum 100 characters)"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[150px] resize-y"
            />
            <div className="text-sm text-muted-foreground flex justify-between">
              <span>{formData.description.length} characters</span>
              <span>Minimum 100, Maximum 1000 characters</span>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Evidence Upload</h3>
          <div className="border-2 border-dashed border-border rounded-lg p-6">
            <div className="flex items-center justify-center flex-col gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center">
                Drop files here or click to upload
                <br />
                <span className="text-xs">
                  Supported: JPG, PNG, MP4 (Max 3 files, 10MB each)
                </span>
              </p>
              <Input
                type="file"
                accept=".jpg,.jpeg,.png,.mp4"
                multiple
                onChange={handleFileUpload}
                className="mt-2"
              />
            </div>
            {formData.files.length > 0 && (
              <div className="mt-4 space-y-2">
                {formData.files.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 bg-muted/50 p-2 rounded">
                    <div className="flex-1 truncate">{file.name}</div>
                    <Input
                      placeholder="Add caption"
                      value={formData.fileCaptions[index]}
                      onChange={(e) => {
                        const newCaptions = [...formData.fileCaptions];
                        newCaptions[index] = e.target.value;
                        setFormData(prev => ({ ...prev, fileCaptions: newCaptions }));
                      }}
                      className="w-48"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        const newFiles = formData.files.filter((_, i) => i !== index);
                        const newCaptions = formData.fileCaptions.filter((_, i) => i !== index);
                        setFormData(prev => ({
                          ...prev,
                          files: newFiles,
                          fileCaptions: newCaptions,
                        }));
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Urgency Level */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Urgency Level *</h3>
          <div className="grid grid-cols-3 gap-4">
            {["Low", "Medium", "High"].map((level) => (
              <label
                key={level}
                className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  formData.urgencyLevel === level.toLowerCase()
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <input
                  type="radio"
                  name="urgency"
                  value={level.toLowerCase()}
                  checked={formData.urgencyLevel === level.toLowerCase()}
                  onChange={(e) => setFormData(prev => ({ ...prev, urgencyLevel: e.target.value }))}
                  className="sr-only"
                />
                {level}
              </label>
            ))}
          </div>
        </div>

        {/* Verification */}
        <div className="space-y-4">
          <label className="flex items-center gap-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isVerified}
              onChange={(e) => setFormData(prev => ({ ...prev, isVerified: e.target.checked }))}
              className="rounded border-primary text-primary focus:ring-primary"
            />
            <span className="text-sm">
              I confirm that the information provided is accurate to the best of my knowledge. *
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Alert"}
        </Button>
      </form>
    </div>
  );
};

export default AlertSubmissionForm;