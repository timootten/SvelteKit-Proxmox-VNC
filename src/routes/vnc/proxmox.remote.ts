import { query } from "$app/server";
import { PROXMOX_ID, PROXMOX_SECRET, PROXMOX_URL } from "$env/static/private";
import { tryCatch } from "$lib/utils";
import Redis from "ioredis";

interface VNCProxyResponse {
  port: number;
  ticket: string;
  upid: string;
  user: string;
  password: string;
  cert?: string;
}


const redis = new Redis();


const createNoVNC = async (node: string, vmid: number): Promise<{ url: string }> => {
  const proxmoxUrl = PROXMOX_URL;
  const proxmoxId = PROXMOX_ID;
  const proxmoxSecret = PROXMOX_SECRET;

  const response = await fetch(
    `${proxmoxUrl}/api2/json/nodes/${node}/qemu/${vmid}/vncproxy`,
    {
      method: 'POST',
      headers: {
        Authorization: `PVEAPIToken=${proxmoxId}=${proxmoxSecret}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        websocket: '1',
        'generate-password': '1'
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Proxmox API error: ${response.status} ${response.statusText}`);
  }

  const data: VNCProxyResponse = (await response.json()).data;

  redis.set('abc', `${"45.82.120.237"}:${data.port}`)

  const vncURL = `http://localhost:6080/vnc.html?autoconnect=true&path=websockify?token=abc&password=${encodeURIComponent(data.password)}`



  return {
    url: vncURL
  };
};

export const getVNCURL = query(async () => {
  const [vnc, error] = await tryCatch(createNoVNC("Node01", 251));

  if (error) {
    console.error('Error creating noVNC connection:', error);
    return {
      url: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }

  return vnc;
});
