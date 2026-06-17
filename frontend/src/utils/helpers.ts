/**
 * Common Utility Functions
 */

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

export const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const retry = async <T>(
  fn: () => Promise<T>,
  options: { maxAttempts?: number; delay?: number; backoff?: boolean } = {}
): Promise<T> => {
  const { maxAttempts = 3, delay = 1000, backoff = true } = options;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;

      const waitTime = backoff ? delay * Math.pow(2, attempt - 1) : delay;
      await wait(waitTime);
    }
  }

  throw new Error('Retry failed');
};

export const cloneObject = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

export const mergeObjects = <T extends Record<string, any>>(...objects: T[]): T => {
  return objects.reduce((acc, obj) => ({ ...acc, ...obj }), {} as T);
};

export const filterObject = <T extends Record<string, any>>(
  obj: T,
  predicate: (key: string, value: any) => boolean
): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => predicate(key, value))
  ) as Partial<T>;
};

export const flattenObject = (
  obj: Record<string, any>,
  prefix: string = ''
): Record<string, any> => {
  const result: Record<string, any> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(result, flattenObject(value, newKey));
      } else {
        result[newKey] = value;
      }
    }
  }

  return result;
};

export const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const shuffle = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};
