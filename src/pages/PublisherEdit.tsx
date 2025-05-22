import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useParams, useNavigate } from "react-router-dom";
import { Publisher } from "@/components/network/types";
import usePublisherStore from "@/stores/usePublisherStore";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PublisherForm, { PublisherFormData } from "@/components/publishers/PublisherForm";
import PublisherPreview from "@/components/publishers/PublisherPreview";
import { fileToDataURL } from "@/lib/fileUtils";

const PublisherEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { getPublisherById, updatePublisher, addPublisher } = usePublisherStore();

  const [isCreateMode, setIsCreateMode] = useState(false);
  const [formData, setFormData] = useState<PublisherFormData | null>(null);
  const [originalPublisher, setOriginalPublisher] = useState<Publisher | null>(null);

  useEffect(() => {
    const createModeCheck = id === "new" || id === undefined; // also treat undefined id as create mode
    setIsCreateMode(createModeCheck);

    if (createModeCheck) {
      setOriginalPublisher(null); 
      setFormData({
        name: '',
        location: '',
        coverage: '',
        audienceSize: undefined,
        subscribers: '',
        engagement: '',
        cpm: '',
        performance: undefined,
        categories: [],
        primaryColor: '#442d9a',
        secondaryColor: '#753363',
        accentColor: '#a29090',
        latitude: undefined,
        longitude: undefined,
        logo: undefined,
        headerImage: undefined,
        logoFile: null,
        headerImageFile: null,
      });
    } else if (id) { // Explicit ID provided, so it's edit mode
      const foundPublisher = getPublisherById(id);
      if (foundPublisher) {
        setOriginalPublisher(foundPublisher);
        setFormData({
          ...foundPublisher,
          logoFile: null,
          headerImageFile: null,
        });
      } else {
        toast({ title: "Error", description: "Publisher not found.", variant: "destructive" });
        navigate("/publishers");
      }
    } else {
      // This case should ideally not be reached if routing is /publishers/:id/edit or /publishers/new/edit
      console.error("Invalid route for publisher page, ID is missing for edit mode.");
      toast({ title: "Error", description: "Invalid page URL.", variant: "destructive" });
      navigate("/publishers");
    }
  }, [id, navigate, getPublisherById, toast]);

  const handleFormChange = (updatedData: Partial<PublisherFormData>) => {
    setFormData((prevData) => {
      if (!prevData) return null;
      return { ...prevData, ...updatedData };
    });
  };

  const handleSaveChanges = async () => {
    if (!formData) {
      toast({ title: "Error", description: "Form data is missing.", variant: "destructive" });
      return;
    }
    
    if (isCreateMode && !formData.name?.trim()) {
        toast({ title: "Error", description: "Publisher name is required.", variant: "destructive" });
        return;
    }

    const { logoFile, headerImageFile, ...dataToProcess } = formData;
    const processedData: Partial<Publisher> & { logo?: string | undefined; headerImage?: string | undefined } = { ...dataToProcess };

    try {
      if (logoFile instanceof File) {
        processedData.logo = await fileToDataURL(logoFile);
      } else if (logoFile === null && !isCreateMode) { 
        processedData.logo = undefined;
      }

      if (headerImageFile instanceof File) {
        processedData.headerImage = await fileToDataURL(headerImageFile);
      } else if (headerImageFile === null && !isCreateMode) { 
        processedData.headerImage = undefined;
      }
      
      delete (processedData as PublisherFormData).logoFile;
      delete (processedData as PublisherFormData).headerImageFile;

      if (isCreateMode) {
        const newPublisher = addPublisher(processedData as Omit<Publisher, 'id'>);
        toast({ title: "Success", description: `Publisher "${newPublisher.name}" created successfully.` });
        navigate(`/publishers`); 
      } else if (id && originalPublisher) { 
        updatePublisher(id, processedData as Partial<Publisher>); 
        toast({ title: "Success", description: "Publisher updated successfully." });
        navigate(`/publishers`);
      } else {
        throw new Error("Invalid state for saving.");
      }
    } catch (error) {
      console.error("Error processing images or saving publisher:", error);
      toast({ title: "Error", description: "Could not save publisher. Please try again.", variant: "destructive" });
    }
  };

  const handleCancel = () => {
    navigate(`/publishers`);
  };

  if ((!isCreateMode && !originalPublisher && id !== "new" && id !== undefined) || !formData) {
    return (
      <MainLayout>
        <div className="p-6">Loading publisher data...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <div className="bg-white border-b border-gray-200 p-4 shadow-sm sticky top-0 z-20">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={handleCancel} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <ArrowLeft className="h-5 w-5 text-gray-500" />
              </button>
              <div>
                <h1 className="text-3xl font-semibold text-empowerlocal-navy flex items-center truncate">
                  {isCreateMode ? "Create New Publisher" : (originalPublisher?.name || "Edit Publisher")}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSaveChanges} className="btn-primary">
                {isCreateMode ? "Create Publisher" : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
            <div className="lg:col-span-3">
              <PublisherForm 
                publisher={originalPublisher} 
                formData={formData} 
                onFormChange={handleFormChange} 
                isCreateMode={false}
              />
            </div>
            <div className="lg:col-span-2 sticky top-0">
              <PublisherPreview publisherData={formData} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PublisherEditPage;
