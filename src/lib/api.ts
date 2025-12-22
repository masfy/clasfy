// Default fallback URL (Development / Demo)
const DEFAULT_API_URL = "https://script.google.com/macros/s/AKfycbzuJFeAeXwHbukVMsFPcUQ7JNZTwwMofD96nIfo-BKrjxj_BL2xSdwdLelianXCbIAzXA/exec";

// Helper to get the current API URL
export const getApiUrl = () => {
    // 1. Check Environment Variable (Highest Priority for Multi-School Deployment)
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }

    // 2. Check Local Storage (For User Override / "Bring Your Own Backend")
    if (typeof window !== 'undefined') {
        const storedUrl = localStorage.getItem('clasfy_api_url');
        if (storedUrl) return storedUrl;
    }

    // 3. Fallback to Default
    if (typeof window !== 'undefined') {
        // console.log("[API] Current URL Source:", storedUrl ? "LocalStorage" : "Default/Env");
    }
    return DEFAULT_API_URL;
};

export type ApiResponse<T = any> = {
    status: 'success' | 'error';
    data?: T;
    message?: string;
    results?: any[];
};

export async function fetchFromGAS(action: string, params: Record<string, string> = {}, retries = 3, backoff = 1000): Promise<ApiResponse> {
    const API_URL = getApiUrl();
    console.log(`[API] fetchFromGAS (${action}) using URL:`, API_URL);

    if (!API_URL) {
        console.warn('Google Apps Script API URL is not set.');
        return { status: 'error', message: 'API URL not configured' };
    }

    const url = new URL(API_URL);
    url.searchParams.append('action', action);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url.toString());
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(`[API] fetchFromGAS (${action}) response:`, data);
            return data;
        } catch (error) {
            console.error(`API Request Failed (Attempt ${i + 1}/${retries}):`, error);
            if (i === retries - 1) {
                return { status: 'error', message: 'Network error' };
            }
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, backoff * (i + 1)));
        }
    }
    return { status: 'error', message: 'Network error' };
}

export async function postToGAS(payload: any, retries = 3, backoff = 1000): Promise<ApiResponse> {
    const API_URL = getApiUrl();
    console.log("[API] Using URL:", API_URL); // DEBUG: Verify URL
    if (!API_URL) {
        console.warn('Google Apps Script API URL is not set.');
        return { status: 'error', message: 'API URL not configured' };
    }

    // Wrap payload in sync action structure if not already wrapped
    // The backend expects { action: 'sync', payload: [ ... ] }
    let finalPayload = payload;
    if (payload.action !== 'sync') {
        finalPayload = {
            action: 'sync',
            payload: Array.isArray(payload) ? payload : [payload]
        };
    }

    // Append action=sync to URL to be safe, as backend seems to check it
    const url = new URL(API_URL);
    url.searchParams.append('action', 'sync');

    for (let i = 0; i < retries; i++) {
        try {
            console.log(`[API] Posting to GAS (Attempt ${i + 1}/${retries}). Payload size: ${JSON.stringify(finalPayload).length} chars`);
            // console.log("[API] FULL PAYLOAD:", JSON.stringify(finalPayload, null, 2)); // DEBUG: Log full payload

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

            const response = await fetch(url.toString(), {
                method: 'POST',
                credentials: 'omit',
                headers: { "Content-Type": "text/plain" },
                body: JSON.stringify(finalPayload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('[API] Response from GAS:', data);
            return data;
        } catch (error: any) {
            console.error(`API Request Failed (Attempt ${i + 1}/${retries}):`, error);
            if (i === retries - 1) {
                if (error.name === 'AbortError') {
                    return { status: 'error', message: 'Request timed out' };
                }
                return { status: 'error', message: 'Network error: ' + error.message };
            }
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, backoff * (i + 1)));
        }
    }
    return { status: 'error', message: 'Network error' };
}
