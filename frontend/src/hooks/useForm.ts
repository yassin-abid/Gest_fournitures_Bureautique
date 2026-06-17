/**
 * Custom React Hooks
 */

import { useState, useCallback, useEffect } from 'react';

/**
 * usePagination - Manage pagination state
 */
export const usePagination = (initialPage = 1, pageSize = 10) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(pageSize);

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const goToNextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const goToPreviousPage = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1));
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);
  }, [initialPage]);

  return {
    page,
    limit,
    setLimit,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    reset,
  };
};

/**
 * useForm - Manage form state
 */
interface FormConfig {
  initialValues: Record<string, any>;
  onSubmit?: (values: Record<string, any>) => Promise<void> | void;
  validate?: (values: Record<string, any>) => Record<string, string>;
}

export const useForm = (config: FormConfig) => {
  const [values, setValues] = useState(config.initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
      setValues((prev) => ({ ...prev, [name]: val }));
      if (touched[name]) {
        const newErrors = config.validate ? config.validate({ ...values, [name]: val }) : {};
        setErrors(newErrors);
      }
    },
    [config, touched, values]
  );

  const handleBlur = useCallback((e: React.FocusEvent<any>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (config.validate) {
      const newErrors = config.validate(values);
      setErrors(newErrors);
    }
  }, [config, values]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors = config.validate ? config.validate(values) : {};
      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        setIsSubmitting(true);
        try {
          if (config.onSubmit) {
            await config.onSubmit(values);
          }
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [config, values]
  );

  const reset = useCallback(() => {
    setValues(config.initialValues);
    setErrors({});
    setTouched({});
  }, [config.initialValues]);

  const setFieldValue = useCallback((name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
  };
};

/**
 * useDebounce - Debounce a value
 */
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * useLocalStorage - Persist state to localStorage
 */
export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue] as const;
};

/**
 * useWindowSize - Track window size
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

/**
 * useIsMobile - Check if viewport is mobile
 */
export const useIsMobile = (breakpoint = 768) => {
  const { width } = useWindowSize();
  return width < breakpoint;
};
