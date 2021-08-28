import { api } from 'src/boot/axios';
import { ServerPagination } from 'src/components/compositions';

export async function saveOrigin(
    originId: number | string,
    origin: Partial<Origin>,
) {
    return api.patch(`admin/origins/${originId}`, origin);
}

export interface Origin {
    id: number;
    name: string;
    providerName: string;
    valid: boolean;
    active: boolean;
    fields: { name: string; value: string }[];
    config: Record<string, string>;
    schedule: any;
}

export interface Provider {
    id: number;
    originId: number;
    name: string;
    active: boolean;
    config: Record<string, string>;
    fields: { name: string }[];
    options: string[];
}

export async function fetchOrigins() {
    const { data } = await api.get<ServerPagination<Origin>>('admin/origins');
    return data;
}

export async function findOrigin(id: number | string) {
    const { data } = await api.get<Origin>(`admin/origins/${id}`);

    return data;
}

export async function deleteOriginById(id: number | string) {
    const { data } = await api.delete(`admin/origins/${id}`);

    return data;
}

export async function updateOriginScheduler(originId: number, payload: any) {
    const { data } = await api.post(
        `admin/origins/${originId}/schedule`,
        payload,
    );
    return data;
}

export async function importOriginData(originId: number) {
    await api.post(`admin/origins/${originId}/import`);
}

export async function findOriginScheduler(originId: number) {
    const { data } = await api.get(`admin/origins/${originId}/schedule`);
    return data;
}

export async function fetchProviders() {
    const { data } = await api.get<Provider[]>('admin/providers');

    return data;
}
