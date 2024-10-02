import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: "autoUpdate",
			manifest: {
				name: "Chat screen",
				short_name: "Chat screen",
				description: "",
				theme_color: "#ffffff",
				icons: [
					{
						src: "icons/manifest-icon-192.maskable.png",
						sizes: "192x192",
						type: "image/png",
						purpose: "any",
					},
					{
						src: "icons/manifest-icon-192.maskable.png",
						sizes: "192x192",
						type: "image/png",
						purpose: "maskable",
					},
					{
						src: "icons/manifest-icon-512.maskable.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any",
					},
					{
						src: "icons/manifest-icon-512.maskable.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
					},
				],
			},
			workbox: {
				runtimeCaching: [
					{
						urlPattern: ({ request }) => request.destination === "image",
						handler: "CacheFirst",
						options: {
							cacheName: "images-cache",
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
							},
						},
					},
					{
						urlPattern: ({ request }) =>
							request.destination === "script" ||
							request.destination === "style",
						handler: "StaleWhileRevalidate",
						options: {
							cacheName: "static-resources",
						},
					},
				],
			},
		}),
	],
});
