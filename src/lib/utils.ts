import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ReadonlyURLSearchParams } from 'next/navigation';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function nl2br(str?: string) {
	if (!str) return ''
	return str.split('\n').join('<br>')
}

export function slug(str: string) {
	return str
		.toLowerCase()
		.replace(/[\s\W]+/g, '-')
		.replace(/^-+/, '')
		.replace(/-+$/, '')
}

export const createUrl = (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) => {
	const paramsString = params.toString();
	const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

	return `${pathname}${queryString}`;
};
