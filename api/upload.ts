import type { Request, Response } from 'express';
import { IncomingMessage } from 'http'; // No longer needed if getUserByToken is removed
import formidable from "formidable";
// Remove getUserByToken from imports if it came from @/lib/server/utils
import { getSupabaseServiceRoleClient } from "@/lib/server/utils"; 
import { Database } from "@/types/supabase";
import * as fs from "fs";

const SERVICE_USER_ID = process.env.SUPABASE_SERVICE_ROLE_UID;

type FileInsert = Database["public"]["Tables"]["files"]["Insert"];

export default async function uploadHandler(req: Request, res: Response) {
  const bucketName = "files";

  // No user authentication, always use SERVICE_USER_ID
  const userId = SERVICE_USER_ID;

  const supabaseService = getSupabaseServiceRoleClient();

  if (req.method === "POST") {
    const form = formidable({});
    // Express req is an IncomingMessage, cast for formidable
    form.parse(req as IncomingMessage, async (err, fields, files) => { 
      if (err) {
        console.error("Error parsing form data:", err);
        return res.status(500).json({ error: "Error parsing form data" });
      }

      const fileArray = files.file;
      if (!fileArray || fileArray.length === 0) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const file = fileArray[0];

      if (!file.originalFilename) {
        return res.status(400).json({ error: "File name is missing" });
      }

      try {
        const fileContent = fs.readFileSync(file.filepath);
        // Use SERVICE_USER_ID for storage path
        const fileName = `${userId}/${Date.now()}_${file.originalFilename}`;

        const { data: uploadData, error: uploadError } = await supabaseService.storage
          .from(bucketName)
          .upload(fileName, fileContent, {
            contentType: file.mimetype || "application/octet-stream",
            upsert: false,
          });

        if (uploadError) {
          console.error("Supabase upload error:", uploadError);
          return res.status(500).json({ error: "Failed to upload file to Supabase", details: uploadError.message });
        }

        const { data: publicUrlData } = supabaseService.storage
          .from(bucketName)
          .getPublicUrl(uploadData.path);

        if (!publicUrlData || !publicUrlData.publicUrl) {
          return res.status(500).json({ error: "Failed to get public URL" });
        }

        const fileMetadata: FileInsert = {
          user_id: userId, // Use SERVICE_USER_ID
          filename: file.originalFilename,
          storage_path: uploadData.path,
          mime_type: file.mimetype,
          size_bytes: file.size,
          // storage_url: publicUrlData.publicUrl, // Was commented out, keep as is
        };

        const { error: dbError } = await supabaseService
          .from("files")
          .insert(fileMetadata);

        if (dbError) {
          console.error("Database insert error:", dbError);
          await supabaseService.storage.from(bucketName).remove([uploadData.path]);
          return res.status(500).json({ error: "Failed to save file metadata", details: dbError.message });
        }

        res.status(200).json({ message: "File uploaded successfully", data: { ...fileMetadata, id: 0 } });
      } catch (processError: unknown) {
        console.error("Error processing file upload:", processError);
        const message = processError instanceof Error ? processError.message : String(processError);
        res.status(500).json({ error: "Internal server error during file processing", details: message });
      }
    });
  } else if (req.method === "GET") {
    const { data, error } = await supabaseService
      .from("files")
      .select("*")
      .eq("user_id", userId); // Use SERVICE_USER_ID

    if (error) {
      console.error("Supabase GET error:", error);
      return res.status(500).json({ error: "Failed to fetch files", details: error.message });
    }
    res.status(200).json(data);
  } else if (req.method === "DELETE") {
    const filePath = req.query.filePath as string;
    if (!filePath) {
      return res.status(400).json({ error: "File path is required for deletion" });
    }

    const { error: storageError } = await supabaseService.storage
      .from(bucketName)
      .remove([filePath]);

    if (storageError) {
      console.error("Supabase storage delete error:", storageError);
      return res.status(500).json({ error: "Failed to delete file from storage", details: storageError.message });
    }

    const { error: dbError } = await supabaseService
      .from("files")
      .delete()
      .eq("storage_path", filePath)
      .eq("user_id", userId); // Use SERVICE_USER_ID

    if (dbError) {
      console.error("Database delete error:", dbError);
      return res.status(500).json({ error: "Failed to delete file metadata, but file removed from storage", details: dbError.message });
    }

    res.status(200).json({ message: "File deleted successfully" });
  } else {
    res.setHeader("Allow", ["POST", "GET", "DELETE"]);
    res.status(405).send(`Method ${req.method} Not Allowed`);
  }
}
 