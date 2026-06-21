import httpClient from './http-client';
import { endpoints } from './endpoints';

export async function uploadImage(file: File): Promise<{ preview_url: string; full_url: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const { data } = await httpClient.post<{ success: boolean; data: { preview_url: string; full_url: string } }>(
        endpoints.uploadImage,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return data.data;
}