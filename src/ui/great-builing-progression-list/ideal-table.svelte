<script>
	export let data = [];
	export let title = "default";
	const columns = [
	 {
		 key: "name",
		 title: "Name",
		 value(row) {
			 return row.greatBuildingName;
		 }
	 },
	 {
		 key: "player",
		 title: "Player",
		 value(row) {
			 return row.playerName;
		 }
	 },
	 {
		key: "lastChanged",
		title: "Last Changed",
		value(row) {
			return row.lastChanged;
		}
	 },
	]
</script>

<foe-window title={{title}}>
	<table>
	  <thead>
	      <tr>
	        {#each columns as col}
						<th>
							{col.title}
						</th>
					{/each}
				</tr>
		</thead>
		<tbody>
			{#each data as row}
				<tr>
					{#each columns as col}
						<td>
							{col.value(row)}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
	{data.length}
</foe-window>


<svelte:options tag="my-thing"/>


<style>
	table tbody tr:nth-child(odd) {
    background-color: rgba(255,255,255, 0.07);
	}

	table thead {
    background-color: rgba(0,0,0, 0.5);
	}

	table {
		width : 100%;
	}

</style>
