<script>
	export let title = "";
	export let width = 700;
	export let data = [];
	let top = 0;
	let left = 0;
	let open = true;

	function handleClick(event) {
		let root = this.getRootNode().host
		root.dispatchEvent(new CustomEvent('close', {detail:root}))
	}

	function handleMinimize(event) {
		open = !open;
	}

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

<div class="window-box open" style="top: {top}px;left: {left}px;width: {width}px;">
  <div class="window-head">
    <span class="title">{title}</span>
		<span class="minimize" on:click={handleMinimize}></span>
		<span class="close" on:click={handleClick}></span>
  </div>
	<div class="window-body">
		{#if open}
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
		{/if}
	</div>
</div>

<svelte:options tag="my-thing"/>


<style>
	:root {
	  --window-background: url(chrome-extension://hhdfmjcaijgllhhokjjjbclbacekpdae/css/images/box-bg.png)
	  --window-border: url(chrome-extension://hhdfmjcaijgllhhokjjjbclbacekpdae/css/images/box-bg.png)
		--window-buttons: url(chrome-extension://hhdfmjcaijgllhhokjjjbclbacekpdae/css/images/buttons.png)
	}

	.window-body {
		max-height: 500px;
		overflow-y: scroll
	}
	.window-box {
	  background: url(chrome-extension://hhdfmjcaijgllhhokjjjbclbacekpdae/css/images/box-bg.png) center center repeat;
	  z-index: 100;
	  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
	  font-size: 0.9rem;
	  font-weight: 400;
	  color: #F3D6A0;
	  text-shadow: 0 1px 1px rgba(0,0,0, 0.65);
	  position: absolute;
	  text-align: left;
	  padding: 1px;
	  top: 30%;
	  left: 40%;
	  border-color: transparent;
	  border-width: 35px 10px 10px 10px;
	  border-style: solid;
	  border-image-source: url("chrome-extension://hhdfmjcaijgllhhokjjjbclbacekpdae/css/images/window.png");
	  border-image-slice: 54 28 28;
	  border-image-width: 54px 28px 28px;
	  border-image-repeat: round;
	  border-image-outset: 0.3;
	  border-radius: 20px;
	  user-select: none;
		position: absolute;
		z-index: 100;
	}

	.title {
		font-weight: 700;
    display: block;
    font-size: 1rem;
    overflow: hidden;
    white-space: pre;
    text-overflow: ellipsis;
	}

	.window-head {
	  display: flex;
	  justify-content: space-between;
	  position: absolute;
	  top: -30px;
	  left: 7px;
	  right: 1px;
	}

	.minimize {
		background-image: url(chrome-extension://hhdfmjcaijgllhhokjjjbclbacekpdae/css/images/buttons.png);
		margin-left: auto;
		background-position: -51px -1px;
    margin-right: 3px;
    width: 25px;
    height: 24px;
    display: inline-block;
    position: relative;
	}

	.close {
		background-image: url(chrome-extension://hhdfmjcaijgllhhokjjjbclbacekpdae/css/images/buttons.png);
		background-position: 0 -1px;
		display: inline-block;
		width: 25px;
		height: 24px;
		position: relative;
	}

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
