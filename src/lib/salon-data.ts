import { isRemoteApi } from "@/lib/env";
import * as remote from "@/lib/salon-remote";
import type { BookingRequest, Category, Service } from "@/lib/salon-store";
import * as local from "@/lib/salon-store";

export type { DashboardStatsPayload } from "@/lib/salon-remote";

function readFileDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("Could not read file"));
    r.readAsDataURL(file);
  });
}

export async function fetchStats() {
  if (isRemoteApi()) {
    return remote.remoteFetchStats();
  }
  const cats = local.getCategories();
  const svcs = local.getServices();
  const reqs = local.getRequests();
  const popular = svcs.filter((s) => s.popular && s.enabled);
  const recent = [...reqs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);
  return {
    totalCategories: cats.length,
    totalServices: svcs.length,
    totalRequests: reqs.length,
    pendingRequests: reqs.filter((r) => r.status === "pending").length,
    popularCount: svcs.filter((s) => s.popular).length,
    popularServices: popular.slice(0, 12),
    recentRequests: recent,
  };
}

export async function fetchCategories(): Promise<Category[]> {
  if (isRemoteApi()) return remote.remoteFetchCategories();
  return Promise.resolve(local.getCategories());
}

export async function fetchServices(): Promise<Service[]> {
  if (isRemoteApi()) return remote.remoteFetchServices();
  return Promise.resolve(local.getServices());
}

export async function fetchRequests(): Promise<BookingRequest[]> {
  if (isRemoteApi()) return remote.remoteFetchRequests();
  return Promise.resolve(local.getRequests());
}

export async function createCategory(input: {
  name: string;
  order: number;
  enabled: boolean;
  imageFile?: File | null;
  imageUrl?: string;
}): Promise<void> {
  if (isRemoteApi()) {
    const fd = new FormData();
    fd.append("name", input.name);
    fd.append("order", String(input.order));
    fd.append("enabled", input.enabled ? "1" : "0");
    if (input.imageFile) fd.append("image", input.imageFile);
    else if (input.imageUrl) fd.append("image_url", input.imageUrl);
    await remote.remoteCreateCategory(fd);
    return;
  }
  let image = input.imageUrl ?? "";
  if (input.imageFile) {
    image = await readFileDataUrl(input.imageFile);
  }
  local.addCategory({ name: input.name, image, order: input.order, enabled: input.enabled });
}

export async function updateCategory(
  id: string,
  input: {
    name: string;
    order: number;
    enabled: boolean;
    imageFile?: File | null;
    imageUrl?: string;
  },
): Promise<void> {
  if (isRemoteApi()) {
    const fd = new FormData();
    fd.append("id", id);
    fd.append("name", input.name);
    fd.append("order", String(input.order));
    fd.append("enabled", input.enabled ? "1" : "0");
    if (input.imageFile) fd.append("image", input.imageFile);
    else if (input.imageUrl) fd.append("image_url", input.imageUrl);
    await remote.remoteUpdateCategory(fd);
    return;
  }
  let image = input.imageUrl ?? "";
  if (input.imageFile) {
    image = await readFileDataUrl(input.imageFile);
  }
  local.updateCategory(id, { name: input.name, image, order: input.order, enabled: input.enabled });
}

export async function removeCategory(id: string): Promise<void> {
  if (isRemoteApi()) {
    await remote.remoteDeleteCategory(id);
    return;
  }
  local.deleteCategory(id);
}

export async function createService(input: {
  categoryId: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  popular: boolean;
  enabled: boolean;
  imageFile?: File | null;
  imageUrl?: string;
}): Promise<void> {
  if (isRemoteApi()) {
    const fd = new FormData();
    fd.append("categoryId", input.categoryId);
    fd.append("name", input.name);
    fd.append("price", String(input.price));
    fd.append("duration", input.duration);
    fd.append("description", input.description);
    fd.append("popular", input.popular ? "1" : "0");
    fd.append("enabled", input.enabled ? "1" : "0");
    if (input.imageFile) fd.append("image", input.imageFile);
    else if (input.imageUrl) fd.append("image_url", input.imageUrl);
    await remote.remoteCreateService(fd);
    return;
  }
  let image = input.imageUrl ?? "";
  if (input.imageFile) {
    image = await readFileDataUrl(input.imageFile);
  }
  local.addService({
    categoryId: input.categoryId,
    name: input.name,
    image,
    price: input.price,
    duration: input.duration,
    description: input.description,
    popular: input.popular,
    enabled: input.enabled,
  });
}

export async function updateService(
  id: string,
  input: {
    categoryId: string;
    name: string;
    price: number;
    duration: string;
    description: string;
    popular: boolean;
    enabled: boolean;
    imageFile?: File | null;
    imageUrl?: string;
  },
): Promise<void> {
  if (isRemoteApi()) {
    const fd = new FormData();
    fd.append("id", id);
    fd.append("categoryId", input.categoryId);
    fd.append("name", input.name);
    fd.append("price", String(input.price));
    fd.append("duration", input.duration);
    fd.append("description", input.description);
    fd.append("popular", input.popular ? "1" : "0");
    fd.append("enabled", input.enabled ? "1" : "0");
    if (input.imageFile) fd.append("image", input.imageFile);
    else if (input.imageUrl) fd.append("image_url", input.imageUrl);
    await remote.remoteUpdateService(fd);
    return;
  }
  let image = input.imageUrl ?? "";
  if (input.imageFile) {
    image = await readFileDataUrl(input.imageFile);
  }
  local.updateService(id, {
    categoryId: input.categoryId,
    name: input.name,
    image,
    price: input.price,
    duration: input.duration,
    description: input.description,
    popular: input.popular,
    enabled: input.enabled,
  });
}

export async function removeService(id: string): Promise<void> {
  if (isRemoteApi()) {
    await remote.remoteDeleteService(id);
    return;
  }
  local.deleteService(id);
}

export async function setRequestStatus(
  id: string,
  status: BookingRequest["status"],
): Promise<void> {
  if (isRemoteApi()) {
    await remote.remotePatchRequestStatus(id, status);
    return;
  }
  local.updateRequestStatus(id, status);
}

export async function removeRequest(id: string): Promise<void> {
  if (isRemoteApi()) {
    await remote.remoteDeleteRequest(id);
    return;
  }
  local.deleteRequest(id);
}

export async function submitBooking(input: {
  customerName: string;
  phone: string;
  notes: string;
  services: { id: string; name: string; price: number }[];
  totalPrice: number;
  dateTime: string;
}): Promise<void> {
  if (isRemoteApi()) {
    await remote.remoteCreateBooking(input);
    return;
  }
  local.addRequest({
    customerName: input.customerName,
    phone: input.phone,
    notes: input.notes,
    services: input.services,
    totalPrice: input.totalPrice,
    dateTime: input.dateTime.trim() ? input.dateTime : new Date().toISOString(),
  });
}
