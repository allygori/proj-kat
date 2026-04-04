import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/user";
import { headers } from "next/headers";
import { z } from "zod";

const userUpdateSchema = z.object({
  role: z.enum(["admin", "editor", "author"]).optional(),
  name: z.string().optional(),
});

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    // In a real application, you might want to restrict viewing all users to admin only
    const users = await User.find({ deleted_at: { $exists: false } }).select("-password"); // assuming no password field but just in case
    return NextResponse.json({ users });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  // Better Auth handles basic user functions. We can use this to update custom role.
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Usually only admin can update roles

    await dbConnect();
    const body = await request.json();
    const { id, ...updateData } = body; // expect id to be provided

    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const validatedData = userUpdateSchema.parse(updateData);

    const user = await User.findOneAndUpdate(
      { _id: id, deleted_at: { $exists: false } },
      { $set: validatedData },
      { new: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("PATCH /api/users error:", error);
    if (error?.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
