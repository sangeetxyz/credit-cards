import { NextResponse } from "next/server";
import { rerollCardColor } from "@/lib/db/cards";
import { formatDbError } from "@/lib/db";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const card = await rerollCardColor(id);

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    return NextResponse.json(card);
  } catch (error) {
    return NextResponse.json({ error: formatDbError(error) }, { status: 500 });
  }
}
