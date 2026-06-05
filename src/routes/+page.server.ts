import { fail } from '@sveltejs/kit';
import { getSupabase, type Link } from '$lib/server/supabase';
import { randomSlug, isValidSlug, normalizeUrl } from '$lib/slug';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
    const supabase = getSupabase(platform);
    const { data, error} = await supabase
    .from('links')
    .select('id, slug, url, clicks, created_at')
    .order('created_at', { ascending: false})
    .limit(20);

    if (error) {
        return { links: [] as Link[], loadError: error.message };
    }
    return { links: (data ?? []) as Link[], loadError: null};
};

type CreateResult = {
    success: boolean;
    shortUrl: string | null;
    slug: string;
    url: string;
    error: string | null;
};

const result = (r: Partial<CreateResult>): CreateResult => ({
    success: false,
    shortUrl: null,
    slug: '',
    url: '',
    error: null,
    ...r
});

export const actions: Actions = {
    create: async ({ request, platform, url: reqUrl }) => {
        const formData = await request.formData();
        const rawUrl = String(formData.get('url')?? '');
        const rawSlug = String(formData.get('slug')?? '').trim();

        const url = normalizeUrl(rawUrl);
        if(!url) {
            return fail(400, result({ url: rawUrl, slug: rawSlug, error: '有効なURLを入力してください'}));
        }
        if (rawSlug && !isValidSlug(rawSlug)) {
            return fail(
                400,
                result({
                    url: rawUrl,
                    slug: rawSlug,
                    error: 'スラッグは英数字・ハイフン・アンダースコアのみ(1~64文字)'
                })
            )
        }
        const supabase = getSupabase(platform);

        for (let attempt = 0; attempt < 5; attempt++) {
            const slug = rawSlug || randomSlug();
            const { data, error } = await supabase
                .from('links')
                .insert({ slug,url })
                .select('slug')
                .single();

                if (!error && data) {
                    return result({
                        success: true,
                        shortUrl: `${reqUrl.origin}/${data.slug}`,
                        slug: data.slug,
                        url
                    });
                }
                if (error?.code === '23505') {
                    if(rawSlug) {
                        return fail(
                            409,
                            result({ url: rawUrl, slug: rawSlug, error: 'そのスラッグは既に使われています'})
                        );
                    }
                    continue;
                }
                return fail(
                    500,
                    result({ url: rawUrl, slug: rawSlug, error: error?.message ?? '作成に失敗しました'})
                );
        }
        return fail(
            500,
            result({ url: rawUrl, slug: rawSlug, error: 'スラッグの生成に失敗しました。再試行してください'})
        );
    }
};