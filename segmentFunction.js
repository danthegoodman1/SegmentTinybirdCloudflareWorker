// Learn more about destination functions API at
// https://segment.com/docs/connections/destinations/destination-functions

/**
 * Handle track event
 * @param  {SegmentTrackEvent} event
 * @param  {FunctionSettings} settings
 */
async function onTrack(event, settings) {
	// const endpoint = `https://api.us-east.tinybird.co/v0/events?name=${encodeURIComponent(
	// 	settings.tableName
	// )}`;
	const endpoint = `https://segmenttinybirdcloudflareworker.tangia.workers.dev?name=${encodeURIComponent(
		settings.tableName
	)}`;
	let response;

	try {
		console.log('sending data', JSON.stringify(event, null, 2));
		response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${settings.token}`
			},
			body: JSON.stringify({
				...event,
				properties: JSON.stringify(event.properties),
				context: JSON.stringify(event.context),
				traits: JSON.stringify(event.traits)
			})
		});
		console.log('sent');
	} catch (error) {
		// Retry on connection error
		throw new RetryError(error.message);
	}

	if (response.status >= 500 || response.status === 429) {
		// Retry on 5xx (server errors) and 429s (rate limits)
		throw new RetryError(`Failed with ${response.status}`);
	}
}

async function onBatch(events, settings) {
	// const endpoint = `https://api.us-east.tinybird.co/v0/events?name=${encodeURIComponent(
	// 	settings.tableName
	// )}`;
	const endpoint = `https://segmenttinybirdcloudflareworker.tangia.workers.dev?name=${encodeURIComponent(
		settings.tableName
	)}`;
	let response;

	try {
		console.log('sending data', JSON.stringify(events, null, 2));
		response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${settings.token}`
			},
			body: events
				.map(event =>
					JSON.stringify({
						...event,
						properties: JSON.stringify(event.properties),
						context: JSON.stringify(event.context),
						traits: JSON.stringify(event.traits)
					})
				)
				.join('\n') // ndjson
		});
		console.log('sent');
	} catch (error) {
		// Retry on connection error
		throw new RetryError(error.message);
	}

	if (response.status >= 500 || response.status === 429) {
		// Retry on 5xx (server errors) and 429s (rate limits)
		throw new RetryError(`Failed with ${response.status}`);
	}
}
