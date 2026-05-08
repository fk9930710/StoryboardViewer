export async function onRequestPost(context) {

  try {

    const body =
      await context.request.json()

    const shotId =
      body.shotId

    const data =
      body.data

    if (!shotId || !data) {

      return new Response(
        "Missing data",
        { status: 400 }
      )

    }

    const GITHUB_TOKEN =
      context.env.GITHUB_TOKEN

    const GITHUB_OWNER =
      context.env.GITHUB_OWNER

    const GITHUB_REPO =
      context.env.GITHUB_REPO

    const GITHUB_BRANCH =
      context.env.GITHUB_BRANCH || "main"

    const path =
      `shots/${shotId}.json`

    const githubUrl =
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`

    // EXISTING FILE

    const existing =
      await fetch(githubUrl, {

        headers: {

          Authorization:
            `token ${GITHUB_TOKEN}`

        }

      })

    if (!existing.ok) {

      return new Response(
        "Shot file not found",
        { status: 404 }
      )

    }

    const existingJson =
      await existing.json()

    const sha =
      existingJson.sha

    const content =
      btoa(
        unescape(
          encodeURIComponent(
            JSON.stringify(data, null, 2)
          )
        )
      )

    // SAVE TO GITHUB

    const githubResponse =
      await fetch(githubUrl, {

        method: "PUT",

        headers: {

          Authorization:
            `token ${GITHUB_TOKEN}`,

          "Content-Type":
            "application/json"

        },

        body: JSON.stringify({

          message:
            `update ${shotId}`,

          content,

          sha,

          branch:
            GITHUB_BRANCH

        })

      })

    const result =
      await githubResponse.text()

    return new Response(result, {

      status: githubResponse.status

    })

  } catch (err) {

    return new Response(
      err.toString(),
      { status: 500 }
    )

  }

}
