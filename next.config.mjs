/** @type {import('next').NextConfig} */
const nextConfig = async () => {
  return {
    images: {
      domains: ["res.cloudinary.com"],
    },

    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/,
        type: "asset/resource",
      });
      return config;
    },

    trailingSlash: true,

    async rewrites() {
      return [
        {
          source: "/api/:path*",
          destination:
            "https://phplaravel-1533788-6146601.cloudwaysapps.com/:path*",
        },
        
      ];
    },
  };
};

export default nextConfig;
