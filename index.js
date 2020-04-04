addEventListener('fetch', event => {
	event.respondWith(createResponse(event.request))
})

async function createResponse(req) {
  let domain = new URL(req.url).hostname.toString();
	if (domain !== 'www.jamesridgway.co.uk') {
		let redirectHeaders = new Headers()
		redirectHeaders.set('Location', 'https://www.jamesridgway.co.uk')
		return new Response('', {
			status: 301,
			headers: redirectHeaders
		})
	}

	let url = new URL(req.url).toString().replace("www.jamesridgway.co.uk", "jamesridgway.ghost.io").replace("website.jamesridgway.workers.dev/", "jamesridgway.ghost.io")
	const init = {
		body: req.body,
		headers: req.headers,
		method: req.method
	}
	
	let response = await fetch(url, init)
	let newHdrs = new Headers(response.headers)
    newHdrs.set("Strict-Transport-Security", "max-age=31536000; includeSubdomains; preload")
    newHdrs.set("X-Content-Type-Options", "nosniff")
    newHdrs.set("X-Frame-Options", "DENY")
    newHdrs.set("X-XSS-Protection", "1; mode=block")
    newHdrs.set("Referrer-Policy", "same-origin")
    newHdrs.set("feature-policy", "accelerometer 'none'; camera 'none'; geolocation 'none'; gyroscope 'none'; magnetometer 'none'; microphone 'none'; payment 'none'; usb 'none'")

	let urlPath = new URL(req.url).pathname
	if (urlPath === '/ghost' || urlPath === '/ghost/') {
		let redirectHeaders = new Headers()
		redirectHeaders.set('Location', 'https://jamesridgway.ghost.io/ghost/')
		return new Response('', {
			status: 301,
			headers: redirectHeaders 
		})
	}

	if (newHdrs.has("Content-Type") && !newHdrs.get("Content-Type").includes("text/html") && !newHdrs.get("Content-Type").includes("text/xml")) {
		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: newHdrs
		})
	}

	let text = await response.text()
	let modified = text.replace('<script>"jamesridgway.ghost.io"==window.location.hostname&&(window.location.href="https://www.jamesridgway.co.uk"+window.location.pathname);</script>', '')
	modified = modified.replace(/jamesridgway.ghost.io/g, 'www.jamesridgway.co.uk')

	let originPath = new URL(response.url).pathname
	if (originPath !== urlPath) {
		let redirectHeaders = new Headers()
		redirectHeaders.set('Location', 'https://www.jamesridgway.co.uk' + originPath)
		return new Response('', {
			status: 301,
			headers: redirectHeaders
		})
	}

	return new Response(modified , {
		status: response.status,
		statusText: response.statusText,
		headers: newHdrs
	})
}
