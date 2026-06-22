import { NextResponse } from "next/server";
import { deleteCreditCard, updateCreditCard } from "@/lib/db/cards";
import { formatDbError } from "@/lib/db";
import type { CardFormData } from "@/lib/types";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = (await request.json()) as CardFormData;
    const card = await updateCreditCard(id, data);

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    return NextResponse.json(card);
  } catch (error) {
    return NextResponse.json(
      {
        error: formatDbError(error),
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const deleted = await deleteCreditCard(id);

    if (!deleted) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: formatDbError(error),
      },
      { status: 500 },
    );
  }
}
