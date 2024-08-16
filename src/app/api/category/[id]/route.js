import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

// GET PRISMA
export async function GET(req, context) {
  const id = Number(context.params.id);
  console.log(id);

  const response = await prisma.category.findFirst({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
    },
    include: {
      posts: true,
    },
  });

  if (!response) {
    return NextResponse.json({ message: "id not found" }, { status: 500 });
  }

  return NextResponse.json({ message: "success", data: response });
}

// PUT PRISMA
export async function PUT(req, { params }) {
  const id = Number(params.id);

  const body = await req.json();
  const response = await prisma.category.update({
    where: {
      id: id,
    },
    data: {
      name: body.name,
    },
  });

  if (!response) {
    return NextResponse.json({ message: "id not found" }, { status: 500 });
  }

  return NextResponse.json(
    { message: "Updated success" },
    { status: 200 },
    response
  );
}

// DELETE PRISMA
export async function DELETE(req, { params }) {
  const id = Number(params.id);

  const response = await prisma.category.delete({
    where: {
      id: id,
    },
  });

  if (!response) {
    return NextResponse.json({ message: "id not found" }, { status: 500 });
  }

  return NextResponse.json(
    response,
    { message: "Deleted success" },
    { status: 200 }
  );
}
