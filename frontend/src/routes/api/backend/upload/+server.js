import { json } from '@sveltejs/kit';
import { FILE_UPLOAD_URL } from '$env/static/private';

export async function POST({ request }) {
  try {
    // get uploaded file from browser
    const form = await request.formData();
    const file = form.get("file");

    if (!file) {
      return json({ detail: "No file uploaded" }, { status: 400 });
    }

    // forward to FastAPI
    const backendForm = new FormData();
    backendForm.append("file", file);

    const res = await fetch(`${FILE_UPLOAD_URL}/upload`, {
      method: "POST",
      body: backendForm
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      return json(err ?? { detail: "Backend upload failed" }, { status: res.status });
    }

    const data = await res.json();

    // return RESUMEDATA to frontend
    return json({ message: "ok", data });

  } catch (e) {
    return json({ detail: (e instanceof Error ? e.message : "Server error") }, { status: 500 });
  }
}