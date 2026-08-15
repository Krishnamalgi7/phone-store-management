import { NextResponse } from "next/server";
import connectDB from "@/src/lib/mongodb";
import Phone from "@/src/models/Phone";

export async function GET() {
  try {
    await connectDB();

    const phones = await Phone.find().sort({
      createdAt: -1,
    });

    return NextResponse.json(phones, {
      status: 200,
    });
  } catch (error) {
    console.error("Failed to fetch phones:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch phones",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const phone = await Phone.create(body);

    return NextResponse.json(phone, {
      status: 201,
    });
  } catch (error) {
    console.error("Failed to create phone:", error);

    return NextResponse.json(
      {
        message: "Failed to create phone",
      },
      {
        status: 500,
      }
    );
  }
}