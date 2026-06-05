const ALPHABET = '23456789abcdefghijkmnpqrstuvwxyz'

export function randomSlug(length = 6): string {
    const bytes = crypto.getRandomValues(new Uint8Array(length));
    let out = ''
    for (const b of bytes) out += ALPHABET[b % ALPHABET.length];
    return out;
}

const SLUG_RE = /^[a-zA-Z0-9_-]{1,64}$/;
export function isValidSlug(slug: string): boolean {
    return SLUG_RE.test(slug);
}

export function normalizeUrl(input: string): string | null {
    let candidate = input.trim();
    if(!candidate) return null;
    if(!/^https?:\/\//i.test(candidate)) candidate = 'https://' + candidate;
    try {
        const u = new URL(candidate);
        if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
        return u.toString()
    } catch {
        return null;
    }
}