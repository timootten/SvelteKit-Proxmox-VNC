import { PROXMOX_ID, PROXMOX_SECRET, PROXMOX_URL } from "$env/static/private";
import type { RequestHandler } from './$types';

const NODE = "Node01";

export const GET: RequestHandler = async ({ params, url }) => {
  const vmid = params.vmid;
  const ticket = url.searchParams.get('ticket');
  const port = url.searchParams.get('port');

  if (!ticket || !port) {
    return new Response('Missing ticket or port', { status: 400 });
  }

  // Build Proxmox WebSocket URL
  const proxmoxUrl = new URL(PROXMOX_URL);
  const wsProtocol = proxmoxUrl.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsPath = `/api2/json/nodes/${NODE}/qemu/${vmid}/vncwebsocket`;

  const proxmoxWsUrl = `${wsProtocol}//${proxmoxUrl.host}${wsPath}?port=${port}&vncticket=${encodeURIComponent(ticket)}`;

  // For SvelteKit, we'll redirect to proxmox directly from noVNC
  // Or implement WebSocket proxy if needed
  return new Response(JSON.stringify({
    wsUrl: proxmoxWsUrl,
    error: 'WebSocket proxy not implemented'
  }), {
    status: 501,
    headers: { 'Content-Type': 'application/json' }
  });
};
