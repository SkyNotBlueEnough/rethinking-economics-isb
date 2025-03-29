/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
	images: {
		remotePatterns: [
			{
				hostname: "substack-post-media.s3.amazonaws.com",
			},
			{
				hostname: "substackcdn.com",
			},
			{
				hostname: "images.unsplash.com",
			},
			{
				hostname: "i.ibb.co",
			},
		],
	},
};

export default config;
