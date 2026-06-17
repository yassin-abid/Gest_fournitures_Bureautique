/**
 * Search Input Component
 */

import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onSearch?: (value: string) => void;
  onClear?: () => void;
  value?: string;
  debounceMs?: number;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, onClear, value, debounceMs = 300, className = '', ...props }, ref) => {
    const [searchValue, setSearchValue] = React.useState(value || '');

    React.useEffect(() => {
      const timer = setTimeout(() => {
        onSearch?.(searchValue);
      }, debounceMs);

      return () => clearTimeout(timer);
    }, [searchValue, debounceMs, onSearch]);

    const handleClear = () => {
      setSearchValue('');
      onClear?.();
    };

    return (
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
        <input
          ref={ref}
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search..."
          className={`w-full pl-10 pr-10 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${className}`}
          {...props}
        />
        {searchValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
