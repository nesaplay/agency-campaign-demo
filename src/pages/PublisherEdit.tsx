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
  const { id: publisherId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get store actions
  const { getPublisherById, updatePublisher } = usePublisherStore();

  // Use PublisherFormData for the form's state
  const [formData, setFormData] = useState<PublisherFormData | null>(null);
  // Original publisher data loaded from the store - should be of type Publisher
  const [originalPublisher, setOriginalPublisher] = useState<Publisher | null>(null);

  useEffect(() => {
    if (!publisherId) {
      console.error("No publisher ID provided.");
      navigate("/publishers");
      return;
    }
    const foundPublisher = getPublisherById(publisherId); // This returns Publisher | undefined
    if (foundPublisher) {
      setOriginalPublisher(foundPublisher);
      // Initialize formData with the loaded publisher data, fitting PublisherFormData structure
      setFormData({
        ...foundPublisher,
        logoFile: null, // Explicitly initialize file fields for PublisherFormData
        headerImageFile: null,
      });
    } else {
      console.error(`Publisher with id ${publisherId} not found.`);
      toast({ title: "Error", description: "Publisher not found.", variant: "destructive" });
      navigate("/publishers");
    }
  }, [publisherId, navigate, getPublisherById, toast]);

  const handleFormChange = (updatedData: Partial<PublisherFormData>) => {
    setFormData((prevData) => {
      if (!prevData) return null;
      
      // Note: The Object URL revocation logic here might need refinement
      // as URL.createObjectURL(prevData.logoFile) would create a new URL.
      // For now, focusing on the save logic.
      if (updatedData.logoFile instanceof File && prevData.logoFile instanceof File) {
        // Consider managing object URLs more directly if explicit revocation is critical during form interaction
      }
      if (updatedData.headerImageFile instanceof File && prevData.headerImageFile instanceof File) {
        // Similar consideration for headerImageFile
      }
      
      return { ...prevData, ...updatedData };
    });
  };

  const handleSaveChanges = async () => {
    if (!publisherId || !formData) {
      console.error("Cannot save without publisher ID or form data");
      toast({ title: "Error", description: "Form data is missing.", variant: "destructive" });
      return;
    }
    if (originalPublisher) {
      console.log("Saving changes for publisher:", publisherId, formData);

      // Destructure to separate File objects from other data to be saved to the store
      const { logoFile, headerImageFile, ...dataToSaveBase } = formData;
      // Initialize with base data, which includes existing string URLs for logo/header if no new files are chosen
      const dataToSave: Partial<Publisher> = { ...dataToSaveBase };

      try {
        if (logoFile instanceof File) {
          dataToSave.logo = await fileToDataURL(logoFile);
          console.log("Converted logoFile to data URL");
        } else if (logoFile === null && dataToSaveBase.logo !== undefined) {
          dataToSave.logo = undefined;
        }

        if (headerImageFile instanceof File) {
          dataToSave.headerImage = await fileToDataURL(headerImageFile);
          console.log("Converted headerImageFile to data URL");
        } else if (headerImageFile === null && dataToSaveBase.headerImage !== undefined) {
          dataToSave.headerImage = undefined;
        }

        updatePublisher(publisherId, dataToSave);

        toast({ title: "Success", description: "Publisher updated successfully." });
        navigate(`/publishers`);
      } catch (error) {
        console.error("Error processing images or updating publisher:", error);
        toast({ title: "Error", description: "Could not save publisher changes. Please try again.", variant: "destructive" });
      }
    }
  };

  const handleCancel = () => {
    navigate(`/publishers`);
  };

  if (!originalPublisher || !formData) { // Check both originalPublisher and formData
    return (
      <MainLayout>
        <div className="p-6">Loading publisher...</div>
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
                  {originalPublisher.name}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSaveChanges} className="btn-primary">
                Save Changes
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
