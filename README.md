# Website Worker
![Deploy](https://github.com/jamesridgway/website-worker/workflows/Deploy/badge.svg?branch=master)

Cloudflare worker to serve up Ghost(Pro) and apply relevant security headers.

## Getting Started
1. Install and configure [wrangler](https://github.com/cloudflare/wrangler)
2. Configure `wrangler.toml`. Ensure you set the `route`, `zone_id` and `action_id` to values that suite your setup. Some of these can be supplied via [environment variables](https://developers.cloudflare.com/workers/tooling/wrangler/configuration). 
3. Publish with wrangler:

       wrangler publish
