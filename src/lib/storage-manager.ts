import { get, set, clear } from 'idb-keyval';

export type SyncOperation = {
    id: string;
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    table: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    timestamp: number;
};

export class StorageManager {
    private static STORAGE_KEY = 'clasfy_offline_data';
    private static SYNC_QUEUE_KEY = 'clasfy_sync_queue';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async getData(table: string): Promise<any[] | null> {
        if (typeof window === 'undefined') return null;
        try {
            const data = await get(`${this.STORAGE_KEY}_${table}`);
            return data || null;
        } catch (error) {
            console.error(`Error getting data for ${table}:`, error);
            return null;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async saveData(table: string, data: any[]): Promise<void> {
        if (typeof window === 'undefined') return;
        try {
            await set(`${this.STORAGE_KEY}_${table}`, data);
        } catch (error) {
            console.error(`Error saving data for ${table}:`, error);
        }
    }

    static async addToSyncQueue(operation: Omit<SyncOperation, 'id' | 'timestamp'>): Promise<void> {
        if (typeof window === 'undefined') return;
        try {
            const queue = (await this.getSyncQueue()) || [];
            const newOp: SyncOperation = {
                ...operation,
                id: crypto.randomUUID(),
                timestamp: Date.now(),
            };
            queue.push(newOp);
            await set(this.SYNC_QUEUE_KEY, queue);
        } catch (error) {
            console.error('Error adding to sync queue:', error);
        }
    }

    static async getSyncQueue(): Promise<SyncOperation[]> {
        if (typeof window === 'undefined') return [];
        try {
            const queue = await get(this.SYNC_QUEUE_KEY);
            return queue || [];
        } catch (error) {
            console.error('Error getting sync queue:', error);
            return [];
        }
    }

    static async clearSyncQueue(processedIds: string[]): Promise<void> {
        if (typeof window === 'undefined') return;
        try {
            const queue = (await this.getSyncQueue()) || [];
            const remaining = queue.filter(op => !processedIds.includes(op.id));
            await set(this.SYNC_QUEUE_KEY, remaining);
        } catch (error) {
            console.error('Error clearing sync queue:', error);
        }
    }

    static async resetSyncQueue(): Promise<void> {
        if (typeof window === 'undefined') return;
        try {
            await set(this.SYNC_QUEUE_KEY, []);
        } catch (error) {
            console.error('Error resetting sync queue:', error);
        }
    }
    static async clearAllData(): Promise<void> {
        if (typeof window === 'undefined') return;
        try {
            await clear();
            console.log('All local data cleared from IndexedDB.');
        } catch (error) {
            console.error('Error clearing local data:', error);
        }
    }
}
