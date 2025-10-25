<script>
	import { getVNCURL } from './proxmox.remote';

	const vncUrl = await getVNCURL();
	console.log('VNC URL:', vncUrl);
</script>

<h1>VNC</h1>

<iframe title="VNC console" src={vncUrl.url} width="100%" height="600px"></iframe>
