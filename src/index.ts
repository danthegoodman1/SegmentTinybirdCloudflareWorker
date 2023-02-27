export interface Env {}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		const res = new Response("writing in background");
		const bodyCopy = await request.text()
		ctx.waitUntil(async function(): Promise<void> {
			const response = await fetch(`https://api.us-east.tinybird.co/v0/events?name=${encodeURIComponent(
				new URL(request.url).searchParams.get("name") as string
			)}`, {
				method: request.method,
				headers: request.headers,
				body: bodyCopy
			})
			console.log("Response from tinybird", response.status, await response.text())
		}())
		return res
	},
};
