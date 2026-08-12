export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: cors()
      });
    }

    if (url.pathname === "/") {
      return json({
        success: true,
        api: "EnglishWithTunahan API",
        version: "3.0"
      });
    }

    if (url.pathname === "/debug-env") {
      return json({
        hfTokenExists: !!env.HF_TOKEN,
        hfRepoExists: !!env.HF_REPO,
        hfRepoType: env.HF_REPO_TYPE || "dataset"
      });
    }

    if (url.pathname === "/upload") {
      if (request.method !== "POST") {
        return json({
          success: false,
          error: "Only POST requests are allowed."
        }, 405);
      }

      const hfToken = env.HF_TOKEN;
      const repo = env.HF_REPO;

      if (!hfToken || !repo) {
        return json({
          success: false,
          error: "HF_TOKEN or HF_REPO is missing."
        }, 500);
      }

      try {
        const grade = url.searchParams.get("grade");
        const unit = url.searchParams.get("unit");
        const filename = url.searchParams.get("filename");

        if (!grade || !unit || !filename) {
          return json({
            success: false,
            error: "Missing grade, unit or filename."
          }, 400);
        }

        const path = `grade-${grade}/${unit}/${filename}`;

        const hfUrl =
          `https://huggingface.co/api/datasets/${repo}/upload/${encodeURIComponent(path)}`;

        const response = await fetch(hfUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${hfToken}`,
            "Content-Type": request.headers.get("Content-Type") || "application/octet-stream"
          },
          body: request.body
        });

        const text = await response.text();

        if (!response.ok) {
          return json({
            success: false,
            error: `Hugging Face returned ${response.status}`,
            details: text
          }, 502);
        }

        return json({
          success: true,
          message: "File successfully uploaded!",
          path,
          response: text
        });
      } catch (error) {
        console.error("HF_UPLOAD_ERROR", error);

        return json({
          success: false,
          error: error instanceof Error
            ? error.message
            : String(error)
        }, 500);
      }
    }

    return json({
      success: false,
      error: "Not Found"
    }, 404);
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...cors()
    }
  });
}

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
  };
}
