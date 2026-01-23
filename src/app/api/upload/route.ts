import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 1. Determine type based on mime
        const mimeType = file.type;
        let typeSubDir = "images";
        if (mimeType.startsWith("audio/")) typeSubDir = "audio";
        else if (mimeType.startsWith("video/")) typeSubDir = "videos";

        // 1. Create a safe path: public/uploads/users/[userId]/[type]
        const relativeUploadDir = `/uploads/users/${userId}/${typeSubDir}`;
        const uploadDir = join(process.cwd(), "public", relativeUploadDir);

        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // 2. Generate a unique filename: [timestamp]-[random].[extension]
        const extension = file.name.split(".").pop() || "webp";
        const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;
        const filePath = join(uploadDir, filename);

        // 3. Save to disk
        await writeFile(filePath, buffer);

        const fileUrl = `${relativeUploadDir}/${filename}`;

        return NextResponse.json({
            success: true,
            url: fileUrl,
            name: filename
        });
    } catch (error) {
        console.error("❌ Upload Error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
