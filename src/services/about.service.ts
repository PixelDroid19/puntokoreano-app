// services/about.service.ts
import axios from "axios";
import ENDPOINTS from "@/api";
import { PublicAboutSettings } from "@/types/about.types";

class AboutService {
  private static instance: AboutService;

  private constructor() {}

  public static getInstance(): AboutService {
    if (!AboutService.instance) {
      AboutService.instance = new AboutService();
    }
    return AboutService.instance;
  }

  async getPublicAboutSettings(): Promise<PublicAboutSettings> {
    const response = await axios.get(ENDPOINTS.SETTINGS.GET_PUBLIC_ABOUT.url);
    return response.data.data;
  }
}

export default AboutService.getInstance();
