import React from 'react';
import { Brand } from '@/components/brands/types';
import { Paperclip, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AttachmentsTabProps {
  brand: Brand;
}

const AttachmentsTab: React.FC<AttachmentsTabProps> = ({ brand }) => {
  const attachments = brand.attachments || [];

  if (attachments.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Paperclip className="h-5 w-5" />
            Attachments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No attachments found for this brand.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Paperclip className="h-5 w-5" />
          Attachments ({attachments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {attachments.map((file, index) => (
            <li 
              key={index} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200"
            >
              <span className="text-sm font-medium text-gray-700 truncate pr-4">
                {file.name}
              </span>
              {/* Assuming file.url is a direct download link */}
              <Button 
                variant="outline"
                size="sm"
                asChild
              >
                <a href={file.url} download={file.name} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </a>
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default AttachmentsTab; 