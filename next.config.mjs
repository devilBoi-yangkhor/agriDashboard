/** @type {import('next').NextConfig} */
const nextConfig = {
    skipTrailingSlashRedirect: true,
    trailingSlash: true,
    output: 'export',
    async headers() {
        return [
            {
                // Apply to all routes
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'same-origin',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: "frame-ancestors 'none';",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
