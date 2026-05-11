import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { BookingRequest, Category, Service } from "@/lib/salon-store";
import * as salonData from "@/lib/salon-data";

const errToast = (e: unknown) =>
  toast.error(e instanceof Error ? e.message : "Something went wrong.");

export const salonKeys = {
  stats: ["salon", "stats"] as const,
  categories: ["salon", "categories"] as const,
  services: ["salon", "services"] as const,
  requests: ["salon", "requests"] as const,
};

export function useSalonStats() {
  return useQuery({
    queryKey: salonKeys.stats,
    queryFn: () => salonData.fetchStats(),
    staleTime: 15_000,
  });
}

export function useSalonCategories() {
  return useQuery({
    queryKey: salonKeys.categories,
    queryFn: () => salonData.fetchCategories(),
    staleTime: 30_000,
  });
}

export function useSalonServices() {
  return useQuery({
    queryKey: salonKeys.services,
    queryFn: () => salonData.fetchServices(),
    staleTime: 30_000,
  });
}

export function useSalonRequests() {
  return useQuery({
    queryKey: salonKeys.requests,
    queryFn: () => salonData.fetchRequests(),
    staleTime: 15_000,
  });
}

export function useSalonMutations() {
  const qc = useQueryClient();

  const invalidateAll = () =>
    Promise.all([
      qc.invalidateQueries({ queryKey: salonKeys.stats }),
      qc.invalidateQueries({ queryKey: salonKeys.categories }),
      qc.invalidateQueries({ queryKey: salonKeys.services }),
      qc.invalidateQueries({ queryKey: salonKeys.requests }),
    ]);

  const createCategory = useMutation({
    mutationFn: salonData.createCategory,
    onSuccess: invalidateAll,
    onError: errToast,
  });

  const updateCategory = useMutation({
    mutationFn: (p: { id: string; input: Parameters<typeof salonData.updateCategory>[1] }) =>
      salonData.updateCategory(p.id, p.input),
    onSuccess: invalidateAll,
    onError: errToast,
  });

  const deleteCategory = useMutation({
    mutationFn: salonData.removeCategory,
    onSuccess: invalidateAll,
    onError: errToast,
  });

  const createService = useMutation({
    mutationFn: salonData.createService,
    onSuccess: invalidateAll,
    onError: errToast,
  });

  const updateService = useMutation({
    mutationFn: (p: { id: string; input: Parameters<typeof salonData.updateService>[1] }) =>
      salonData.updateService(p.id, p.input),
    onSuccess: invalidateAll,
    onError: errToast,
  });

  const deleteService = useMutation({
    mutationFn: salonData.removeService,
    onSuccess: invalidateAll,
    onError: errToast,
  });

  const patchRequest = useMutation({
    mutationFn: (p: { id: string; status: BookingRequest["status"] }) =>
      salonData.setRequestStatus(p.id, p.status),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: salonKeys.requests });
      void qc.invalidateQueries({ queryKey: salonKeys.stats });
    },
    onError: errToast,
  });

  const deleteRequest = useMutation({
    mutationFn: salonData.removeRequest,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: salonKeys.requests });
      void qc.invalidateQueries({ queryKey: salonKeys.stats });
    },
    onError: errToast,
  });

  const submitBooking = useMutation({
    mutationFn: salonData.submitBooking,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: salonKeys.requests });
      void qc.invalidateQueries({ queryKey: salonKeys.stats });
    },
    onError: errToast,
  });

  const toggleCategoryEnabled = useMutation({
    mutationFn: async (cat: Category) => {
      await salonData.updateCategory(cat.id, {
        name: cat.name,
        order: cat.order,
        enabled: !cat.enabled,
        imageUrl: cat.image,
      });
    },
    onSuccess: invalidateAll,
    onError: errToast,
  });

  const toggleServiceEnabled = useMutation({
    mutationFn: async (svc: Service) => {
      await salonData.updateService(svc.id, {
        categoryId: svc.categoryId,
        name: svc.name,
        price: svc.price,
        duration: svc.duration,
        description: svc.description,
        popular: svc.popular,
        enabled: !svc.enabled,
        imageUrl: svc.image,
      });
    },
    onSuccess: invalidateAll,
    onError: errToast,
  });

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    createService,
    updateService,
    deleteService,
    patchRequest,
    deleteRequest,
    submitBooking,
    toggleCategoryEnabled,
    toggleServiceEnabled,
    invalidateAll,
  };
}
