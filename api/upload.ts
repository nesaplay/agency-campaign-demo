import type { IncomingMessage, ServerResponse } from "http";
import formidable from "formidable";
import { getSupabaseServiceRoleClient, getUserByToken } from "@/lib/server/utils";
import { openai } from "@/lib/openai";
import { Database } from "@/types/supabase";
import * as fs from "fs";
import { PassThrough } from "stream";

type FileInsert = Database["public"]["Tables"]["files"]["Insert"];

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const bucketName = "files";

  const { user, error: authError } = await getUserByToken(req);
  if (authError || !user) {
    console.error(`Auth Error in ${req.method} /api/upload:`, authError);
    res.statusCode = 401;
    res.end(JSON.stringify({ error: "Unauthorized", details: authError?.message }));
    return;
  }
  const userId = user.id;

  const supabaseService = getSupabaseServiceRoleClient();

  if (req.method === "POST") {
    // ... (rest of POST logic using supabaseService variable)
  } else if (req.method === "GET") {
    // ... (rest of GET logic using supabaseService variable)
  } else if (req.method === "DELETE") {
    // ... (rest of DELETE logic using supabaseService variable)
  } else {
    res.setHeader("Allow", ["POST", "GET", "DELETE"]);
    res.statusCode = 405;
    res.end(`Method ${req.method} Not Allowed`);
  }
}
 