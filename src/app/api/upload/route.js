import { getAuthSession } from "@/utils/auth";
import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

// UPLOAD AN IMAGE (saved in /public/uploads)
export const POST = async (req) => {
  const session = await getAuthSession();

  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated!" }),
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string" || !file.type?.startsWith("image/")) {
      return new NextResponse(
        JSON.stringify({ message: "Please choose an image file" }),
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return new NextResponse(
        JSON.stringify({ message: "Image must be smaller than 5MB" }),
        { status: 400 }
      );
    }

    const ext = path.extname(file.name).toLowerCase().replace(/[^.\w]/g, "");
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads");

    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));

    return new NextResponse(JSON.stringify({ url: `/uploads/${name}` }), {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};
