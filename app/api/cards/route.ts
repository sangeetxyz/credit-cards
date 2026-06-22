import { NextResponse } from "next/server";
import { createCreditCard, listCreditCards } from "@/lib/db/cards";
import { formatDbError } from "@/lib/db";
import type { CardFormData } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  try {
    const cards = await listCreditCards();
    return NextResponse.json(cards);
  } catch (error) {
    return NextResponse.json(
      {
        error: formatDbError(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as CardFormData;
    const card = await createCreditCard(data);
    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: formatDbError(error),
      },
      { status: 500 },
    );
  }
}
