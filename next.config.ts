import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	webpack: (config) => {
		config.module.rules.push({
			test: /\.md$/,
			type: "asset/source",
		});
		return config;
	},
};

export default nextConfig;

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
