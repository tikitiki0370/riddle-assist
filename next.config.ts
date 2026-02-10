import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async redirects() {
		return [
			{
				source: "/solver",
				destination: "/solver/magic",
				permanent: false,
			},
		];
	},
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
