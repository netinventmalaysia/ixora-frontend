import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const upstream = await fetch("https://psmbmbapi.mbmb.gov.my/api/ev-charging-stations", {
      cache: "no-store",
    });

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: true, status: upstream.status });
    }

    const data = await upstream.json();
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json(data);
  } catch (e: any) {
    console.error("Proxy EV error", e);
    return res.status(502).json({ error: true, message: "Upstream fetch failed" });
  }
}
