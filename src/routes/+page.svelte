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
		//liffInitialization();
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
				ข้อมูลมิเตอร์ (Meter Details)
			</h2>

			<div class="divide-y divide-gray-200">
				<div class="grid grid-cols-2 bg-gray-50 py-1.5 text-xs">
					<div class="font-bold text-gray-700">รหัสมิเตอร์ (meter_id):</div>
					<div class="text-right text-gray-700">{responseQR.meter_id}</div>
				</div>
				<div class="grid grid-cols-2 py-1.5 text-xs">
					<div class="font-bold text-gray-700">ซีเรียลมิเตอร์ (meter_serial):</div>
					<div class="text-right text-gray-700">{responseQR.meter_serial}</div>
				</div>
				<div class="grid grid-cols-2 bg-gray-50 py-1.5 text-xs">
					<div class="font-bold text-gray-700">รหัสมิเตอร์ (meter_code):</div>
					<div class="text-right text-gray-700">{responseQR.meter_code}</div>
				</div>
				<div class="grid grid-cols-2 py-1.5 text-xs">
					<div class="font-bold text-gray-700">อ่านล่าสุด (lastreading):</div>
					<div class="text-right font-medium text-gray-700">{responseQR.lastreading}</div>
				</div>
				<div class="grid grid-cols-2 bg-gray-50 py-1.5 text-xs">
					<div class="font-bold text-gray-700">วันที่อ่าน (reading_date):</div>
					<div class="text-right text-gray-700">{responseQR.reading_date}</div>
				</div>
				<div class="grid grid-cols-2 py-1.5 text-xs">
					<div class="font-bold text-gray-700">หน่วย (unitno):</div>
					<div class="text-right text-gray-700">{responseQR.unitno}</div>
				</div>
				<div class="grid grid-cols-2 bg-gray-50 py-1.5 text-xs">
					<div class="font-bold text-gray-700">เลขสัญญา (contract_no):</div>
					<div class="text-right text-gray-700">{responseQR.contract_no}</div>
				</div>
				<div class="grid grid-cols-2 py-1.5 text-xs">
					<div class="font-bold text-gray-700">ชื่อลูกค้า (customer_name):</div>
					<div class="text-right text-gray-700">{responseQR.customer_name}</div>
				</div>
				<div class="grid grid-cols-2 py-1.5 text-xs">
					<div class="font-bold text-gray-700">Bus ID:</div>
					<div class="text-right text-gray-700">{responseQR.busid}</div>
				</div>
				<div class="grid grid-cols-2 bg-gray-50 py-1.5 text-xs">
					<div class="font-bold text-gray-700">ชื่อประเภทมิเตอร์ (meter_type_name):</div>
					<div class="text-right text-gray-700">{responseQR.meter_type_name}</div>
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
			<h2 class="mb-3 border-b pb-2 text-xl font-extrabold text-gray-800">
				ข้อมูลมิเตอร์ (Meter Details)
			</h2>

			<div class="divide-y divide-gray-200">
				<div class="grid grid-cols-2 bg-gray-50 py-1.5 text-xs">
					<div class="font-bold text-gray-700">รหัสมิเตอร์ (meter_id):</div>
					<div class="text-right text-gray-700"></div>
				</div>
				<div class="grid grid-cols-2 py-1.5 text-xs">
					<div class="font-bold text-gray-700">ซีเรียลมิเตอร์ (meter_serial):</div>
					<div class="text-right text-gray-700"></div>
				</div>
				<div class="grid grid-cols-2 bg-gray-50 py-1.5 text-xs">
					<div class="font-bold text-gray-700">รหัสมิเตอร์ (meter_code):</div>
					<div class="text-right text-gray-700"></div>
				</div>
				<div class="grid grid-cols-2 py-1.5 text-xs">
					<div class="font-bold text-gray-700">อ่านล่าสุด (lastreading):</div>
					<div class="text-right font-medium text-gray-700"></div>
				</div>
				<div class="grid grid-cols-2 bg-gray-50 py-1.5 text-xs">
					<div class="font-bold text-gray-700">วันที่อ่าน (reading_date):</div>
					<div class="text-right text-gray-700"></div>
				</div>
				<div class="grid grid-cols-2 py-1.5 text-xs">
					<div class="font-bold text-gray-700">หน่วย (unitno):</div>
					<div class="text-right text-gray-700"></div>
				</div>
				<div class="grid grid-cols-2 bg-gray-50 py-1.5 text-xs">
					<div class="font-bold text-gray-700">เลขสัญญา (contract_no):</div>
					<div class="text-right text-gray-700"></div>
				</div>
				<div class="grid grid-cols-2 py-1.5 text-xs">
					<div class="font-bold text-gray-700">ชื่อลูกค้า (customer_name):</div>
					<div class="text-right text-gray-700"></div>
				</div>
				<div class="grid grid-cols-2 py-1.5 text-xs">
					<div class="font-bold text-gray-700">Bus ID:</div>
					<div class="text-right text-gray-700"></div>
				</div>
				<div class="grid grid-cols-2 bg-gray-50 py-1.5 text-xs">
					<div class="font-bold text-gray-700">ชื่อประเภทมิเตอร์ (meter_type_name):</div>
					<div class="text-right text-gray-700"></div>
				</div>
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
