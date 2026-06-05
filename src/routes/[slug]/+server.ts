import { error, redirect } from '@sveltejs/kit'
import { getSupabase } from '$lib/server/supabase'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ params, platform }) => {
    const supabase = getSupabase(platform);

    const { data, error: dbError } = await supabase
        .from('links')
        .select('url')
        .eq('slug', params.slug)
        .maybeSingle();

    if (dbError) throw error(500, dbError.message);
    if (!data) throw error(404, 'リンクが見つかりません');

    const bump = supabase.rpc('increment_clicks', { link_slug: params.slug});
    if(platform?.context?.waitUntil) {
        platform.context.waitUntil(Promise.resolve(bump));
    } else {
        Promise.resolve(bump).catch(() => {});
    }
    throw redirect(302, data.url)
}