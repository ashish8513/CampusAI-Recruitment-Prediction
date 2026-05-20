import { NextRequest, NextResponse } from "next/server";

const BACKEND =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:4000";

async function proxy(req: NextRequest, path: string[]) {
  const sub = path.join("/");
  const url = `${BACKEND.replace(/\/$/, "")}/api/${sub}${req.nextUrl.search}`;

  try {
    const init: RequestInit = {
      method: req.method,
      headers: { "Content-Type": "application/json" },
    };
    if (req.method !== "GET" && req.method !== "HEAD") {
      init.body = await req.text();
    }
    const res = await fetch(url, init);
    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("Content-Type") || "application/json" },
    });
  } catch (e) {
    return NextResponse.json(
      {
        error: "Backend unavailable",
        detail: String(e),
        hint: "Set BACKEND_URL on Vercel to your API (Render/Railway) or run docker-compose locally",
      },
      { status: 503 }
    );
  }
}

export async function GET(req: NextRequest, ctx: { params: { path: string[] } }) {
  return proxy(req, ctx.params.path);
}

export async function POST(req: NextRequest, ctx: { params: { path: string[] } }) {
  return proxy(req, ctx.params.path);
}
