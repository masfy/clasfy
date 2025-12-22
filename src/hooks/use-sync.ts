import { useState, useEffect, useCallback } from 'react';
import { StorageManager, SyncOperation } from '@/lib/storage-manager';
import { postToGAS } from '@/lib/api';
import { useToast } from '../components/ui/use-toast';

export function useSync() {
    const [isOnline, setIsOnline] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSynced, setLastSynced] = useState<Date | null>(null);
    const [syncError, setSyncError] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        // Initial status
        setIsOnline(navigator.onLine);

        // Event listeners
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // One-time auto-reset to clear stuck queues
    useEffect(() => {
        const hasReset = localStorage.getItem('sync_queue_reset_v3');
        if (!hasReset) {
            StorageManager.resetSyncQueue().then(() => {
                localStorage.setItem('sync_queue_reset_v3', 'true');
                console.log("Auto-reset sync queue to clear legacy data.");
            });
        }
    }, []);

    const syncData = useCallback(async () => {
        if (!isOnline || isSyncing) return;

        let queue = await StorageManager.getSyncQueue();
        if (queue.length === 0) return;

        // Filter out items that are too large (e.g. > 500KB) to prevent network errors
        const validQueue = queue.filter(op => {
            const size = JSON.stringify(op).length;
            if (size > 500000) {
                console.warn(`Dropping large sync operation (${size} bytes):`, op);
                return false;
            }
            return true;
        });

        // If items were dropped, update the queue immediately
        if (validQueue.length < queue.length) {
            const droppedIds = queue.filter(op => !validQueue.find(v => v.id === op.id)).map(op => op.id);
            await StorageManager.clearSyncQueue(droppedIds);
            queue = validQueue;
        }

        if (queue.length === 0) return;

        setIsSyncing(true);
        setSyncError(null);
        try {
            console.log(`[Sync] Starting sync for ${queue.length} items. Payload size: ${JSON.stringify(queue).length}`);

            // Send batch to backend
            const response = await postToGAS({
                action: 'sync',
                payload: queue
            });

            console.log("Sync Response Raw:", response); // DEBUG LOG

            if (response.status === 'success') {
                console.log("[Sync] Success! Results:", response.results)

                // Remove successful items from queue
                const successfulIds = (response.results || [])
                    .filter((r: any) => ['success', 'created', 'updated', 'deleted', 'created_fallback', 'updated_on_create'].includes(r.status))
                    .map((r: any) => r.id);

                if (successfulIds.length > 0) {
                    await StorageManager.clearSyncQueue(successfulIds);
                    console.log(`[Sync] Cleared ${successfulIds.length} items from queue.`);
                    toast({ title: "Data tersimpan!", description: `${successfulIds.length} perubahan berhasil disinkronkan.`, variant: "success" });
                } else {
                    console.warn("[Sync] No items marked as successful in response:", response);
                }

                setLastSynced(new Date());
                setSyncError(null);
            } else {
                console.error('Sync failed:', response.message);
                setSyncError(response.message || "Unknown sync error");
                toast({ title: "Gagal sinkronisasi", description: response.message || "Gagal menyimpan data ke server", variant: "destructive" });
                // Do NOT clear queue on error
            }
        } catch (error) {
            console.error('Sync error:', error);
            const msg = error instanceof Error ? error.message : "Network connection failed";
            setSyncError(msg);
            toast({ title: "Koneksi Bermasalah", description: "Gagal menghubungi server. Data akan disinkronkan nanti.", variant: "destructive" });
        } finally {
            setIsSyncing(false);
        }
    }, [isOnline, isSyncing, toast]);

    // Auto-sync interval
    useEffect(() => {
        if (isOnline) {
            const interval = setInterval(syncData, 10000); // Sync every 10 seconds
            return () => clearInterval(interval);
        }
    }, [isOnline, syncData]);

    const resetQueue = async () => {
        await StorageManager.resetSyncQueue();
        setLastSynced(new Date());
        toast({ title: "Antrian Reset", description: "Antrian sinkronisasi telah dikosongkan." });
    }

    return { isOnline, isSyncing, lastSynced, syncError, forceSync: syncData, resetQueue };
}
