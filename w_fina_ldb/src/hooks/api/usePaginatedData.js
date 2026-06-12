/**
 * Paginated Data Hook
 * For handling paginated lists with automatic refetching
 */
import { useState, useCallback, useEffect } from 'react';
import { useApiCall } from './useApiCall';
import { PAGINATION } from '@/config/constants';

export const usePaginatedData = (fetchFunction, options = {}) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(options.initialPage || PAGINATION.DEFAULT_PAGE);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const { execute, loading, error } = useApiCall();

  const limit = options.limit || PAGINATION.DEFAULT_LIMIT;

  const fetchData = useCallback(async (currentPage = page) => {
    const result = await execute(() =>
      fetchFunction({
        page: currentPage,
        limit,
        ...options.params,
      })
    );

    if (result.success) {
      const responseData = result.data;
      setData(responseData.data || responseData.applicants || []);
      setTotal(responseData.total || 0);
      setTotalPages(
        Math.ceil((responseData.total || 0) / limit)
      );
    }
  }, [execute, fetchFunction, page, limit, options.params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const nextPage = useCallback(() => {
    setPage(p => Math.min(p + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setPage(p => Math.max(p - 1, 1));
  }, []);

  const goToPage = useCallback((pageNum) => {
    setPage(Math.max(1, Math.min(pageNum, totalPages)));
  }, [totalPages]);

  const refresh = useCallback(() => {
    fetchData(page);
  }, [fetchData, page]);

  return {
    data,
    loading,
    error,
    page,
    total,
    totalPages,
    limit,
    nextPage,
    prevPage,
    goToPage,
    refresh,
    setPage,
  };
};
