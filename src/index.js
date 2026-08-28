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
        version: "4.0"
      });
    }

    if (url.pathname === "/debug-env") {
      return json({
        hfTokenExists: !!env.HF_TOKEN,
        hfRepoExists: !!env.HF_REPO,
        hfRepoType: env.HF_REPO_TYPE || "dataset"
      });
    }

    if (url.pathname !== "/upload") {
      return json({
        success: false,
        error: "Not Found"
      }, 404);
    }

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
      const sha256 = url.searchParams.get("sha256");
      const size = Number(url.searchParams.get("size"));

      if (!grade || !unit || !filename || !sha256 || !Number.isSafeInteger(size)) {
        return json({
          success: false,
          error: "Missing or invalid upload metadata."
        }, 400);
      }

      const path = `grade-${grade}/${unit}/${filename}`;

      const lfsUrl =
        `https://huggingface.co/datasets/${repo}.git/info/lfs/objects/batch`;

      const batchResponse = await fetch(lfsUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${hfToken}`,
          "Accept": "application/vnd.git-lfs+json",
          "Content-Type": "application/vnd.git-lfs+json"
        },
        body: JSON.stringify({
          operation: "upload",
          transfers: ["basic", "multipart"],
          objects: [
            {
              oid: sha256,
              size
            }
          ],
          hash_algo: "sha256",
          ref: {
            name: "main"
          }
        })
      });

      const batchText = await batchResponse.text();

      if (!batchResponse.ok) {
        return json({
          success: false,
          error: `HF LFS batch returned ${batchResponse.status}`,
          details: batchText
        }, 502);
      }

      const batch = JSON.parse(batchText);
      const object = batch.objects?.[0];

      if (!object) {
        return json({
          success: false,
          error: "Hugging Face returned no LFS object."
        }, 502);
      }

      if (object.error) {
        return json({
          success: false,
          error: `HF LFS error ${object.error.code}`,
          details: object.error.message
        }, 502);
      }

      const uploadAction = object.actions?.upload;

      if (uploadAction) {
        const uploadHeaders = new Headers();

        if (uploadAction.header) {
          for (const [key, value] of Object.entries(uploadAction.header)) {
            uploadHeaders.set(key, value);
          }
        }

        if (!uploadHeaders.has("Content-Type")) {
          uploadHeaders.set(
            "Content-Type",
            request.headers.get("Content-Type") || "application/octet-stream"
          );
        }

        const uploadResponse = await fetch(uploadAction.href, {
          method: "PUT",
          headers: uploadHeaders,
          body: request.body
        });

        if (!uploadResponse.ok) {
          const uploadText = await uploadResponse.text();

          return json({
            success: false,
            error: `HF storage upload returned ${uploadResponse.status}`,
            details: uploadText
          }, 502);
        }
      }

      const verifyAction = object.actions?.verify;

      if (verifyAction) {
        const verifyResponse = await fetch(verifyAction.href, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${hfToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            oid: sha256,
            size
          })
        });

        if (!verifyResponse.ok) {
          const verifyText = await verifyResponse.text();

          return json({
            success: false,
            error: `HF LFS verification returned ${verifyResponse.status}`,
            details: verifyText
          }, 502);
        }
      }

      const commitUrl =
        `https://huggingface.co/api/datasets/${repo}/commit/main`;

      const ndjson =
        JSON.stringify({
          key: "header",
          value: {
            summary: `Upload ${filename}`,
            description: ""
          }
        }) +
        "\n" +
        JSON.stringify({
          key: "lfsFile",
          value: {
            path,
            algo: "sha256",
            oid: sha256,
            size
          }
        }) +
        "\n";

      const commitResponse = await fetch(commitUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${hfToken}`,
          "Content-Type": "application/x-ndjson"
        },
        body: ndjson
      });

      const commitText = await commitResponse.text();

      if (!commitResponse.ok) {
        return json({
          success: false,
          error: `HF commit returned ${commitResponse.status}`,
          details: commitText
        }, 502);
      }

      return json({
        success: true,
        message: "File successfully uploaded!",
        path,
        commit: commitText
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
