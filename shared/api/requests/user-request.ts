import httpClient from "../http-client";
import { userTypes } from "../types/user-types";


export const currentUserRequest = async (): Promise<userTypes['currentUserResponseDataType']> => {
    const response = await httpClient.get('/me');
    return response.data;
};

export const logoutRequest = async (): Promise<unknown> => {
    const response = await httpClient.post('/logout');
    return response.data;
};