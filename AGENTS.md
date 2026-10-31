# Ayneh project workflow

- This project is the independently rebuilt Ayneh hair consultation application.
- Keep the GitHub repository synchronized with every user-requested code change. Commit and push the validated source to GitHub before reporting completion. If blocked, clearly report that GitHub is not synchronized.
- Preserve the Sites project identity in .openai/hosting.json and its private audience. Sites remains the deployment target; GitHub stores source and runs validation, not the production Worker.
- Never commit API keys, credentials, customer photos, generated customer output or local environment files.
- Run bash scripts/build.sh and node scripts/validate-artifact.mjs before publishing.
- Do not claim live KIE generation has been tested without a successful real request.
