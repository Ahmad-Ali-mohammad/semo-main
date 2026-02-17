import { MediaFolder, MediaItem } from '../types';
import { api } from './api';

export const mediaService = {
  getImages: async (folderId?: string, category?: string): Promise<MediaItem[]> => {
    try {
      return await api.getMedia(folderId, category);
    } catch (error) {
      console.error('Failed to fetch media:', error);
      return [];
    }
  },

  searchImages: async (searchTerm: string): Promise<MediaItem[]> => {
    try {
      return await api.searchMedia(searchTerm);
    } catch (error) {
      console.error('Failed to search media:', error);
      return [];
    }
  },

  getFolders: async (): Promise<MediaFolder[]> => {
    try {
      return await api.getMediaFolders();
    } catch (error) {
      console.error('Failed to fetch media folders:', error);
      return [];
    }
  },

  uploadImage: async (file: File, folderId?: string, category?: string): Promise<MediaItem> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const newImage: MediaItem = {
          id: `img-${Date.now()}`,
          url: base64,
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          fileType: file.type.startsWith('image/') ? 'image' : 'file',
          mimeType: file.type,
          date: new Date().toLocaleDateString('ar-SY'),
          folderId,
          category,
        };

        try {
          const savedImage = await api.uploadMedia(newImage);
          resolve(savedImage);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  updateImage: async (id: string, updates: Partial<MediaItem>): Promise<MediaItem> => {
    return await api.updateMedia(id, updates);
  },

  deleteImage: async (id: string): Promise<void> => {
    await api.deleteMedia(id);
  },

  bulkDeleteImages: async (ids: string[]): Promise<number> => {
    const result = await api.bulkDeleteMedia(ids);
    return result.deleted;
  }
};
