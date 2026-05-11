export interface Category {
  id: string;
  name: string;
  image: string;
  order: number;
  enabled: boolean;
}

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  image: string;
  price: number;
  duration: string;
  description: string;
  popular: boolean;
  enabled: boolean;
}

export interface BookingRequest {
  id: string;
  customerName: string;
  phone: string;
  notes: string;
  services: { id: string; name: string; price: number }[];
  totalPrice: number;
  dateTime: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Hair Services', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop', order: 1, enabled: true },
  { id: '2', name: 'Makeup', image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop', order: 2, enabled: true },
  { id: '3', name: 'Facial', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop', order: 3, enabled: true },
  { id: '4', name: 'Nail Art', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop', order: 4, enabled: true },
  { id: '5', name: 'Spa', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop', order: 5, enabled: true },
  { id: '6', name: 'Waxing', image: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=400&h=300&fit=crop', order: 6, enabled: true },
  { id: '7', name: 'Bridal Packages', image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=300&fit=crop', order: 7, enabled: true },
];

const DEFAULT_SERVICES: Service[] = [
  { id: 's1', categoryId: '1', name: 'Hair Cutting', image: 'https://images.unsplash.com/photo-1562322140-8baeefefd46b?w=400&h=300&fit=crop', price: 1500, duration: '45 min', description: 'Professional hair cutting with modern styles', popular: true, enabled: true },
  { id: 's2', categoryId: '1', name: 'Hair Coloring', image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&h=300&fit=crop', price: 3500, duration: '90 min', description: 'Premium hair coloring with international brands', popular: true, enabled: true },
  { id: 's3', categoryId: '1', name: 'Keratin Treatment', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop', price: 5000, duration: '120 min', description: 'Smooth, frizz-free hair with keratin', popular: false, enabled: true },
  { id: 's4', categoryId: '2', name: 'Party Makeup', image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop', price: 3000, duration: '60 min', description: 'Glamorous party-ready makeup look', popular: true, enabled: true },
  { id: 's5', categoryId: '2', name: 'Bridal Makeup', image: 'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=400&h=300&fit=crop', price: 15000, duration: '180 min', description: 'Complete bridal makeup with HD finish', popular: true, enabled: true },
  { id: 's6', categoryId: '3', name: 'Gold Facial', image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=300&fit=crop', price: 2500, duration: '60 min', description: 'Luxurious gold facial for glowing skin', popular: true, enabled: true },
  { id: 's7', categoryId: '3', name: 'Hydra Facial', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=300&fit=crop', price: 4000, duration: '75 min', description: 'Deep hydration facial treatment', popular: false, enabled: true },
  { id: 's8', categoryId: '3', name: 'Whitening Facial', image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&h=300&fit=crop', price: 3000, duration: '60 min', description: 'Skin brightening and whitening treatment', popular: false, enabled: true },
  { id: 's9', categoryId: '4', name: 'Gel Nails', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop', price: 2000, duration: '45 min', description: 'Long-lasting gel nail art', popular: true, enabled: true },
  { id: 's10', categoryId: '5', name: 'Full Body Massage', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop', price: 3500, duration: '60 min', description: 'Relaxing full body massage therapy', popular: true, enabled: true },
  { id: 's11', categoryId: '6', name: 'Full Body Waxing', image: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=400&h=300&fit=crop', price: 3000, duration: '90 min', description: 'Smooth, painless full body waxing', popular: false, enabled: true },
  { id: 's12', categoryId: '7', name: 'Complete Bridal Package', image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=300&fit=crop', price: 35000, duration: '5 hours', description: 'Complete bridal package with makeup, hair, mehndi & more', popular: true, enabled: true },
];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function save<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// Categories
export function getCategories(): Category[] {
  return load('salon_categories', DEFAULT_CATEGORIES);
}
export function saveCategories(cats: Category[]) { save('salon_categories', cats); }
export function addCategory(cat: Omit<Category, 'id'>) {
  const cats = getCategories();
  cats.push({ ...cat, id: generateId() });
  saveCategories(cats);
  return cats;
}
export function updateCategory(id: string, updates: Partial<Category>) {
  const cats = getCategories().map(c => c.id === id ? { ...c, ...updates } : c);
  saveCategories(cats);
  return cats;
}
export function deleteCategory(id: string) {
  const cats = getCategories().filter(c => c.id !== id);
  saveCategories(cats);
  // Also delete services in this category
  const svcs = getServices().filter(s => s.categoryId !== id);
  saveServices(svcs);
  return cats;
}

// Services
export function getServices(): Service[] {
  return load('salon_services', DEFAULT_SERVICES);
}
export function saveServices(svcs: Service[]) { save('salon_services', svcs); }
export function addService(svc: Omit<Service, 'id'>) {
  const svcs = getServices();
  svcs.push({ ...svc, id: generateId() });
  saveServices(svcs);
  return svcs;
}
export function updateService(id: string, updates: Partial<Service>) {
  const svcs = getServices().map(s => s.id === id ? { ...s, ...updates } : s);
  saveServices(svcs);
  return svcs;
}
export function deleteService(id: string) {
  const svcs = getServices().filter(s => s.id !== id);
  saveServices(svcs);
  return svcs;
}

// Booking Requests
export function getRequests(): BookingRequest[] {
  return load('salon_requests', []);
}
export function saveRequests(reqs: BookingRequest[]) { save('salon_requests', reqs); }
export function addRequest(req: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>) {
  const reqs = getRequests();
  reqs.push({ ...req, id: generateId(), createdAt: new Date().toISOString(), status: 'pending' });
  saveRequests(reqs);
  return reqs;
}
export function updateRequestStatus(id: string, status: BookingRequest["status"]) {
  const reqs = getRequests().map(r => r.id === id ? { ...r, status } : r);
  saveRequests(reqs);
  return reqs;
}
export function deleteRequest(id: string) {
  const reqs = getRequests().filter(r => r.id !== id);
  saveRequests(reqs);
  return reqs;
}
