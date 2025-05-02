import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Upload,
  X,
  File as FileIcon,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileSpreadsheet,
  FileJson,
  FileCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBrand } from "@/components/brands/BrandContext";
import { ColorPicker } from "@/components/ui/color-picker";
import { useToast } from "@/components/ui/use-toast";

// Helper function to get appropriate file icon
const GetFileIcon = ({ mimeType }: { mimeType: string }): JSX.Element => {
  if (!mimeType) return <FileIcon className="h-5 w-5 flex-shrink-0" />;

  const type = mimeType.split("/")[0];
  const subtype = mimeType.split("/")[1];

  switch (type) {
    case "image":
      return <FileImage className="h-5 w-5 text-purple-500 flex-shrink-0" />;
    case "video":
      return <FileVideo className="h-5 w-5 text-red-500 flex-shrink-0" />;
    case "audio":
      return <FileAudio className="h-5 w-5 text-orange-500 flex-shrink-0" />;
    case "text":
      return <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />;
    case "application":
      if (subtype.includes("pdf")) return <FileText className="h-5 w-5 text-red-600 flex-shrink-0" />;
      if (subtype.includes("zip") || subtype.includes("compressed"))
        return <FileArchive className="h-5 w-5 text-yellow-600 flex-shrink-0" />;
      if (subtype.includes("sheet") || subtype.includes("excel") || subtype.includes("spreadsheet"))
        return <FileSpreadsheet className="h-5 w-5 text-green-600 flex-shrink-0" />;
      if (subtype.includes("json")) return <FileJson className="h-5 w-5 text-yellow-500 flex-shrink-0" />;
      if (
        subtype.includes("javascript") ||
        subtype.includes("xml") ||
        subtype.includes("html") ||
        subtype.includes("css")
      )
        return <FileCode className="h-5 w-5 text-indigo-500 flex-shrink-0" />;
      // Add more specific application types if needed
      break;
    // Add cases for other main types like 'font', etc.
  }

  return <FileIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />; // Default icon
};

const AddBrand: React.FC = () => {
  const navigate = useNavigate();
  const { addBrand } = useBrand();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#4CAF50"); // Default color
  const [primaryAudience, setPrimaryAudience] = useState("");
  const [audienceInterests, setAudienceInterests] = useState(""); // Comma-separated string
  const [audienceLocations, setAudienceLocations] = useState(""); // Comma-separated string
  const [brandObjectives, setBrandObjectives] = useState(""); // Newline-separated string
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // New state for File array
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to handle adding files (appends to existing selection)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(event.target.files!)]);
    }
  };

  // Function to handle removing a file by index
  const handleRemoveFile = (indexToRemove: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  // Function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]); // Rerun if selectedFiles changes

  const handleSubmit = async (event: React.FormEvent) => {
    console.log("handleSubmit");
    event.preventDefault();
    if (!name) {
        toast({
            title: "Missing Information",
            description: "Please enter a brand name.",
            variant: "destructive",
        });
        return;
    }
    setIsSubmitting(true);

    // Create a DataTransfer object to build a FileList
    const dataTransfer = new DataTransfer();
    selectedFiles.forEach((file) => dataTransfer.items.add(file));
    const fileList = dataTransfer.files;

    // Parse metrics inputs
    const parsedInterests = audienceInterests.split(',').map(s => s.trim()).filter(Boolean);
    const parsedLocations = audienceLocations.split(',').map(s => s.trim()).filter(Boolean);
    const parsedObjectives = brandObjectives.split('\n').map(s => s.trim()).filter(Boolean);

    // Construct metrics object
    const brandMetrics = {
      targetAudience: {
        primary: primaryAudience.trim(),
        interests: parsedInterests,
        locations: parsedLocations,
      },
      objectives: parsedObjectives,
      performance: [], // Default performance metrics (can be added later or set differently)
    };

    const newBrandData = {
      name,
      description,
      color,
      logoUrl: "",
      attachments: fileList,
      metrics: brandMetrics, // Add metrics object
    };

    try {
      // NOTE: Need to update addBrand signature in context to accept metrics
      addBrand(newBrandData); // Call with correctly typed data
      
      toast({
        title: "Brand Added Successfully",
        description: `${name} has been added to your brands.`,
      });

      navigate("/brands"); 
    } catch (error) {
      console.error("Failed to add brand:", error);
      toast({
        title: "Error Adding Brand",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false); 
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6 flex justify-center items-center relative w-full">
          <div className="flex items-center gap-4 mb-4 absolute top-7 left-4">
            <Link
              to="/brands"
              className="flex items-center gap-1 text-gray-500 hover:text-empowerlocal-navy transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to My Brands</span>
            </Link>
          </div>
          <h1 className="text-2xl font-semibold text-empowerlocal-navy">Add New Brand</h1>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-6 overflow-auto">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Brand Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Brand Name */}
                <div className="space-y-2">
                  <Label htmlFor="brandName">Brand Name</Label>
                  <Input
                    id="brandName"
                    placeholder="Enter brand name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter brand description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Metrics Section */}
                <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm"> 
                  <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">Targeting & Objectives</h3>
                  
                  {/* Target Audience Fields */}
                  <div className="space-y-2">
                    <Label htmlFor="primaryAudience">Primary Audience</Label>
                    <Input 
                      id="primaryAudience" 
                      placeholder="e.g., Adults 25-55, Families" 
                      value={primaryAudience}
                      onChange={(e) => setPrimaryAudience(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="audienceInterests">Audience Interests</Label>
                    <Input 
                      id="audienceInterests" 
                      placeholder="e.g., Hiking, Local Events, Technology (comma-separated)" 
                      value={audienceInterests}
                      onChange={(e) => setAudienceInterests(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="audienceLocations">Audience Locations</Label>
                    <Input 
                      id="audienceLocations" 
                      placeholder="e.g., Urban, Suburban, Specific City (comma-separated)" 
                      value={audienceLocations}
                      onChange={(e) => setAudienceLocations(e.target.value)}
                    />
                  </div>

                  {/* Brand Objectives Field */}
                  <div className="space-y-2">
                    <Label htmlFor="brandObjectives">Brand Objectives</Label>
                    <Textarea
                      id="brandObjectives"
                      placeholder="Enter key brand objectives, one per line..."
                      value={brandObjectives}
                      onChange={(e) => setBrandObjectives(e.target.value)}
                      rows={4}
                    />
                     <p className="text-xs text-gray-500">Enter each objective on a new line.</p>
                  </div>
                </div>

                {/* Brand Color */}
                <div className="space-y-2">
                  <Label htmlFor="brandColor">Brand Color</Label>
                  <div className="flex items-center gap-3">
                    <ColorPicker
                      id="brandColor"
                      name="brandColor"
                      value={color}
                      onChange={setColor}
                      className="w-10 h-10"
                    />
                    <Input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      maxLength={7}
                      className="w-24 text-sm"
                      aria-label="Brand color hex code"
                      id="brandColorHex"
                      name="brandColorHex"
                    />
                  </div>
                </div>

                {/* Attachments */}
                <div className="space-y-2">
                  <Label htmlFor="attachments">Attachments</Label>
                  <div className="relative flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:border-empowerlocal-blue hover:bg-empowerlocal-blue/5 transition-colors duration-150 cursor-pointer min-h-[8rem]">
                    <Input
                      id="attachments"
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      aria-label="Attach files"
                    />
                    <div className="text-center pointer-events-none z-0">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold text-empowerlocal-blue">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">Select one or more files</p>
                    </div>
                  </div>
                  {/* File Preview List */}
                  {selectedFiles.length > 0 && (
                    <div
                      className="mt-4 p-4 border rounded-lg"
                      style={{ borderColor: color, backgroundColor: `${color}10` }}
                    >
                      <h4 className="text-sm font-medium mb-3 text-gray-700">Selected Files:</h4>
                      <ul className="space-y-2">
                        {selectedFiles.map((file, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between p-2 bg-white/50 rounded-md border border-gray-200/80 hover:bg-white/80"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <GetFileIcon mimeType={file.type} />
                              <div className="flex flex-col min-w-0">
                                <span className="text-sm font-medium text-gray-800 truncate" title={file.name}>
                                  {file.name}
                                </span>
                                <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-gray-500 hover:text-red-500 hover:bg-red-100/50 flex-shrink-0 !p-0"
                              onClick={() => handleRemoveFile(index)}
                              aria-label="Remove file"
                            >
                              <X className="h-4 w-4 text-red-500" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <Button disabled={isSubmitting || !name} onClick={handleSubmit}>
                    {isSubmitting ? "Adding Brand..." : "Add Brand"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddBrand;
