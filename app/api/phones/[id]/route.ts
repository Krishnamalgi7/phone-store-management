import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/src/lib/mongodb";
import Phone from "@/src/models/Phone";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          message: "Invalid phone ID",
        },
        {
          status: 400,
        }
      );
    }

    const phone = await Phone.findById(id);

    if (!phone) {
      return NextResponse.json(
        {
          message: "Phone not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(phone, {
      status: 200,
    });
  } catch (error) {
    console.error("Failed to fetch phone:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch phone",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          message: "Invalid phone ID",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const updatedPhone = await Phone.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPhone) {
      return NextResponse.json(
        {
          message: "Phone not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(updatedPhone, {
      status: 200,
    });
  } catch (error) {
    console.error("Failed to update phone:", error);

    return NextResponse.json(
      {
        message: "Failed to update phone",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          message: "Invalid phone ID",
        },
        {
          status: 400,
        }
      );
    }

    const deletedPhone = await Phone.findByIdAndDelete(id);

    if (!deletedPhone) {
      return NextResponse.json(
        {
          message: "Phone not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Phone deleted successfully",
        phone: deletedPhone,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed to delete phone:", error);

    return NextResponse.json(
      {
        message: "Failed to delete phone",
      },
      {
        status: 500,
      }
    );
  }
}