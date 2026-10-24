/// <reference path="./.sst/platform/config.d.ts" />

/**
 * greige-atelier — interior design studio template.
 *
 * Static Astro 7 site on S3 + CloudFront via SST v3.
 *
 *   npm run deploy                  # dev stage (your AWS account)
 *   npm run deploy:production       # production stage
 *
 * Deploy is the owner's step (their AWS credentials) — this repo is
 * deploy-ready, not deployed.
 */
export default $config({
  app(input) {
    return {
      name: "greige-atelier",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const site = new sst.aws.Astro("Site", {
      path: ".",
    });
    return { url: site.url };
  },
});
