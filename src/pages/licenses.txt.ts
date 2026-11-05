import type { APIRoute } from "astro";
import fuwariLicense from "../../LICENSE?raw";
import thirdPartyNotices from "../../THIRD_PARTY_NOTICES.txt?raw";

export const GET: APIRoute = () =>
	new Response(`Fuwari template\n===============\n\n${fuwariLicense}\n${thirdPartyNotices}`, {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
