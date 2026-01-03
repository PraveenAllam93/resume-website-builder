import { json } from '@sveltejs/kit';
import { FILE_UPLOAD_URL } from '$env/static/private';

export async function POST({ request }) {
  try {
    const payload = await request.json();

    const res = await fetch(`${FILE_UPLOAD_URL}/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      return json(err ?? { detail: "Backend failed" }, { status: res.status });
    }

    const data = await res.json();

    return json({ data });

   } catch (e) {
    return json({ detail: (e instanceof Error ? e.message : "Server error") }, { status: 500 });
  }
}