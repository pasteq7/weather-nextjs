import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  webpack: (config) => {
    // Handle SVG files with SVGR (as React components)
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgProps: {
              fill: 'currentColor',
            },
            replaceAttrValues: {
              '#000': 'currentColor',
              '#fff': 'currentColor',
            },
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;