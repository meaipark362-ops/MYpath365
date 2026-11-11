/**
 * LocalStorage Safe Storage Adapter
 * - Prefix, Schema Version, JSON Error Handling, Validation, Safe Fallback
 * - Backend (e.g. Supabase) migration ready via StorageAdapter interface
 */

export interface StorageAdapter {
  getItem<T>(key: string, fallback: T): T;
  setItem<T>(key: string, value: T): boolean;
  removeItem(key: string): boolean;
  clear(): boolean;
}

export interface StorageEnvelope<T> {
  version: number;
  timestamp: string;
  data: T;
}

export const STORAGE_PREFIX = 'mypath365_';
export const CURRENT_SCHEMA_VERSION = 1;

class SafeLocalStorageService implements StorageAdapter {
  private prefix: string;
  private version: number;

  constructor(prefix = STORAGE_PREFIX, version = CURRENT_SCHEMA_VERSION) {
    this.prefix = prefix;
    this.version = version;
  }

  private getFullKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  private isAvailable(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    try {
      const testKey = `${this.prefix}__test__`;
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  public getItem<T>(key: string, fallback: T, validator?: (val: unknown) => val is T): T {
    if (!this.isAvailable()) return fallback;

    try {
      const raw = window.localStorage.getItem(this.getFullKey(key));
      if (!raw) return fallback;

      const envelope = JSON.parse(raw) as StorageEnvelope<T>;

      // Check if it's an enveloped object
      if (envelope && typeof envelope === 'object' && 'version' in envelope && 'data' in envelope) {
        // Migration strategy hook if schema versions differ
        const migratedData = this.migrateData(key, envelope.version, envelope.data);
        if (validator && !validator(migratedData)) {
          console.warn(`[SafeStorage] Data validation failed for key "${key}". Using fallback.`);
          return fallback;
        }
        return migratedData as T;
      }

      // Legacy direct JSON fallback
      if (validator && !validator(envelope)) {
        return fallback;
      }
      return envelope as unknown as T;
    } catch (err) {
      console.warn(`[SafeStorage] Failed to parse item for key "${key}":`, err);
      return fallback;
    }
  }

  public setItem<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) return false;

    try {
      const envelope: StorageEnvelope<T> = {
        version: this.version,
        timestamp: new Date().toISOString(),
        data: value,
      };
      window.localStorage.setItem(this.getFullKey(key), JSON.stringify(envelope));
      return true;
    } catch (err) {
      console.error(`[SafeStorage] Failed to save item for key "${key}":`, err);
      return false;
    }
  }

  public removeItem(key: string): boolean {
    if (!this.isAvailable()) return false;
    try {
      window.localStorage.removeItem(this.getFullKey(key));
      return true;
    } catch {
      return false;
    }
  }

  public clear(): boolean {
    if (!this.isAvailable()) return false;
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && k.startsWith(this.prefix)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => window.localStorage.removeItem(k));
      return true;
    } catch {
      return false;
    }
  }

  private migrateData(key: string, fromVersion: number, data: unknown): unknown {
    if (fromVersion === this.version) {
      return data;
    }
    // Migration logic for future versions (e.g. from version 0 to 1, etc.)
    console.info(`[SafeStorage] Migrating "${key}" from schema v${fromVersion} to v${this.version}`);
    return data;
  }
}

export const safeLocalStorage = new SafeLocalStorageService();
