import { apiRequestJson, apiRequestJsonWithAuth } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { SuiteDto } from "@/lib/types/suite";
import type { SuiteStatusValue } from "@/lib/domain/suite-status";

export async function fetchSuites(): Promise<SuiteDto[]> {
  return apiRequestJson<SuiteDto[]>(
    API_ENDPOINTS.suites,
    "Failed to load suites",
  );
}

export async function fetchSuiteById(id: string): Promise<SuiteDto> {
  return apiRequestJson<SuiteDto>(
    `${API_ENDPOINTS.suites}/${id}`,
    "Failed to load suite details",
  );
}

export type FindAvailableSuitesParams = {
  checkInDate: string;
  checkOutDate: string;
  category?: string;
};

export async function fetchAvailableSuites(
  params: FindAvailableSuitesParams,
): Promise<SuiteDto[]> {
  const query = new URLSearchParams({
    checkInDate: params.checkInDate,
    checkOutDate: params.checkOutDate,
    ...(params.category ? { category: params.category } : {}),
  });
  return apiRequestJson<SuiteDto[]>(
    `${API_ENDPOINTS.suitesAvailability}?${query.toString()}`,
    "Failed to load available suites",
  );
}

export async function patchSuiteStatus(
  id: string,
  status: SuiteStatusValue,
): Promise<SuiteDto> {
  return apiRequestJson<SuiteDto>(
    `${API_ENDPOINTS.suites}/${id}`,
    "Failed to update suite",
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    },
  );
}

export type CreateSuitePayload = {
  name: string;
  roomNumber: string;
  description: string;
  pricePerNight: number;
  category?: string;
  status?: string;
  imageUrl?: string | null;
};

export async function createSuite(body: CreateSuitePayload): Promise<SuiteDto> {
  return apiRequestJsonWithAuth<SuiteDto>(
    API_ENDPOINTS.suites,
    "Could not create suite",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
}
