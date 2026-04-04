import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import dbConnect from "@/lib/db";
import Media from "@/models/media";
import { put, del } from "@vercel/blob";

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const query = { deleted_at: { $exists: false } };

    const media = await Media.find(query)
      .populate("uploaded_by", "name email image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Media.countDocuments(query);

    return NextResponse.json({ 
      media,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    });

  } catch (error) {
    console.error("GET /api/media error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const alt_text = formData.get("alt_text") as string || "";
    const caption = formData.get("caption") as string || "";
    const folder = formData.get("folder") as string || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload to Vercel Blob
    // Optional: add folder path to filename
    const filename = folder ? `${folder}/${file.name}` : file.name;
    
    const blob = await put(filename, file, { 
      access: "public",
      addRandomSuffix: true // Avoid overwriting files with the same name
    });

    await dbConnect();

    // Create database record
    const media = await Media.create({
      filename: blob.pathname,
      original_name: file.name,
      mime_type: file.type || "application/octet-stream",
      size: file.size,
      url: blob.url,
      alt_text,
      caption,
      folder,
      uploaded_by: session.user.id
    });

    return NextResponse.json({ media }, { status: 201 });

  } catch (error) {
    console.error("POST /api/media error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Media ID is required" }, { status: 400 });
    }

    await dbConnect();
    
    const media = await Media.findById(id);
    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    // Delete from Vercel Blob
    if (media.url) {
      await del(media.url);
    }

    // Soft delete in database
    media.deleted_at = new Date();
    await media.save();
    
    // Hard delete alternative if you prefer:
    // await Media.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Media deleted successfully" });

  } catch (error) {
    console.error("DELETE /api/media error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
