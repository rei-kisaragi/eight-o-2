<script lang="ts">
    import { enhance } from '$app/forms';
    import { page } from '$app/state';
    import type { PageProps } from './$types';

    let { data, form }: PageProps = $props();

    let submitting = $state(false);
    let copied = $state<string | null>(null);

    const origin = $derived(page.url.origin);

    async function copy(text: string) {
        try {
            await navigator.clipboard.writeText(text);
            copied = text;
            setTimeout(() => (copied = text === copied ? null : copied),
        1500);
        } catch {
            /* ignore */
        }
    }
</script>

<main mx="auto" max-w="2xl" p="x-4 y-10">
  <header mb="8">
    <h1 flex="~ items-center gap-2" text="2xl" font="bold">
        <span class="i-lucide-link text-zinc-500"></span>shortlink
    </h1>
    <p mt="1" text="sm zinc-500">SvelteKit + Supabase + Cloudflare PagesのSSRデモ</p>
  </header>

  <form
    method="POST"
    action="?/create"
    class="card" flex="~ col gap-3"
    use:enhance={() => {
        submitting = true;
        return async({ update }) => {
            await update();
            submitting = false;
        };
    }}
    >
        <label flex="~ col gap-1">
            <span text="sm" font="medium">転送先 URL</span>
            <input
              class="input"
              name="url"
              type="text"
              placeholder="https://example.com/very/long/path"
              value={form?.url ?? ''}
              autocomplete="off"
              required
            />
        </label>
        <label flex="~ col gap-1">
            <span text="sm" font="medium">カスタムSlug<span text="zinc-400">(任意)</span></span>
            <div flex="~ items-center gap-2">
                <span shrink="0" text="sm zinc-400">{origin}</span>
                <input 
                class="input"
                name="slug"
                type="text"
                placeholder="自動生成"
                value={form?.slug ?? ''}
                autocomplete="off" 
            />
            </div>
        </label>
        <button class="btn-primary" mt="1" type="submit" disabled={submitting}>
            {#if submitting}
              <span class="i-lucide-loader-circle animate-spin"></span> 作成中...
            {:else}
              <span class="i-lucide-scissors"></span> 短縮する
            {/if}
        </button>

        {#if form?.error}
            <p text="sm red-600">{form.error}</p>
        {/if}

        {#if form?.success && form.shortUrl}
            {@const su = form.shortUrl}
            <div flex="~ items-center justify-between gap-2" rounded="lg" bg="green-50" p="x-3 y-2" text="sm">
                <a class="truncate font-mono text-green-800 hover:underline" href={su} target="_blank">{su}</a>
                <button type="button" class="btn shrink-0" bg="green-100 hover:green-200" text="green-800" onclick={() => copy(su)}>
                    {copied ===su ? 'コピー済' : 'コピー'}
                </button>
            </div>
        {/if}
  </form>

  <section mt="8">
    <h2 mb="3" text="sm zinc-500" font="semibold">最近のリンク</h2>
    {#if data.loadError}
    <p text="sm red-600">読み込みエラー: {data.loadError}</p>
    {:else if data.links.length === 0}
    <p text="sm zinc-400">まだ短縮されたリンクはありません。</p>
    {:else}
      <ul flex="~ col gap-2">
        {#each data.links as link(link.id)}
          {@const short = `${origin}/${link.slug}`}
          <li class="card flex items-center justify-between gap-3">
            <div min-w="0">
                <a font="mono medium" text="sm" class="hover:underline" href={'/' + link.slug} target="_blank">/{link.slug}</a>
                <p class="truncate text-xs text-zinc-400">{link.url}</p>
            </div>
            <div class="flex shrink-0 items-center gap-3">
                <span class="flex items-center gap-1 text-xs text-zinc-500" title="クリック数">
                    <span class="i-lucide-mouse-pointer-click"></span>{link.clicks}
                </span>
                <button type="button" class="btn bg-zinc-100 text-xs hover:bg-zinc-200" onclick={() => copy(short)}>
                    {copied === short ? '済' : 'コピー'}
                </button>
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  </section>
</main>