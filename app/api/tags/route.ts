import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Tag from "@/models/tag";
import { ZodTagSchema } from "@/lib/validations";
import { headers } from "next/headers";

export async function GET() {
  try {
    await dbConnect();
    const tags = await Tag.find({ deleted_at: { $exists: false } }).sort({ name: 1 });
    return NextResponse.json({ tags });
  } catch (error) {
    console.error("GET /api/tags error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const validatedData = ZodTagSchema.parse(body);

    const tag = await Tag.create(validatedData);

    return NextResponse.json({ tag }, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("POST /api/tags error:", error);
    if (error?.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
