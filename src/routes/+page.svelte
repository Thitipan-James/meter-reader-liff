<script>
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import liff from '@line/liff';

	let scannedCode = 'No code scanned yet.';
	let liffInitialized = false;
	onMount(() => {
		liffInitialization();
	});
	const LIFF_ID = import.meta.env.VITE_LIFF_ID;
	async function liffInitialization() {
		try {
			await liff.init({ liffId: LIFF_ID });
			if (!liff.isLoggedIn()) {
				liff.login();
			} else {
				liffInitialized = true;
			}
		} catch (error) {
			console.log('LIFF init error', error);
		}
	}
	async function scanQRCode() {
		if (!liffInitialized) {
			scannedCode = 'LIFF not initialized.';
			return;
		}

		try {
			// Check if QR scanner is available
			if (!liff.isApiAvailable('scanCodeV2')) {
				scannedCode = 'QR scanner not available on this device.';
				return;
			}

			const result = await liff.scanCodeV2();
			scannedCode = result.value;
		} catch (error) {
			console.error('Error scanning code:', error);
			scannedCode = `Scan failed: ${error.message}`;
		}
	}
	async function test() {
		window.location.href = 'https://line.me/R/nv/QRCodeReader';
	}
</script>

<div>
	<p>Hell o</p>
	<button on:click={scanQRCode} class="btn-hover w-full rounded-lg bg-red-300">
		Scan QR Code
	</button>
</div>
