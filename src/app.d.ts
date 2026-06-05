import type { AuthUser } from '@csc-is-team/sveltekit-auth';

declare global {
	namespace App {
		interface Locals {
			user: AuthUser | null;
		}
	}
	declare namespace svelteHTML {
		import type { AttributifyAttributes } from '@unocss/preset-attributify';
		type HTMLAttributes = AttributifyAttributes;
		type SVGAttributes = AttributifyAttributes;
	}
}

export {};