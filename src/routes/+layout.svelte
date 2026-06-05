<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '@unocss/reset/tailwind-v4.css'
	import 'virtual:uno.css'

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}