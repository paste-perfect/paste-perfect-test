import { appendFileSync } from "node:fs";
import { assetUrls, siteUrl, validateMetadata } from "./deployment-policy.mjs";
const get = async (url, headers = {}) => {
  const response = await fetch(url, {
    headers: { "Cache-Control": "no-cache", ...headers },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response;
};
const metadata = await (await get(`${siteUrl}deployment.json`)).json();
const sha = validateMetadata(metadata);
const html = await (await get(siteUrl)).text();
await Promise.all(
  assetUrls(html).map(async (url) => {
    const response = await get(url);
    if (response.headers.get("content-type")?.includes("text/html"))
      throw new Error(`${url} returned HTML instead of an asset.`);
  }),
);
const headers = process.env.GH_TOKEN
  ? { Authorization: `Bearer ${process.env.GH_TOKEN}` }
  : {};
const runs = await (
  await get(
    `https://api.github.com/repos/paste-perfect/paste-perfect/actions/workflows/ci.yml/runs?head_sha=${sha}&event=push&branch=dev&status=success`,
    headers,
  )
).json();
if (
  !runs.workflow_runs?.some(
    (run) =>
      run.head_sha === sha &&
      run.head_repository.full_name === metadata.repository,
  )
)
  throw new Error("Deployed commit has no successful dev CI run.");
console.log(`Verified preview ${sha}, its CI run and published assets.`);
if (process.env.GITHUB_OUTPUT)
  appendFileSync(process.env.GITHUB_OUTPUT, `sha=${sha}\n`);
