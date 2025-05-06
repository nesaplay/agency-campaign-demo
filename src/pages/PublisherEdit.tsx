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
      if (!prevData) return null; // Should not happen if initialized correctly
      
      // Handle Object URL revocation for previous files if new files are being set
      if (updatedData.logoFile instanceof File && prevData.logoFile instanceof File) {
        URL.revokeObjectURL(URL.createObjectURL(prevData.logoFile));
      }
      if (updatedData.headerImageFile instanceof File && prevData.headerImageFile instanceof File) {
        URL.revokeObjectURL(URL.createObjectURL(prevData.headerImageFile));
      }
      
      return { ...prevData, ...updatedData };
    });
  };

  const handleSaveChanges = () => {
    if (!publisherId || !formData) {
      console.error("Cannot save without publisher ID or form data");
      toast({ title: "Error", description: "Form data is missing.", variant: "destructive" });
      return;
    }
    if (originalPublisher) {
      console.log("Saving changes for publisher:", publisherId, formData);

      // Destructure to separate File objects from other data to be saved to the store
      const { logoFile, headerImageFile, ...dataToSaveBase } = formData;
      const dataToSave: Partial<Publisher> = { ...dataToSaveBase }; // dataToSaveBase is already Partial<Publisher>

      // TODO: Handle actual file uploads here!
      // 1. Upload logoFile if it exists => get logoUrl
      // 2. Upload headerImageFile if it exists => get headerImageUrl
      // 3. Add logoUrl and headerImageUrl to dataToSave
      // These URLs would then replace or set the `logo` and `headerImage` fields in dataToSave

      // Placeholder logic for mock URLs if files were selected (mimicking upload)
      if (logoFile) {
        dataToSave.logo = `/mock/path/to/${logoFile.name}`; // Example
        console.log("TODO: Upload logoFile, then set dataToSave.logo with actual URL");
      }
      if (headerImageFile) {
        dataToSave.headerImage = `/mock/path/to/${headerImageFile.name}`; // Example
        console.log("TODO: Upload headerImageFile, then set dataToSave.headerImage with actual URL");
      }

      updatePublisher(publisherId, dataToSave);

      toast({ title: "Success", description: "Publisher updated successfully." });
      navigate(`/publishers`);
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
