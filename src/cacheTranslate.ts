
import XXH from 'xxhashjs'
import { TranslateResultT } from "./types"
import { translate } from './utils'

const MAX_CACHE_SIZE = 2500
const DB_NAME = 'TranslationCacheDB'
const STORE_NAME = 'cache'

interface CacheItem {
  key: string
  result: TranslateResultT
  timestamp: number
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' })
        store.createIndex('timestamp', 'timestamp', { unique: false })
      }
    }
  })
}

async function getFromIDB(key: string): Promise<CacheItem | undefined> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(key)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

async function setToIDB(item: CacheItem): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    
    const countRequest = store.count()
    countRequest.onsuccess = () => {
      if (countRequest.result >= MAX_CACHE_SIZE) {
        const index = store.index('timestamp')
        const cursorRequest = index.openCursor(null, 'next')
        cursorRequest.onsuccess = (e) => {
          const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result
          if (cursor) {
            store.delete(cursor.primaryKey)
          }
        }
      }
      store.put(item)
    }
    
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
  })
}

function generateKey(srcLang: string, targetLang: string, text: string): string {
  const raw = `${srcLang}:${targetLang}:${text}`
  return XXH.h64(raw, 0xabcd).toString(16)
}

export async function cacheTranslate(
  srcLang: string, 
  targetLang: string, 
  text: string
): Promise<TranslateResultT> {
  const key = generateKey(srcLang, targetLang, text)
  const cached = await getFromIDB(key)

  if (cached) {
    return {
      ...cached.result,
      isCache: true
    }
  }

  const result = await translate(srcLang, targetLang, text)
  if (result.succ) {
    await setToIDB({
      key,
      result: { ...result, isCache: false },
      timestamp: Date.now()
    })
  }

  return {
    ...result,
    isCache: false
  }
}