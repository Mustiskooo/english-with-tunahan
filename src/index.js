import { uploadFiles } from "@huggingface/hub";

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
        version: "2.0"
      });
    }

    if (url.pathname === "/upload") {
      if (request.method !== "POST") {
        return json({
          success: false,
          error: "Only POST requests are allowed."
        }, 405);
      }

      try {
        const hfToken = env.HF_TOKEN;
        const repo = env.HF_REPO;
        const repoType = env.HF_REPO_TYPE || "dataset";

        if (!hfToken || !repo) {
          return json({
            success: false,
            error: "HF_TOKEN or HF_REPO is missing. Pleasec contact Developer Team."
          }, 500);
        }

        const form = await request.formData();

        const grade = form.get("grade");
        const unit = form.get("unit");
        const commitMessage =
          form.get("commit_message") ||
          `Upload files for Grade ${grade} - Unit ${unit}`;

        const files = form.getAll("files");

        if (!grade || !unit) {
          return json({
            success: false,
            error: "Missing grade or unit."
          }, 400);
        }

        if (!files.length) {
          return json({
            success: false,
            error: "No files received."
          }, 400);
        }

        const uploadList = [];

        for (const file of files) {
          if (!(file instanceof File)) {
            return json({
              success: false,
              error: "Invalid file received."
            }, 400);
          }

          uploadList.push({
            path: `grade-${grade}/${unit}/${file.name}`,
            content: file
          });
        }

        const result = await uploadFiles({
          repo: {
            type: repoType,
            name: repo
          },
          accessToken: hfToken,
          files: uploadList,
          commitTitle: commitMessage
        });

        return json({
          success: true,
          message: "Files successfully uploaded!",
          totalFiles: files.length,
          commitUrl: result.commitUrl || result.url || null
        });
      } catch (error) {
        console.error("HF_UPLOAD_ERROR:", error);

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
