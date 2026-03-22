import { useState, useCallback, useEffect } from 'react';
import {
  getSermons,
  getEvents,
  getMinistries,
  getPastors,
  getTestimonials,
  upsertSermon,
  upsertEvent,
  upsertMinistry,
  upsertPastor,
  upsertTestimonial,
  deleteSermon,
  deleteEvent,
  deleteMinistry,
  deletePastor,
  deleteTestimonial,
  publishNow,
  saveDraft,
  schedulePublish,
} from '../services/contentService';

type ContentType = 'sermon' | 'event' | 'ministry' | 'pastor' | 'testimonial';

interface UseAdminContentResult {
  items: any[];
  loading: boolean;
  error: string | null;
  updateItem: (index: number, field: string, value: any) => void;
  saveItem: (item: any, publishState?: 'draft' | 'now' | 'scheduled', scheduledDate?: string) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  addNewItem: (template: Record<string, any>) => void;
  refresh: () => Promise<void>;
}

export function useAdminContent(type: ContentType): UseAdminContentResult {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getContentFn = useCallback(() => {
    switch (type) {
      case 'sermon':
        return getSermons();
      case 'event':
        return getEvents();
      case 'ministry':
        return getMinistries();
      case 'pastor':
        return getPastors();
      case 'testimonial':
        return getTestimonials();
      default:
        return Promise.resolve([]);
    }
  }, [type]);

  const upsertFn = useCallback((item: any) => {
    switch (type) {
      case 'sermon':
        return upsertSermon(item);
      case 'event':
        return upsertEvent(item);
      case 'ministry':
        return upsertMinistry(item);
      case 'pastor':
        return upsertPastor(item);
      case 'testimonial':
        return upsertTestimonial(item);
    }
  }, [type]);

  const deleteFn = useCallback((id: string) => {
    switch (type) {
      case 'sermon':
        return deleteSermon(id);
      case 'event':
        return deleteEvent(id);
      case 'ministry':
        return deleteMinistry(id);
      case 'pastor':
        return deletePastor(id);
      case 'testimonial':
        return deleteTestimonial(id);
    }
  }, [type]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getContentFn();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  }, [getContentFn]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateItem = useCallback((index: number, field: string, value: any) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const saveItem = useCallback(
    async (item: any, publishState: 'draft' | 'now' | 'scheduled' = 'now', scheduledDate?: string) => {
      try {
        setError(null);

        // Prepare item with publish state - create clean object without undefined values
        const itemToSave: any = { ...item };

        // Handle publishing state
        if (publishState === 'draft') {
          itemToSave.published = false;
          delete itemToSave.publishedAt;
          delete itemToSave.scheduledPublishAt;
        } else if (publishState === 'scheduled' && scheduledDate) {
          itemToSave.published = false;
          delete itemToSave.publishedAt;
          itemToSave.scheduledPublishAt = scheduledDate;
        } else {
          itemToSave.published = true;
          itemToSave.publishedAt = new Date().toISOString();
          delete itemToSave.scheduledPublishAt;
        }

        // Save the item (handles both create and update)
        await upsertFn(itemToSave);

        // Update local state
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? itemToSave : i))
        );
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to save item';
        setError(errorMsg);
        throw err;
      }
    },
    [type, upsertFn]
  );

  const deleteItem = useCallback(
    async (id: string) => {
      try {
        setError(null);
        await deleteFn(id);
        setItems((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to delete item';
        setError(errorMsg);
        throw err;
      }
    },
    [deleteFn]
  );

  const addNewItem = useCallback((template: Record<string, any>) => {
    const newItem = {
      ...template,
      id: crypto.randomUUID?.() || `${Date.now()}`,
      published: false,
    };
    setItems((prev) => [...prev, newItem]);
  }, []);

  return {
    items,
    loading,
    error,
    updateItem,
    saveItem,
    deleteItem,
    addNewItem,
    refresh,
  };
}
