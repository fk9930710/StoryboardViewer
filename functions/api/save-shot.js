export async function onRequestPost(context) {

  try {

    const body =
      await context.request.json()

    const {
      shotId,
      imageData,
      folder
    } = body

    if (
      !shotId ||
      !imageData ||
      !folder
    ) {

      return new Response(
        "Missing fields",
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

    // remove base64 header

    const base64 =
      imageData.replace(
        /^data:image\/\w+;base64,/,
        ''
      )

    const path =
      `${folder}/${shotId}.png`

    const githubUrl =
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`

    // ========================
    // CHECK EXISTING FILE
    // ========================

    let sha = null

    const existing =
      await fetch(githubUrl, {

        headers: {

          Authorization:
            `token ${GITHUB_TOKEN}`

        }

      })

    if (existing.ok) {

      const existingJson =
        await existing.json()

      sha =
        existingJson.sha

    }

    // ========================
    // UPLOAD TO GITHUB
    // ========================

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
            `update ${path}`,

          content:
            base64,

          sha,

          branch:
            GITHUB_BRANCH

        })

      })

    const result =
      await githubResponse.text()

    console.log(result)

    return new Response(result, {

      status:
        githubResponse.status

    })

  } catch (err) {

    return new Response(

      JSON.stringify({

        error:
          err.toString()

      }),

      {

        status: 500,

        headers: {

          "Content-Type":
            "application/json"

        }

      }

    )

  }

}
