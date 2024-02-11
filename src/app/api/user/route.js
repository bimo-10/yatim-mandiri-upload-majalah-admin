import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

// GET PRISMA
export async function GET() {
  try {
    const response = await prisma.user.findMany();

    return NextResponse.json({
      status: 200,
      message: "success",
      data: response,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}

// POST PRISMA

export async function POST(req) {
  try {
    const data = await req.json();

    // CHECK EMAIL
    const checkEmail = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (checkEmail) {
      return NextResponse.json({
        status: 400,
        message: "email already exist",
      });
    }

    // CHECK USERNAME
    const checkUsername = await prisma.user.findUnique({
      where: {
        username: data.username,
      },
    });

    if (checkUsername) {
      return NextResponse.json({
        status: 400,
        message: "username already exist",
      });
    }

    // HASHED PASSWORD
    const hashedPassword = await hash(data.password, 10);

    const response = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
      },
    });

    // HIDDEN PASSWORD
    const { password: newPassword, ...rest } = response;

    return NextResponse.json({
      status: 200,
      message: "create success",
      data: rest,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}

// export async function POST(req) {
//   try {
//     const data = await req.formData();

//     // CREATE USER
//     const response = await prisma.user.create({
//       data: {
//         username: data.get("username"),
//         email: data.get("email"),
//         password: data.get("password"),
//       },
//     });

//     return NextResponse.json({
//       status: 200,
//       message: "create success",
//       data: response,
//     });
//   } catch (error) {
//     return NextResponse.json({
//       status: 500,
//       message: error.message,
//     });
//   }
// }
