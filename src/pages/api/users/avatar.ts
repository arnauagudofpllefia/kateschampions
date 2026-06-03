import type { NextApiRequest, NextApiResponse } from "next";
import { randomUUID } from "node:crypto";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Solo se permiten imagenes"));
      return;
    }

    cb(null, true);
  },
});

type MulterRequest = NextApiRequest & {
  file?: Express.Multer.File;
};

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (req: NextApiRequest, res: NextApiResponse, callback: (result?: unknown) => void) => void,
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result?: unknown) => {
      if (result instanceof Error) {
        reject(result);
        return;
      }

      resolve(result);
    });
  });
}

function getFileExtension(file: Express.Multer.File): string {
  const fromName = file.originalname.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName)) {
    return fromName;
  }

  if (file.mimetype === "image/png") return "png";
  if (file.mimetype === "image/jpeg") return "jpg";
  if (file.mimetype === "image/webp") return "webp";
  if (file.mimetype === "image/gif") return "gif";
  return "bin";
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Metodo no permitido" });
    return;
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      res.status(401).json({ error: "Debes iniciar sesion" });
      return;
    }

    await runMiddleware(req, res, upload.single("avatar"));
    const parsedReq = req as MulterRequest;

    if (!parsedReq.file) {
      res.status(400).json({ error: "No se recibio ningun archivo" });
      return;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const bucket = process.env.SUPABASE_BUCKET_AVATARS ?? "avatars";

    if (!supabaseUrl || !serviceRoleKey) {
      res.status(500).json({ error: "Falta configurar NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY" });
      return;
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data: bucketsData } = await supabaseAdmin.storage.listBuckets();
    const bucketExists = (bucketsData ?? []).some((item) => item.name === bucket);

    if (!bucketExists) {
      const { error: bucketError } = await supabaseAdmin.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: `${MAX_FILE_SIZE}`,
      });

      if (bucketError && !bucketError.message.toLowerCase().includes("already exists")) {
        res.status(500).json({ error: `No se pudo crear bucket: ${bucketError.message}` });
        return;
      }
    }

    const ext = getFileExtension(parsedReq.file);
    const storagePath = `${session.user.id}/${Date.now()}-${randomUUID()}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(storagePath, parsedReq.file.buffer, {
        cacheControl: "3600",
        contentType: parsedReq.file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      res.status(500).json({ error: `Error subiendo avatar: ${uploadError.message}` });
      return;
    }

    const { data: publicUrlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(storagePath);
    const avatarUrl = publicUrlData.publicUrl;

    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({ avatar_url: avatarUrl })
      .eq("id", session.user.id);

    if (updateError) {
      res.status(500).json({ error: `No se pudo actualizar usuario: ${updateError.message}` });
      return;
    }

    res.status(200).json({ avatarUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo subir el avatar";
    res.status(400).json({ error: message });
  }
}
