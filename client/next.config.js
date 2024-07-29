/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	output: "standalone",
	experimental: {
		outputStandalone: true,
	},
	typescript: {
		// TODO: remove when possible, added just for quickfix for docker
		ignoreBuildErrors: true,
	},
};

module.exports = nextConfig;
