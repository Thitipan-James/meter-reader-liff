import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	// server: {
	// 	host: '192.168.3.230',
	// 	port: 5172
	// }
	// server: {
	// 	// 👇 Allow your ngrok URL
	// 	allowedHosts: ['0ce0888e723a.ngrok-free.app'],
	// 	// Optional: set a custom port or other server options
	// 	port: 5172,
	// 	strictPort: true
	// }
});
