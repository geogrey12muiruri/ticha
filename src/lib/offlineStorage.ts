/**
 * Offline storage utilities using IndexedDB
 * Stores chat messages, user preferences, and other data locally
 */

const DB_NAME = 'jifunze_ai_db'
const DB_VERSION = 1
const STORES = {
  MESSAGES: 'messages',
  USER_PREFS: 'user_prefs',
  CACHE: 'cache',
}

let dbInstance: IDBDatabase | null = null

/**
 * Initialize IndexedDB
 */
export async function initDB(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      dbInstance = request.result
      resolve(dbInstance)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Messages store
      if (!db.objectStoreNames.contains(STORES.MESSAGES)) {
        const messagesStore = db.createObjectStore(STORES.MESSAGES, { keyPath: 'id' })
        messagesStore.createIndex('timestamp', 'timestamp', { unique: false })
        messagesStore.createIndex('userId', 'userId', { unique: false })
      }

      // User preferences store
      if (!db.objectStoreNames.contains(STORES.USER_PREFS)) {
        db.createObjectStore(STORES.USER_PREFS, { keyPath: 'key' })
      }

      // Cache store
      if (!db.objectStoreNames.contains(STORES.CACHE)) {
        const cacheStore = db.createObjectStore(STORES.CACHE, { keyPath: 'key' })
        cacheStore.createIndex('expiry', 'expiry', { unique: false })
      }
    }
  })
}

/**
 * Save chat message to offline storage
 */
export async function saveMessage(message: any): Promise<void> {
  try {
    const db = await initDB()
    const tx = db.transaction(STORES.MESSAGES, 'readwrite')
    const store = tx.objectStore(STORES.MESSAGES)
    
    // Wrap IDBRequest in a Promise
    await new Promise<void>((resolve, reject) => {
      const request = store.put({
        ...message,
        timestamp: message.timestamp?.getTime() || Date.now(),
        synced: false, // Mark as not synced for later sync
      })
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
    
    await tx.done
  } catch (error) {
    console.error('Failed to save message offline:', error)
  }
}

/**
 * Get all messages from offline storage
 */
export async function getMessages(): Promise<any[]> {
  try {
    const db = await initDB()
    const tx = db.transaction(STORES.MESSAGES, 'readonly')
    const store = tx.objectStore(STORES.MESSAGES)
    const index = store.index('timestamp')
    
    // Wrap IDBRequest in a Promise
    const messages = await new Promise<any[]>((resolve, reject) => {
      const request = index.getAll()
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
    
    await tx.done

    // Ensure messages is an array before mapping
    if (!Array.isArray(messages)) {
      console.warn('getMessages: messages is not an array', messages)
      return []
    }

    return messages.map((msg) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }))
  } catch (error) {
    console.error('Failed to get messages:', error)
    return []
  }
}

/**
 * Save user preferences
 */
export async function saveUserPrefs(key: string, value: any): Promise<void> {
  try {
    const db = await initDB()
    const tx = db.transaction(STORES.USER_PREFS, 'readwrite')
    const store = tx.objectStore(STORES.USER_PREFS)
    
    // Wrap IDBRequest in a Promise
    await new Promise<void>((resolve, reject) => {
      const request = store.put({ key, value })
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
    
    await tx.done
  } catch (error) {
    console.error('Failed to save user prefs:', error)
  }
}

/**
 * Get user preferences
 */
export async function getUserPrefs(key: string): Promise<any | null> {
  try {
    const db = await initDB()
    const tx = db.transaction(STORES.USER_PREFS, 'readonly')
    const store = tx.objectStore(STORES.USER_PREFS)
    
    // Wrap IDBRequest in a Promise
    const result = await new Promise<any>((resolve, reject) => {
      const request = store.get(key)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    
    await tx.done
    return result?.value || null
  } catch (error) {
    console.error('Failed to get user prefs:', error)
    return null
  }
}

/**
 * Check if IndexedDB is available
 */
export function isIndexedDBAvailable(): boolean {
  return typeof window !== 'undefined' && 'indexedDB' in window
}

