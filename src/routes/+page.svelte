<script>
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import liff from '@line/liff';
	import axios from 'axios';
	import { get } from 'svelte/store';

	let scannedCode = 'No code scanned yet.';
	let liffInitialized = false;
	let profileID = '';

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
				const profile = await liff.getProfile();
				console.log(profile);
				profileID = profile.userId;
			}
		} catch (error) {
			console.log('LIFF init error', error);
		}
	}
	function checkLiffReady() {
		if (!liffInitialized) return 'LIFF not initialized.';
		if (!liff.isApiAvailable('scanCodeV2')) return 'QR scanner not available on this device.';
		return null;
	}

	async function scanQRCode() {
		const errorMessage = checkLiffReady();
		if (errorMessage) {
			return (scannedCode = errorMessage);
		}

		try {
			//const { value } = await liff.scanCodeV2();
			//scannedCode = value;

			const resultofScan = await liff.scanCodeV2();
			scannedCode = resultofScan.value;
			const stringifiedResult = JSON.stringify(resultofScan);
			await getresultOfScan(stringifiedResult);
		} catch (error) {
			console.error('Error scanning code:', error);
			scannedCode = `Scan failed: ${error.message}`;
		}
	}

	async function getresultOfScan(stringifiedResult) {
		try {
			const response = await axios({
				method: 'get',
				url: 'https://rms.ssdapp.net/meter-bot',
				params: {
					select: 'meter-qrscan',
					id: stringifiedResult,
					line_user_id: profileID
				}
			});
			console.log(response.data);
		} catch (error) {
			console.log(error);
		}
	}
</script>

<div>
	<p>Hello</p>
	<button on:click={scanQRCode} class="btn-hover w-full rounded-lg bg-red-300">
		Scan QR Code
	</button>
	<p>{scannedCode}</p>
</div>
