import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || "",
    }
});

async function uploadFileToS3(buffer: any, userId: any, fileType: any) {
    const fileBuffer = buffer;
    const extension = fileType.split("/")[1];

    const key = `images/${userId}/${Date.now()}.${extension}`;

    const createCommand = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ContentType: fileType,
    });

    await s3Client.send(createCommand);

    const fileName = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`;

    return fileName;
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const userId = formData.get("userId");

        if (!file) {
            return NextResponse.json({ error: "File is required." }, { status: 400 });
        }

        if (file.type !== "image/jpeg" && file.type !== "image/png" && file.type !== "image/gif") {
            return NextResponse.json({ error: "File type not supported. Only JPEG, PNG, and GIF files are allowed." }, { status: 400 });
        }

        if (file.size > 1024 * 1024 * 2) {
            return NextResponse.json({ error: "File size too large. Max size is 2MB." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileType = file.type;

        const fileName = await uploadFileToS3(buffer, userId, fileType);

        return NextResponse.json({ success: true, fileName });
    } catch (error) {
        return NextResponse.json({ error });
    }
}