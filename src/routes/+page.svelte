<script>
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import liff from '@line/liff';
	import axios from 'axios';
	import { get } from 'svelte/store';

	let scannedCode = 'No code scanned yet.';
	let liffInitialized = false;
	let profileID = '';
	// 1. JSON‑string ที่คุณได้รับ
	const jsonString = `{
		"status":"success",
		"meter_id":"ME-SDB-078",
		"meter_serial":"15310280",
		"meter_code":"ME-SDB-OFT2.F1001-2",
		"lastreading":"45524.3200",
		"reading_date":"01/10/2025",
		"unitno":"SDB-OF.T2.F1001",
		"contract_no":"เฝ้าระวัง",
		"customer_name":"เฝ้าระวัง",
		"meter_type_id":"1",
		"mbus_id":"15",
		"meter_config_id":"2",
		"busid":"15/2",
		"meter_type_name":"ไฟฟ้า",
		"logmeter":{
			"datarow":[
			{"reading_time":"30/09/2025 23:00:01","meter_reading":"45524.3200"},
			{"reading_time":"29/09/2025 23:00:02","meter_reading":"45524.3200"},
			{"reading_time":"28/09/2025 23:00:02","meter_reading":"45524.3200"},
			{"reading_time":"27/09/2025 23:00:01","meter_reading":"45524.3200"},
			{"reading_time":"26/09/2025 23:00:02","meter_reading":"45524.3200"},
			{"reading_time":"25/09/2025 23:00:01","meter_reading":"45524.3200"},
			{"reading_time":"24/09/2025 23:00:01","meter_reading":"45524.3200"}
			]
		}
		}`;

	// 2. แปลงเป็น Object
	const meterObj = JSON.parse(jsonString);
	// console.log(meterObj.logmeter);
	// const dataEntries = Object.entries(meterObj);
	// console.log('dataEntries', dataEntries);
	// const dataEntriesTwo = Object.entries(meterObj.logmeter.datarow[0]);
	// console.log('dataEntriesTwo', dataEntriesTwo);

	// // 3. ใช้งานตัวแปร meterObj
	// console.log(meterObj.status); // success
	// console.log(meterObj.lastreading); // 45524.3200
	// console.log(
	// 	meterObj.logmeter.datarow[0].reading_time,
	// 	meterObj.logmeter.datarow[0].meter_reading
	// ); // 30/09/2025 23:00:01

	// const LIFF_ID = import.meta.env.VITE_LIFF_ID;

	onMount(() => {
		//liffInitialization();
	});

	async function liffInitialization() {
		try {
			await liff.init({ liffId: '2008120165-nWm5a7vA' });
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
			//await getresultOfScan(stringifiedResult);
		} catch (error) {
			console.error('Error scanning code:', error);
			scannedCode = `Scan failed: ${error.message}`;
		}
	}

	async function getresultOfScan() {
		const a = 'Ubde8ad251df19f99b1bfbf9eb8e99799';
		const b = { value: '15310280' };
		const c = JSON.stringify(b);
		try {
			const response = await axios({
				method: 'get',
				url: 'https://rms.ssdapp.net/meter-bot',
				// params: {
				// 	select: 'meter-qrscan',
				// 	id: stringifiedResult,
				// 	line_user_id: profileID
				// }
				params: {
					select: 'meter-qrscan',
					id: c,
					line_user_id: a
				}
			});
			console.log(response.data);
		} catch (error) {
			console.log(error);
		}
	}
	async function fetchMeter() {
		const url = 'https://rms.ssdapp.net/meter-bot';
		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const data = await response.json();
			console.log(data);
		} catch (error) {}
	}
</script>

<div class="container mx-auto max-w-xl p-3">
	<!-- <p class="mb-3 text-center text-xs text-gray-600">{scannedCode}</p> -->

	<div class="header mb-2 rounded-lg border-t-4 border-red-500 bg-white p-4 shadow-md">
		<h2 class="mb-3 border-b pb-2 text-xl font-extrabold text-gray-800">
			ข้อมูลมิเตอร์ (Meter Details)
		</h2>

		<div class="divide-y divide-gray-200">
			<div class="grid grid-cols-2 bg-gray-50 py-1.5 text-xs">
				<div class="font-bold text-gray-700">รหัสมิเตอร์ (meter_id):</div>
				<div class="text-right text-gray-700">{meterObj.meter_id}</div>
			</div>
			<div class="grid grid-cols-2 py-1.5 text-xs">
				<div class="font-bold text-gray-700">ซีเรียลมิเตอร์ (meter_serial):</div>
				<div class="text-right text-gray-700">{meterObj.meter_serial}</div>
			</div>
			<div class="grid grid-cols-2 bg-gray-50 py-1.5 text-xs">
				<div class="font-bold text-gray-700">รหัสมิเตอร์ (meter_code):</div>
				<div class="text-right text-gray-700">{meterObj.meter_code}</div>
			</div>
			<div class="grid grid-cols-2 py-1.5 text-xs">
				<div class="font-bold text-gray-700">อ่านล่าสุด (lastreading):</div>
				<div class="text-right font-medium text-gray-700">{meterObj.lastreading}</div>
			</div>
			<div class="grid grid-cols-2 bg-gray-50 py-1.5 text-xs">
				<div class="font-bold text-gray-700">วันที่อ่าน (reading_date):</div>
				<div class="text-right text-gray-700">{meterObj.reading_date}</div>
			</div>
			<div class="grid grid-cols-2 py-1.5 text-xs">
				<div class="font-bold text-gray-700">หน่วย (unitno):</div>
				<div class="text-right text-gray-700">{meterObj.unitno}</div>
			</div>
			<div class="grid grid-cols-2 bg-gray-50 py-1.5 text-xs">
				<div class="font-bold text-gray-700">เลขสัญญา (contract_no):</div>
				<div class="text-right text-gray-700">{meterObj.contract_no}</div>
			</div>
			<div class="grid grid-cols-2 py-1.5 text-xs">
				<div class="font-bold text-gray-700">ชื่อลูกค้า (customer_name):</div>
				<div class="text-right text-gray-700">{meterObj.customer_name}</div>
			</div>
			<div class="grid grid-cols-2 py-1.5 text-xs">
				<div class="font-bold text-gray-700">Bus ID:</div>
				<div class="text-right text-gray-700">{meterObj.busid}</div>
			</div>
			<div class="grid grid-cols-2 bg-gray-50 py-1.5 text-xs">
				<div class="font-bold text-gray-700">ชื่อประเภทมิเตอร์ (meter_type_name):</div>
				<div class="text-right text-gray-700">{meterObj.meter_type_name}</div>
			</div>
		</div>
	</div>

	---

	<h3 class="mb-2 text-lg font-bold text-gray-800">ประวัติการอ่านค่า (Reading History)</h3>
	<div class="overflow-x-auto rounded-lg shadow-md">
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
				{#each meterObj.logmeter.datarow as row, index}
					<tr class="{index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-red-50/50">
						<td class="px-3 py-2 text-xs font-medium whitespace-nowrap text-gray-900">
							{index + 1}
						</td>
						<td class="px-3 py-2 text-xs whitespace-nowrap text-gray-600">
							{row.reading_time}
						</td>
						<td class="px-3 py-2 text-right text-xs font-semibold whitespace-nowrap text-gray-800">
							{parseFloat(row.meter_reading).toLocaleString('th-TH', {
								minimumFractionDigits: 2
							})}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<button
		on:click={getresultOfScan}
		class="btn-hover mt-4 w-full rounded-lg bg-red-500 py-2 text-sm font-bold text-white shadow-md transition duration-300 ease-in-out hover:bg-red-600"
	>
		Scan QR Code
	</button>
</div>
