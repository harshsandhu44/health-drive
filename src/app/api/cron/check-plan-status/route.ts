import { NextResponse } from "next/server";

export const GET = async () => {
  const response = await fetch(
    `https://ziccodamvuabudmpfija.supabase.co/functions/v1/check-plan-status`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }
  );

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
};
