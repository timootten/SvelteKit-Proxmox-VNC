import { query } from "$app/server";
import { PROXMOX_ID, PROXMOX_SECRET, PROXMOX_URL } from "$env/static/private";
import { tryCatch } from "$lib/utils";

const NODE = "Node01";
const VMID = "251";

const getVNCUrl = async () => {
  const proxmoxUrl = PROXMOX_URL;
  const proxmoxId = PROXMOX_ID;
  const proxmoxSecret = PROXMOX_SECRET;

  const response = await fetch(
    `${proxmoxUrl}/api2/json/nodes/${NODE}/qemu/${VMID}/vncproxy`,
    {
      method: 'POST',
      headers: {
        Authorization: `PVEAPIToken=${proxmoxId}=${proxmoxSecret}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        websocket: '1'
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Proxmox API error:', response.status, errorText);
    throw new Error('Failed to fetch VNC proxy', { cause: response });
  }

  const data = await response.json();
  const { ticket, port } = data.data;

  // Build WebSocket URL path (without protocol/host)
  const wsPath = `/api/vnc/${VMID}?ticket=${encodeURIComponent(ticket)}&port=${port}`;

  // Build noVNC viewer URL
  const novncUrl = new URL('https://novnc.com/noVNC/vnc.html');
  novncUrl.searchParams.set('host', 'l5173.shadehost.eu');
  novncUrl.searchParams.set('port', '443'); // HTTPS port
  novncUrl.searchParams.set('path', wsPath);
  novncUrl.searchParams.set('autoconnect', 'true');
  novncUrl.searchParams.set('resize', 'scale');
  novncUrl.searchParams.set('password', ticket);

  return {
    url: novncUrl.toString()
  };
};

export const getVNCURL = query(async () => {
  const [vnc, error] = await tryCatch(getVNCUrl());

  if (error) {
    console.error('Error fetching VNC URL:', error);
    return {
      url: null,
      error: error.message
    };
  }

  return vnc;
});
