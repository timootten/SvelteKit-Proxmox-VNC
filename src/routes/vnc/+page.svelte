<script>
	import { getVNCURL } from './proxmox.remote';

	const vncUrl = await getVNCURL();
	console.log('VNC URL:', vncUrl);
</script>

<h1>VNC</h1>
