import React, { useState, useEffect } from "react";
import { Publisher } from "@/components/network/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadCloud } from "lucide-react";

// Define the extended type needed for the form's temporary file state
export interface PublisherFormData extends Partial<Publisher> {
  logoFile?: File | null;
  headerImageFile?: File | null;
}

interface PublisherFormProps {
  publisher: Publisher | null;
  formData: PublisherFormData | null;
  onFormChange: (updatedData: Partial<PublisherFormData>) => void;
  isCreateMode: boolean;
}

const PublisherForm: React.FC<PublisherFormProps> = ({ publisher, formData, onFormChange, isCreateMode }) => {
  const [categoriesInputValue, setCategoriesInputValue] = useState<string>("");

  useEffect(() => {
    if (formData && formData.categories) {
      setCategoriesInputValue(formData.categories.join(", "));
    } else {
      // If creating and formData is fresh, or if no categories exist
      setCategoriesInputValue(formData?.name === "" && isCreateMode ? "" : (formData?.categories || []).join(", "));
    }
  }, [formData?.categories, formData?.name, isCreateMode]); // Add isCreateMode and formData.name to dependencies for robust init

  if (!isCreateMode && !formData) {
    return <div className="p-4">Loading publisher data...</div>;
  }

  // Use formData for values to make inputs controlled, fallback to original publisher data
  const currentPrimaryColor = formData.primaryColor ?? publisher.primaryColor ?? "#442d9a";
  const currentSecondaryColor = formData.secondaryColor ?? publisher.secondaryColor ?? "#753363";
  const currentAccentColor = formData.accentColor ?? publisher.accentColor ?? "#a29090";

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: "logoFile" | "headerImageFile") => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      onFormChange({ [fieldName]: file });
    } else {
      onFormChange({ [fieldName]: null });
    }
  };

  // Helper for number inputs
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof Publisher) => {
    const value = e.target.value;
    onFormChange({ [fieldName]: value === "" ? undefined : parseFloat(value) } as Partial<PublisherFormData>);
  };

  const handleCategoriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoriesInputValue(e.target.value);
  };

  const handleCategoriesBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Process the raw string into an array of categories onBlur
    const processedCategories = e.target.value
      .split(",")
      .map((cat) => cat.trim())
      .filter((cat) => cat); // Filter out empty strings
    onFormChange({ categories: processedCategories });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              className="mt-1"
              value={formData.name ?? ""}
              onChange={(e) => onFormChange({ name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="location">Location (e.g., City, State)</Label>
            <Input
              type="text"
              name="location"
              id="location"
              className="mt-1"
              value={formData.location ?? ""}
              onChange={(e) => onFormChange({ location: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="coverage">Coverage Area (e.g., Greater Phoenix Area)</Label>
            <Input
              type="text"
              name="coverage"
              id="coverage"
              className="mt-1"
              value={formData.coverage ?? ""}
              onChange={(e) => onFormChange({ coverage: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Audience & Metrics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="audienceSize">Audience Size</Label>
            <Input
              type="number"
              name="audienceSize"
              id="audienceSize"
              className="mt-1"
              value={formData.audienceSize ?? ""}
              onChange={(e) => handleNumberChange(e, "audienceSize")}
            />
          </div>
          <div>
            <Label htmlFor="subscribers">Subscribers (e.g., 85,000)</Label>
            <Input
              type="text"
              name="subscribers"
              id="subscribers"
              className="mt-1"
              value={formData.subscribers ?? ""}
              onChange={(e) => onFormChange({ subscribers: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="engagement">Engagement (e.g., 4.2%)</Label>
            <Input
              type="text"
              name="engagement"
              id="engagement"
              className="mt-1"
              value={formData.engagement ?? ""}
              onChange={(e) => onFormChange({ engagement: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="cpm">CPM (e.g., $15)</Label>
            <Input
              type="text"
              name="cpm"
              id="cpm"
              className="mt-1"
              value={formData.cpm ?? ""}
              onChange={(e) => onFormChange({ cpm: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="performance">Performance</Label>
            <Select
              name="performance"
              value={formData.performance}
              onValueChange={(value) => onFormChange({ performance: value as "Good" | "Average" | "Excellent" })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select performance" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Average">Average</SelectItem>
                <SelectItem value="Excellent">Excellent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categorization</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="categories">Categories (comma-separated)</Label>
            <Input
              type="text"
              name="categories"
              id="categories"
              className="mt-1"
              value={categoriesInputValue}
              onChange={handleCategoriesChange}
              onBlur={handleCategoriesBlur}
              placeholder="e.g., News, Politics, Local Events"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter categories separated by commas. Tags will be processed when you click away.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Color Scheme Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Color Scheme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="color"
                  name="primaryColor"
                  id="primaryColor"
                  className="h-10 w-14 p-0.5 border-gray-300"
                  value={currentPrimaryColor}
                  onChange={(e) => onFormChange({ primaryColor: e.target.value })}
                />
                <Input
                  type="text"
                  value={currentPrimaryColor}
                  onChange={(e) => onFormChange({ primaryColor: e.target.value })}
                  placeholder="#RRGGBB"
                  className="block w-full"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="color"
                  name="secondaryColor"
                  id="secondaryColor"
                  className="h-10 w-14 p-0.5 border-gray-300"
                  value={currentSecondaryColor}
                  onChange={(e) => onFormChange({ secondaryColor: e.target.value })}
                />
                <Input
                  type="text"
                  value={currentSecondaryColor}
                  onChange={(e) => onFormChange({ secondaryColor: e.target.value })}
                  placeholder="#RRGGBB"
                  className="block w-full"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="accentColor">Accent Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="color"
                  name="accentColor"
                  id="accentColor"
                  className="h-10 w-14 p-0.5 border-gray-300"
                  value={currentAccentColor}
                  onChange={(e) => onFormChange({ accentColor: e.target.value })}
                />
                <Input
                  type="text"
                  value={currentAccentColor}
                  onChange={(e) => onFormChange({ accentColor: e.target.value })}
                  placeholder="#RRGGBB"
                  className="block w-full"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Brand Assets Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Brand Assets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo Upload */}
          <div>
            <Label htmlFor="logoUpload">Logo</Label>
            {/* Display current logo if URL exists */}
            {publisher?.logo && !formData.logoFile && (
              <div className="mt-2 mb-2">
                <img
                  src={publisher.logo}
                  alt="Current Logo"
                  className="h-20 max-w-xs object-contain border rounded-md p-1"
                />
              </div>
            )}
            {/* Display preview of newly selected file */}
            {formData.logoFile && (
              <div className="mt-2 mb-2">
                <img
                  src={URL.createObjectURL(formData.logoFile)}
                  alt="New Logo Preview"
                  className="h-20 max-w-xs object-contain border rounded-md p-1"
                />
              </div>
            )}
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="logoFile"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-empowerlocal-blue hover:text-empowerlocal-navy focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-empowerlocal-blue"
                  >
                    <span>{publisher?.logo || formData.logoFile ? "Change logo" : "Upload a file"}</span>
                    <Input
                      id="logoFile"
                      name="logoFile"
                      type="file"
                      className="sr-only"
                      onChange={(e) => handleFileChange(e, "logoFile")}
                      accept="image/png, image/jpeg, image/svg+xml"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, SVG up to 2MB</p>
                {formData.logoFile && <p className="text-sm text-green-600 mt-1">Selected: {formData.logoFile.name}</p>}
              </div>
            </div>
          </div>

          {/* Header Image Upload */}
          <div>
            <Label htmlFor="headerImageUpload">Header Image</Label>
            {/* Display current header image if URL exists */}
            {publisher?.headerImage && !formData.headerImageFile && (
              <div className="mt-2 mb-2">
                <img
                  src={publisher.headerImage}
                  alt="Current Header"
                  className="h-32 max-w-full object-contain border rounded-md p-1"
                />
              </div>
            )}
            {/* Display preview of newly selected file */}
            {formData.headerImageFile && (
              <div className="mt-2 mb-2">
                <img
                  src={URL.createObjectURL(formData.headerImageFile)}
                  alt="New Header Preview"
                  className="h-32 max-w-full object-contain border rounded-md p-1"
                />
              </div>
            )}
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="headerImageFile"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-empowerlocal-blue hover:text-empowerlocal-navy focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-empowerlocal-blue"
                  >
                    <span>
                      {publisher?.headerImage || formData.headerImageFile ? "Change header image" : "Upload a file"}
                    </span>
                    <Input
                      id="headerImageFile"
                      name="headerImageFile"
                      type="file"
                      className="sr-only"
                      onChange={(e) => handleFileChange(e, "headerImageFile")}
                      accept="image/png, image/jpeg"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                {formData.headerImageFile && (
                  <p className="text-sm text-green-600 mt-1">Selected: {formData.headerImageFile.name}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Geospatial Coordinates</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              type="number"
              name="latitude"
              id="latitude"
              className="mt-1"
              value={formData.latitude ?? ""}
              onChange={(e) => handleNumberChange(e, "latitude")}
              step="any"
            />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              type="number"
              name="longitude"
              id="longitude"
              className="mt-1"
              value={formData.longitude ?? ""}
              onChange={(e) => handleNumberChange(e, "longitude")}
              step="any"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublisherForm;
