import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export class StaticApiKeyInHeaderApiClient {
  private axiosInstance: AxiosInstance;

  constructor(baseUrl: string, staticHeaderProps: Record<string, string>) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        "Content-Type": "application/json",
        ...staticHeaderProps,
      },
    });
  }

  public async get(path: string, config?: AxiosRequestConfig<any>): Promise<any> {
    try {
      const response: AxiosResponse = await this.axiosInstance.get(path, config);
      return response.data;
    } catch (error) {
      console.error("[StaticApiKeyInHeaderApiClient] Error making GET request:", error);
      throw error;
    }
  }

  public async post(path: string, data?: any, config?: AxiosRequestConfig<any>): Promise<any> {
    try {
      const response: AxiosResponse = await this.axiosInstance.post(path, data, config);
      return response.data;
    } catch (error) {
      console.error("[StaticApiKeyInHeaderApiClient] Error making POST request:", error);
      throw error;
    }
  }

  public async put(path: string, data?: any, config?: AxiosRequestConfig<any>): Promise<any> {
    try {
      const response: AxiosResponse = await this.axiosInstance.put(path, data, config);
      return response.data;
    } catch (error) {
      console.error("[StaticApiKeyInHeaderApiClient] Error making PUT request:", error);
      throw error;
    }
  }

  public async patch(path: string, data?: any, config?: AxiosRequestConfig<any>): Promise<any> {
    try {
      const response: AxiosResponse = await this.axiosInstance.patch(path, data, config);
      return response.data;
    } catch (error) {
      console.error("[StaticApiKeyInHeaderApiClient] Error making PATCH request:", error);
      throw error;
    }
  }

  public async delete(path: string, config?: AxiosRequestConfig<any>): Promise<any> {
    try {
      const response: AxiosResponse = await this.axiosInstance.delete(path, config);
      return response.data;
    } catch (error) {
      console.error("[StaticApiKeyInHeaderApiClient] Error making DELETE request:", error);
      throw error;
    }
  }
}
