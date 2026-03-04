import { randomUUID } from "crypto";
import path from "path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024;

dotenv.config({ path: path.resolve(process.cwd(), ".env"), quiet: true });
dotenv.config({ path: path.resolve(process.cwd(), "..", ".env"), quiet: true });
dotenv.config({ quiet: true });

function sanitizeFileName(fileName) {
  return String(fileName || "file")
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

function buildS3Url({ bucket, region, key }) {
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

function validateAwsEnv() {
  const bucket = process.env["AWS_S3_BUCKET"];
  const region = process.env["AWS_REGION"];
  const accessKeyId = process.env["AWS_ACCESS_KEY_ID"];
  const secretAccessKey = process.env["AWS_SECRET_ACCESS_KEY"];

  if (!bucket || !region || !accessKeyId || !secretAccessKey) {
    return {
      ok: false,
      message: "Missing AWS S3 environment variables.",
    };
  }

  return {
    ok: true,
    bucket,
    region,
    accessKeyId,
    secretAccessKey,
  };
}

export async function POST(request) {
  const aws = validateAwsEnv();
  if (!aws.ok) {
    return Response.json({ message: aws.message }, { status: 500 });
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ message: "Invalid multipart form data." }, { status: 400 });
  }

  const files = formData.getAll("files");
  if (!files.length) {
    return Response.json({ message: "No files uploaded." }, { status: 400 });
  }

  const s3 = new S3Client({
    region: aws.region,
    credentials: {
      accessKeyId: aws.accessKeyId,
      secretAccessKey: aws.secretAccessKey,
    },
  });

  const uploaded = [];

  for (const file of files) {
    if (!(file instanceof File)) continue;

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      return Response.json({ message: `Unsupported file type: ${file.type || "unknown"}` }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return Response.json(
        { message: `File exceeds 100MB limit: ${file.name}` },
        { status: 400 },
      );
    }

    const ext = sanitizeFileName(file.name).split(".").pop() || "bin";
    const key = `products/${Date.now()}-${randomUUID()}.${ext}`;
    const body = Buffer.from(await file.arrayBuffer());

    await s3.send(
      new PutObjectCommand({
        Bucket: aws.bucket,
        Key: key,
        Body: body,
        ContentType: file.type,
      }),
    );

    uploaded.push({
      name: file.name,
      type: file.type,
      size: file.size,
      key,
      url: buildS3Url({ bucket: aws.bucket, region: aws.region, key }),
    });
  }

  return Response.json({ success: true, files: uploaded });
}
