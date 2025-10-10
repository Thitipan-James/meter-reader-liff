<script>
	// Meter data array - เปลี่ยนเป็น 'let' เพื่อให้สามารถเปลี่ยนแปลง (Sort/Search) ได้
	let meters = [
		{
			id: 'MTR-001',
			serial: 'SN-789456123',
			type: 'Smart Meter',
			status: 'Active',
			location: 'Residential Area A'
		},
		{
			id: 'MTR-002',
			serial: 'SN-321654987',
			type: 'Industrial Meter',
			status: 'Maintenance',
			location: 'Factory Unit 3'
		},
		{
			id: 'MTR-003',
			serial: 'SN-159753468',
			type: 'Smart Meter',
			status: 'Active',
			location: 'Commercial Complex B'
		},
		{
			id: 'MTR-004',
			serial: 'SN-987654321',
			type: 'Industrial Meter',
			status: 'Inactive',
			location: 'Warehouse 12'
		},
		{
			id: 'MTR-005',
			serial: 'SN-456123789',
			type: 'Smart Meter',
			status: 'Active',
			location: 'Apartment Block C'
		},
		{
			id: 'MTR-006',
			serial: 'SN-369258147',
			type: 'Industrial Meter',
			status: 'Active',
			location: 'Manufacturing Unit 5'
		}
	];

	// ตัวแปรสำหรับ Search
	let searchTerm = '';
	// ตัวแปรสำหรับ Sort
	let sortColumn = 'id';
	let sortDirection = 'asc';

	// Data for the summary cards
	const totalMeters = meters.length;
	const activeMeters = meters.filter((m) => m.status === 'Active').length;
	const unreadMeters = meters.filter((m) => m.status !== 'Active').length;

	// Theme Classes (คงไว้ตาม White-Red Theme)
	const typeClasses = {
		'Smart Meter': 'bg-red-100 text-red-700',
		'Industrial Meter': 'bg-pink-100 text-pink-700'
	};

	/**
	 * Svelte Reactive Declaration ($: filteredMeters)
	 * กรองและจัดเรียงข้อมูลแบบเรียลไทม์เมื่อ 'meters', 'searchTerm', 'sortColumn', หรือ 'sortDirection' เปลี่ยน
	 */
	$: filteredMeters = meters
		.filter((meter) => {
			if (!searchTerm) return true;
			const term = searchTerm.toLowerCase();
			// ค้นหาใน Meter ID, Serial, Type, และ Location
			return (
				meter.id.toLowerCase().includes(term) ||
				meter.serial.toLowerCase().includes(term) ||
				meter.type.toLowerCase().includes(term) ||
				meter.location.toLowerCase().includes(term)
			);
		})
		.sort((a, b) => {
			const aVal = a[sortColumn];
			const bVal = b[sortColumn];

			let comparison = 0;
			if (aVal > bVal) {
				comparison = 1;
			} else if (aVal < bVal) {
				comparison = -1;
			}

			// ใช้ sortDirection มากลับลำดับการเปรียบเทียบ
			return sortDirection === 'desc' ? comparison * -1 : comparison;
		});

	/**
	 * ฟังก์ชันสำหรับจัดการการจัดเรียง (Sorting)
	 * @param {string} column - ชื่อคอลัมน์ที่ต้องการจัดเรียง
	 */
	function handleSort(column) {
		// ถ้ากดซ้ำที่คอลัมน์เดิม ให้เปลี่ยนทิศทาง (asc/desc)
		if (sortColumn === column) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			// ถ้ากดคอลัมน์ใหม่ ให้เริ่มจาก 'asc' เสมอ
			sortColumn = column;
			sortDirection = 'asc';
		}
	}
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
	/>
</svelte:head>

<div class="container mx-auto px-3 py-3">
	<div class="header mb-2 rounded-lg border-t-4 border-red-600 bg-white p-4 shadow-md">
		<h2 class="mb-3 border-b border-gray-200 pb-2 text-xl font-extrabold text-gray-800">
			ข้อมูลมิเตอร์ทั้งหมด
		</h2>
		<div class="mt-4 mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
			<div class="rounded-lg border border-gray-100 bg-white p-3 shadow-md">
				<div class="flex items-center">
					<div class="mr-4 rounded-full bg-blue-100 p-3 text-blue-600">
						<i class="fas fa-tachometer-alt text-xl"></i>
					</div>
					<div>
						<p class="text-sm text-gray-500">มิเตอร์ทั้งหมด</p>
						<p class="text-lg font-bold">{totalMeters}</p>
					</div>
				</div>
			</div>

			<div class="rounded-lg border border-gray-100 bg-white p-3 shadow-md">
				<div class="flex items-center">
					<div class="mr-4 rounded-full bg-green-100 p-3 text-green-600">
						<i class="fas fa-check-circle text-xl"></i>
					</div>
					<div>
						<p class="text-sm text-gray-500">มิเตอร์ที่อ่านแล้ว</p>
						<p class="text-lg font-bold">{activeMeters}</p>
					</div>
				</div>
			</div>

			<div class="rounded-lg border border-gray-100 bg-white p-3 shadow-md">
				<div class="flex items-center">
					<div class="mr-4 rounded-full bg-red-100 p-3 text-red-600">
						<i class="fas fa-exclamation-circle text-xl"></i>
					</div>
					<div>
						<p class="text-sm text-gray-500">มิเตอร์ที่ยังไม่ได้อ่าน</p>
						<p class="text-lg font-bold">{unreadMeters}</p>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="overflow-hidden rounded-lg bg-white shadow-lg">
		<div class=" px-6 py-4">
			<h2 class="mb-1 border-b border-gray-200 py-1 text-lg font-bold text-gray-800">
				ดูสถานะโดยรวมของ Meter
			</h2>
		</div>

		<div class="p-6">
			<div class="relative w-full max-w-md">
				<input
					type="text"
					bind:value={searchTerm}
					placeholder="ค้นหาด้วย Meter ID, Serial Number หรือ Location..."
					class="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 text-gray-700 focus:border-red-500 focus:ring-red-500"
				/>
				<i class="fas fa-search absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"></i>
			</div>
		</div>

		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-red-50">
					<tr>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-red-700 uppercase"
						>
							#
						</th>

						<th
							scope="col"
							class="cursor-pointer px-6 py-3 text-left text-xs font-medium tracking-wider text-red-700 uppercase hover:text-red-900"
							on:click={() => handleSort('id')}
						>
							<span class="flex items-center"> Meter ID </span>
						</th>

						<th
							scope="col"
							class="cursor-pointer px-6 py-3 text-left text-xs font-medium tracking-wider text-red-700 uppercase hover:text-red-900"
							on:click={() => handleSort('serial')}
						>
							<span class="flex items-center"> Serial Number </span>
						</th>

						<th
							scope="col"
							class="cursor-pointer px-6 py-3 text-left text-xs font-medium tracking-wider text-red-700 uppercase hover:text-red-900"
							on:click={() => handleSort('type')}
						>
							<span class="flex items-center"> Meter Type </span>
						</th>

						<th
							scope="col"
							class="cursor-pointer px-6 py-3 text-left text-xs font-medium tracking-wider text-red-700 uppercase hover:text-red-900"
							on:click={() => handleSort('location')}
						>
							<span class="flex items-center"> Currently Using </span>
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 bg-white">
					{#each filteredMeters as meter, index (meter.id)}
						<tr class="transition-colors hover:bg-red-50">
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-500">
									{index + 1}
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-medium text-gray-900">{meter.id}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-900">{meter.serial}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span
									class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold {typeClasses[
										meter.type
									]}"
								>
									{meter.type}
								</span>
							</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
								{meter.location}
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="5" class="px-6 py-4 text-center text-gray-500">
								ไม่พบข้อมูลมิเตอร์ที่ตรงกับคำค้นหา
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="border-t border-gray-200 bg-gray-50 px-6 py-4">
			<div class="flex items-center justify-between">
				<div class="text-sm text-gray-700">
					Showing <span class="font-medium">1</span> to
					<span class="font-medium">{filteredMeters.length}</span>
					of <span class="font-medium">{totalMeters}</span> results
				</div>
				<!-- <div class="flex space-x-2">
					<button
						class="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
						disabled
					>
						Previous
					</button>
					<button
						class="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
						disabled
					>
						Next
					</button>
				</div> -->
			</div>
		</div>
	</div>
</div>
