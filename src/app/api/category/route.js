import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

// GET PRISMA
export const GET = async (req) => {
  const category = await prisma.category.findMany();
  return NextResponse.json(category);
};

// POST PRISMA
export const POST = async (req) => {
  const body = await req.json();
  const category = await prisma.category.create({
    data: {
      id: body.id,
      name: body.name,
    },
  });

  return NextResponse.json({ category });
};

// PUT PRISMA
export const PUT = async (req) => {
  const body = await req.json();
  const category = await prisma.category.update({
    where: {
      id: body.id,
    },
    data: {
      name: body.name,
    },
  });

  return NextResponse.json({ category });
};

// DELETE PRISMA
export const DELETE = async (req) => {
  const url = new URL(req.url).searchParams;
  const id = Number(url.get("id"));

  const category = await prisma.category.delete({
    where: {
      id: id,
    },
  });

  if (!category) {
    return NextResponse.json(
      { message: "category not found" },
      { status: 500 }
    );
  }

  return NextResponse.json({});
};
