import { phpApiBase } from "@/lib/env";
import type { BookingRequest, Category, Service } from "@/lib/salon-store";

function endpoint(query: string): string {
  const base = phpApiBase();
  const q = query.startsWith("?") ? query : `?${query}`;
  return `${base}/index.php${q}`;
}

async function parseJson<T extends { ok: boolean; error?: string }>(res: Response): Promise<T> {
  const text = await res.text();
  let data: T;
  try {
    data = JSON.parse(text) as T;
  } catch {
    throw new Error(text.slice(0, 200) || "Invalid server response");
  }
  if (!data.ok) {
    throw new Error((data as { error?: string }).error || res.statusText || "Request failed");
  }
  return data;
}

export interface DashboardStatsPayload {
  totalCategories: number;
  totalServices: number;
  totalRequests: number;
  pendingRequests: number;
  popularCount: number;
  popularServices: Service[];
  recentRequests: BookingRequest[];
}

export async function remoteFetchStats(): Promise<DashboardStatsPayload> {
  const res = await fetch(endpoint("?resource=stats"));
  const j = await parseJson<{ ok: true; data: DashboardStatsPayload }>(res);
  return j.data;
}

export async function remoteFetchCategories(): Promise<Category[]> {
  const res = await fetch(endpoint("?resource=categories"));
  const j = await parseJson<{ ok: true; data: Category[] }>(res);
  return j.data;
}

export async function remoteFetchServices(): Promise<Service[]> {
  const res = await fetch(endpoint("?resource=services"));
  const j = await parseJson<{ ok: true; data: Service[] }>(res);
  return j.data;
}

export async function remoteFetchRequests(): Promise<BookingRequest[]> {
  const res = await fetch(endpoint("?resource=requests"));
  const j = await parseJson<{ ok: true; data: BookingRequest[] }>(res);
  return j.data;
}

export async function remoteCreateCategory(fd: FormData): Promise<Category> {
  const res = await fetch(endpoint("?resource=categories"), { method: "POST", body: fd });
  const j = await parseJson<{ ok: true; data: Category }>(res);
  return j.data;
}

export async function remoteUpdateCategory(fd: FormData): Promise<Category> {
  const res = await fetch(endpoint("?resource=categories"), { method: "POST", body: fd });
  const j = await parseJson<{ ok: true; data: Category }>(res);
  return j.data;
}

export async function remoteDeleteCategory(id: string): Promise<void> {
  const res = await fetch(endpoint(`?resource=categories&id=${encodeURIComponent(id)}`), {
    method: "DELETE",
  });
  await parseJson(res);
}

export async function remoteCreateService(fd: FormData): Promise<Service> {
  const res = await fetch(endpoint("?resource=services"), { method: "POST", body: fd });
  const j = await parseJson<{ ok: true; data: Service }>(res);
  return j.data;
}

export async function remoteUpdateService(fd: FormData): Promise<Service> {
  const res = await fetch(endpoint("?resource=services"), { method: "POST", body: fd });
  const j = await parseJson<{ ok: true; data: Service }>(res);
  return j.data;
}

export async function remoteDeleteService(id: string): Promise<void> {
  const res = await fetch(endpoint(`?resource=services&id=${encodeURIComponent(id)}`), {
    method: "DELETE",
  });
  await parseJson(res);
}

export async function remotePatchRequestStatus(
  id: string,
  status: BookingRequest["status"],
): Promise<void> {
  const res = await fetch(endpoint("?resource=requests"), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status }),
  });
  await parseJson(res);
}

export async function remoteDeleteRequest(id: string): Promise<void> {
  const res = await fetch(endpoint(`?resource=requests&id=${encodeURIComponent(id)}`), {
    method: "DELETE",
  });
  await parseJson(res);
}

export async function remoteCreateBooking(body: {
  customerName: string;
  phone: string;
  notes: string;
  services: { id: string; name: string; price: number }[];
  totalPrice: number;
  dateTime: string;
}): Promise<BookingRequest> {
  const res = await fetch(endpoint("?resource=booking"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const j = await parseJson<{ ok: true; data: BookingRequest }>(res);
  return j.data;
}
