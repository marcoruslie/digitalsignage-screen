import { networkInterfaces } from "os"
export default defineEventHandler((event) => {
	const interfaces = networkInterfaces()
	let networkAddress = ""
	const port = 3000
	for (const name of Object.keys(interfaces)) {
		for (const iface of interfaces[name]) {
			if (iface.family === "IPv4" && !iface.internal) {
				if(name === "Ethernet" || name === "Wi-Fi")
				{
					networkAddress = iface.address
					break
				}
			}
		}
		if (networkAddress) break
	}
	return 'http://'+networkAddress
})
