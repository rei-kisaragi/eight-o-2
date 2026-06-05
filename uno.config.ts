import { defineConfig, presetAttributify, presetWind4 } from 'unocss'

export default defineConfig({
  // ...UnoCSS options
  presets:[
    presetWind4(),
    presetAttributify({

    }),
  ],
  shortcuts: {
		btn: 'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium transition active:scale-[0.98] disabled:opacity-50',
		'btn-primary': 'btn bg-zinc-900 text-white hover:bg-zinc-700',
		input:
			'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10',
		card: 'rounded-xl border border-zinc-200 bg-white p-4 shadow-sm'
	},
	theme: {
		fontFamily: {
			sans: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Hiragino Sans", "Noto Sans JP", sans-serif',
			mono: 'ui-monospace, "SFMono-Regular", Menlo, monospace'
		}
	}
})