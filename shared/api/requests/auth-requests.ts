import httpClient from "../http-client";
import { authTypes } from "../types/auth-types";


async function ensureCsrf() {
    try {
        await httpClient.get('/sanctum/csrf-cookie');
    } catch (e) {
        // ignore — caller will handle errors from the actual request
    }
}


export const loginRequest = async ({ data, url }: { data: authTypes['loginRequestBodyType'], url: string }): Promise<authTypes['loginResponseDataType']> => {
    await ensureCsrf();
    const response = await httpClient.post(url, data);
    return response.data;
};

export const registerRequest = async ({ data, url }: { data: authTypes['registerRequestBodyType'], url: string }): Promise<authTypes['registerResponseDataType']> => {
    await ensureCsrf();
    const response = await httpClient.post(url, data);
    return response.data;
};