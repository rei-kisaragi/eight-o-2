import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env as dynamicEnv } from '$env/dynamic/private';

export type Link = {
    id: number;
    slug: string;
    url: string;
    clicks: number;
    created_at: string;
}

export function getSupabase(platform: App.Platform | undefined):
SupabaseClient {
    const url = platform?.env?.SUPABASE_URL ?? dynamicEnv.SUPABASE_URL;
    const key = platform?.env?.SUPABASE_SERVICE_ROLE_KEY ??
dynamicEnv.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }
    return createClient(url, key, {
        auth: {persistSession: false, autoRefreshToken: false}
    })
}