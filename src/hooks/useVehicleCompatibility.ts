import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiGet, ENDPOINTS } from '@/api/apiClient';

interface Vehicle {
  _id: string;
  model: {
    _id: string;
    name: string;
    year: number;
    family: {
      _id: string;
      name: string;
      brand: {
        _id: string;
        name: string;
      };
    };
  };
  transmission_id?: {
    _id: string;
    name: string;
  };
  fuel_id?: {
    _id: string;
    name: string;
  };
  color?: string;
  active: boolean;
  displayName?: string;
  fullInfo?: {
    brand?: string;
    family?: string;
    model?: string;
    year?: number;
    transmission?: string;
    fuel?: string;
    color?: string;
  };
}

interface VehicleCompatibilityResponse {
  success: boolean;
  message: string;
  data: {
    vehicles: Vehicle[];
    pagination: {
      total: number;
      page: number;
      pages: number;
      perPage: number;
      hasMore: boolean;
    };
    type: string;
    groupId?: string;
  };
}

interface UseVehicleCompatibilityProps {
  productId: string;
  enabled?: boolean;
  initialPage?: number;
  limit?: number;
  type?: 'all' | 'direct' | 'groups';
  groupId?: string;
}

export const useVehicleCompatibility = ({
  productId,
  enabled = true,
  initialPage = 1,
  limit = 10,
  type = 'all',
  groupId
}: UseVehicleCompatibilityProps) => {
  const [page, setPage] = useState(initialPage);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);

  const queryKey = ['vehicleCompatibility', productId, page, limit, type, groupId];

  const query = useQuery<VehicleCompatibilityResponse>({
    queryKey,
    queryFn: () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        type,
        ...(groupId && { groupId })
      });

      return apiGet<VehicleCompatibilityResponse>(
        ENDPOINTS.PRODUCTS.VEHICLE_COMPATIBILITY,
        { id: productId },
        Object.fromEntries(params)
      );
    },
    enabled: enabled && !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });

  const loadMore = useCallback(() => {
    if (query.data?.data?.pagination?.hasMore) {
      setPage(prev => prev + 1);
    }
  }, [query.data?.data?.pagination?.hasMore]);

  const resetPagination = useCallback(() => {
    setPage(1);
    setAllVehicles([]);
  }, []);

  // Acumular vehículos cuando se cargan nuevas páginas
  const vehicles = query.data?.data?.vehicles || [];
  const pagination = query.data?.data?.pagination;

  return {
    vehicles,
    pagination,
    allVehicles,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    loadMore,
    resetPagination,
    hasMore: pagination?.hasMore || false,
    currentPage: page,
    refetch: query.refetch
  };
};

export default useVehicleCompatibility; 