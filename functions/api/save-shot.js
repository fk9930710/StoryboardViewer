export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();

    const {
      filename,
      content
    } = body;

    const owner = env.GITHUB_OWNER;
    const repo = env.GITHUB_REPO;
    const token = env.GITHUB_TOKEN;

    const path = `shots/${filename}`;

    const githubURL =
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    const encoded = btoa(unescape(encodeURIComponent(content)));

    const res = await fetch(githubURL, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: `upload ${filename}`,
        content: encoded
      })
    });

    const data = await res.json();

    return Response.json({
      success: true,
      github: data.content?.html_url
    });

  } catch (err) {

    return Response.json({
      success: false,
      error: err.message
    });
  }
}
