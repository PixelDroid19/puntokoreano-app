// services/about.service.ts

import { PublicAboutSettings } from "@/types/about.types";
import { apiGet, ENDPOINTS } from "@/api/apiClient";

class AboutService {
  private static instance: AboutService;

  private constructor() { }

  public static getInstance(): AboutService {
    if (!AboutService.instance) {
      AboutService.instance = new AboutService();
    }
    return AboutService.instance;
  }


  async getPublicAboutSettings(): Promise<PublicAboutSettings> {
    const response = await apiGet(ENDPOINTS.SETTINGS.GET_PUBLIC_ABOUT);

    return response?.data;
  }
}

export default AboutService.getInstance();
