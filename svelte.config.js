// svelte.config.js
import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(), // หรือ adapter({ pages: 'build', assets: 'build' })
		prerender: {
			entries: ['*'], // <-- แทนที่ default
			crawl: true // ค้นหา routes อัตโนมัติ (ถ้าต้องการ)
		}
	}
};

export default {
	define: {
		'import.meta.env.VITE_LIFF_ID': JSON.stringify(process.env.VITE_LIFF_ID)
	}
};
