import { NextResponse } from "next/server";
import { CheckError, checkProduct } from "@/lib/checkProduct";

// Live checks can take a few minutes while Bright Data searches Amazon.
export const maxDuration = 300;

export async function POST(request: Request) {
  const { url } = await request.json().catch(() => ({}));
  if (typeof url !== "string" || !url) {
    return NextResponse.json({ error: "Paste an Amazon product link." }, { status: 400 });
  }

  try {
    return NextResponse.json(await checkProduct(url));
  } catch (err) {
    if (err instanceof CheckError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("Link check failed:", err);
    return NextResponse.json(
      { error: "Something went wrong looking up that product. Try again in a minute." },
      { status: 502 },
    );
  }
}
