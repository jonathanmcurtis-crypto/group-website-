import type { Config } from "tailwindcss";
const config: Config = { content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"], theme: { extend: { colors: { ink: "#172033", wayfare: "#2364aa", lagoon: "#2a9d8f", sunset: "#f4a261" } } }, plugins: [] };
export default config;
