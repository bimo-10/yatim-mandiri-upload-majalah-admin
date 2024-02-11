import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  const id = Number(context.params.id);

  const getPost = await prisma.post.findFirst({
    where: {
      id: id,
    },
    include: {
      categories: true,
      views: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 10,
  });

  if (getPost) {
    const updateView = await prisma.view.create({
      data: {
        viewCount: 1,
        posts: {
          connect: {
            id: getPost.id,
          },
        },
      },
    });

    if (updateView) {
      const sumView = await prisma.view.aggregate({
        _sum: {
          viewCount: true,
        },
        where: {
          posts: {
            some: {
              id: getPost.id,
            },
          },
        },
      });

      return NextResponse.json({
        message: "sum success",
        data: {
          getPost: getPost,
          sumView: sumView,
        },
      });
    }

    return NextResponse.json({
      message: "update success",
      data: updateView,
    });
  }

  if (!getPost) {
    return NextResponse.json({ message: "id not found" }, { status: 500 });
  }

  return NextResponse.json(getPost);
}
