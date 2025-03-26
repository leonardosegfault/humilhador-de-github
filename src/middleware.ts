import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import redis from "./services/redis";

let ratelimit: Ratelimit;
if (redis) {
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1m"),
    enableProtection: true,
  });
}

export const config = {
  matcher: "/api/analyze",
};

export async function middleware(req: NextRequest) {
  if (req.method != "POST") return NextResponse.redirect(new URL("/", req.url));
  if (!redis) return; // Ratelimiting desativado

  const ip = req.headers.get("x-forwarded-for");
  if (!ip) {
    return NextResponse.json(
      {
        error: "Não foi possível checar a veracidade da sua análise.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        {
          error: "Você está realizando muitas análises em pouco tempo!",
        },
        {
          status: 429,
        }
      );
    }
  } catch {
    return NextResponse.json(
      {
        error: "O servidor encontra-se sobrecarregado :(",
      },
      {
        status: 503,
      }
    );
  }
}
