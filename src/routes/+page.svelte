<script>
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import liff from '@line/liff';
	import axios from 'axios';
	import { get } from 'svelte/store';

	let scannedCode = 'No code scanned yet.';
	let liffInitialized = false;
	let profileID = '';
	let responseQR;
	const LIFF_ID = import.meta.env.VITE_LIFF_ID;

	onMount(() => {
		liffInitialization();
	});

	async function liffInitialization() {
		try {
			await liff.init({ liffId: LIFF_ID });
			if (!liff.isLoggedIn()) {
				liff.login();
			} else {
				liffInitialized = true;
				const profile = await liff.getProfile();
				//console.log(profile);
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
			responseQR = response.data;
		} catch (error) {
			console.log(error);
		}
	}
</script>

<div class="container mx-auto max-w-xl p-3">
	<!-- <p class="mb-3 text-center text-xs text-gray-600">{scannedCode}</p> -->
	{#if responseQR && responseQR.logmeter && responseQR.logmeter.datarow}
		<div class="header mb-2 rounded-lg border-t-4 border-red-500 bg-white p-4 shadow-md">
			<h2 class="mb-3 border-b pb-2 text-xl font-extrabold text-gray-800">
				ข้อมูลมิเตอร์จากการแสกนคิวอาร์โค้ด
			</h2>

			<div class="divide-y divide-gray-200">
				<div class="grid grid-cols-3 bg-gray-50 py-1.5 text-xs">
					<div class="font-bold text-gray-700">Meter ID</div>
					<div class="text-center text-gray-700">:</div>
					<div class="text-right text-gray-700">{responseQR.meter_id}</div>
				</div>
				<div class="grid grid-cols-3 py-1.5 text-xs">
					<div class="font-bold text-gray-700">Meter Serial</div>
					<div class="text-center text-gray-700">:</div>
					<div class="text-right text-gray-700">{responseQR.meter_serial}</div>
				</div>
				<div class="grid grid-cols-3 bg-gray-50 py-1.5 text-xs">
					<div class="font-bold text-gray-700">Meter Code</div>
					<div class="text-center text-gray-700">:</div>
					<div class="text-right text-gray-700">{responseQR.meter_code}</div>
				</div>
				<div class="grid grid-cols-3 bg-gray-50 py-1.5 text-xs">
					<div class="font-bold text-gray-700">Meter type</div>
					<div class="text-center text-gray-700">:</div>
					<div class="text-right text-gray-700">{responseQR.meter_type_name}</div>
				</div>
				<div class="grid grid-cols-3 py-1.5 text-xs">
					<div class="font-bold text-gray-700">Last Reading</div>
					<div class="text-center text-gray-700">:</div>
					<div class="text-right font-medium text-gray-700">{responseQR.lastreading}</div>
				</div>
				<div class="grid grid-cols-3 bg-gray-50 py-1.5 text-xs">
					<div class="font-bold text-gray-700">Reading Date</div>
					<div class="text-center text-gray-700">:</div>
					<div class="text-right text-gray-700">{responseQR.reading_date}</div>
				</div>
				<div class="grid grid-cols-3 py-1.5 text-xs">
					<div class="font-bold text-gray-700">Unit No.</div>
					<div class="text-center text-gray-700">:</div>
					<div class="text-right text-gray-700">{responseQR.unitno}</div>
				</div>
				<div class="grid grid-cols-3 bg-gray-50 py-1.5 text-xs">
					<div class="font-bold text-gray-700">Contract No.</div>
					<div class="text-center text-gray-700">:</div>
					<div class="text-right text-gray-700">{responseQR.contract_no}</div>
				</div>
				<div class="grid grid-cols-3 py-1.5 text-xs">
					<div class="font-bold text-gray-700">Customer name</div>
					<div class="text-center text-gray-700">:</div>
					<div class="text-right text-gray-700">{responseQR.customer_name}</div>
				</div>
				<div class="grid grid-cols-3 py-1.5 text-xs">
					<div class="font-bold text-gray-700">Bus/ID</div>
					<div class="text-center text-gray-700">:</div>
					<div class="text-right text-gray-700">{responseQR.busid}</div>
				</div>
			</div>
		</div>

		---

		<h3 class="mb-2 text-lg font-bold text-gray-800">ประวัติการอ่านค่าย้อนหลัง 7 วัน</h3>
		<div class="overflow-x-auto rounded-lg pb-16 shadow-md">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th
							scope="col"
							class="px-3 py-2 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase"
						>
							ลำดับ
						</th>
						<th
							scope="col"
							class="px-3 py-2 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase"
						>
							วันที่/เวลาอ่านค่า
						</th>
						<th
							scope="col"
							class="px-3 py-2 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase"
						>
							ค่ามิเตอร์
						</th>
					</tr>
				</thead>

				<tbody class="divide-y divide-gray-200 bg-white">
					{#each responseQR.logmeter.datarow as row, index}
						<tr class="{index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-red-50/50">
							<td class="px-3 py-2 text-xs font-medium whitespace-nowrap text-gray-900">
								{index + 1}
							</td>
							<td class="px-3 py-2 text-xs whitespace-nowrap text-gray-600">
								{row.reading_time}
							</td>
							<td
								class="px-3 py-2 text-right text-xs font-semibold whitespace-nowrap text-gray-800"
							>
								{parseFloat(row.meter_reading).toLocaleString('th-TH', {
									minimumFractionDigits: 2
								})}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<div class="header mb-2 rounded-lg border-t-4 border-red-500 bg-white p-4 shadow-md">
			<div class="flex min-h-[50vh] w-full items-center justify-center bg-white">
				<div
					class="scanner-container relative flex h-[300px] w-[300px] items-center justify-center"
				>
					<div
						class="scanner-frame relative flex h-[220px] w-[220px] items-center justify-center rounded-xl border-4 border-[rgba(0,0,0,0.2)] bg-gray-100 shadow-xl"
					>
						<div class="corner-bottom-left"></div>
						<div class="corner-bottom-right"></div>

						<div class="scanner-line"></div>

						<div
							class="qr-pulse-box flex h-3/5 w-3/5 items-center justify-center overflow-hidden rounded-lg border border-gray-300 bg-white p-2"
						>
							<img src="qr-code-svgrepo-com.svg" alt="QR Icon" />
						</div>
					</div>
				</div>
			</div>
			<div class="text-center text-2xl font-bold text-gray-600">
				แสกนคิวอาร์โค้ด เพื่อตรวจสอบข้อมูลมิเตอร์
			</div>
		</div>
	{/if}
	<div class="fixed right-0 bottom-0 left-0 z-50 w-full bg-white p-4 shadow-lg">
		<button
			on:click={scanQRCode}
			class="btn-hover w-full rounded-lg bg-red-500 py-3 text-lg font-bold text-white shadow-md transition duration-300 ease-in-out hover:bg-red-600"
		>
			Scan QR Code
		</button>
	</div>
</div>

<style>
	/* Raw CSS สำหรับมุมกรอบ (Corners) */
	.scanner-frame::before,
	.scanner-frame::after {
		content: '';
		position: absolute;
		width: 24px;
		height: 24px;
		border-color: #4caf50; /* Green */
		border-style: solid;
	}

	.scanner-frame::before {
		top: -4px;
		left: -4px;
		border-width: 4px 0 0 4px;
	}

	.scanner-frame::after {
		top: -4px;
		right: -4px;
		border-width: 4px 4px 0 0;
	}

	.corner-bottom-left,
	.corner-bottom-right {
		position: absolute;
		width: 24px;
		height: 24px;
		border-style: solid;
		border-color: #4caf50; /* Green */
	}

	.corner-bottom-left {
		bottom: -4px;
		left: -4px;
		border-width: 0 0 4px 4px;
	}

	.corner-bottom-right {
		bottom: -4px;
		right: -4px;
		border-width: 0 4px 4px 0;
	}

	/* Scanner Line Animation */
	.scanner-line {
		position: absolute;
		width: 100%;
		height: 4px;
		background: linear-gradient(90deg, transparent, #4caf50, transparent);
		border-radius: 2px;
		animation: scan 2s linear infinite;
		box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
	}

	@keyframes scan {
		0% {
			top: 0;
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		90% {
			opacity: 1;
		}
		100% {
			top: 100%;
			opacity: 0;
		}
	}

	/* QR Image/Box Pulse Animation */
	.qr-pulse-box {
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0% {
			transform: scale(0.9);
			box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
		}
		70% {
			transform: scale(1);
			box-shadow: 0 0 0 15px rgba(76, 175, 80, 0);
		}
		100% {
			transform: scale(0.9);
			box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
		}
	}

	/* Responsive adjustments */
	@media (max-width: 480px) {
		.scanner-container {
			width: 280px;
			height: 280px;
		}
		.scanner-frame {
			width: 200px;
			height: 200px;
		}
	}
</style>
