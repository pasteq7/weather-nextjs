import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

// Point the plugin to your i18n configuration file.
const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  webpack: (config) => {
    // Handle SVG files with SVGR (as React components), excluding favicon.ico
    config.module.rules.push({
      test: /\.svg$/,
      exclude: /favicon\.ico$/,
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

export default withNextIntl(nextConfig);