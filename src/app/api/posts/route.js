import { getAuthSession } from "@/utils/auth";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";
import { POST_PER_PAGE, MAX_POST_PER_PAGE } from "@/utils/constants";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);

  const page = Math.max(1, parseInt(searchParams.get("page")) || 1);
  const limit = Math.min(
    MAX_POST_PER_PAGE,
    Math.max(1, parseInt(searchParams.get("limit")) || POST_PER_PAGE)
  );
  const cat = searchParams.get("cat");

  const query = {
    take: limit,
    skip: limit * (page - 1),
    orderBy: { createdAt: "desc" },
    where: {
      ...(cat && { catSlug: cat }),
    },
  };

  try {
    const [posts, count] = await prisma.$transaction([
      prisma.post.findMany(query),
      prisma.post.count({ where: query.where }),
    ]);
    return new NextResponse(JSON.stringify({ posts, count }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }), { status: 500 }
    );
  }
};










// CREATE A POST
export const POST = async (req) => {
  const session = await getAuthSession();

  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated!" }), { status: 401 }
    );
  }

  try {
    const body = await req.json();

    if (!body.title?.trim() || !body.slug) {
      return new NextResponse(
        JSON.stringify({ message: "Please add a title" }), { status: 400 }
      );
    }

    // keep the slug unique: my-post, my-post-2, my-post-3...
    let slug = body.slug;
    let n = 1;
    while (await prisma.post.findUnique({ where: { slug } })) {
      slug = `${body.slug}-${++n}`;
    }

    const post = await prisma.post.create({
      data: { ...body, slug, userEmail: session.user.email },
    });

    return new NextResponse(JSON.stringify(post), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }), { status: 500 }
    );
  }
};
