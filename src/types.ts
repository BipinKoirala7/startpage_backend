import { ImageObject } from "open-graph-scraper/types/lib/types";

export type folderT = {
  folder_id: string;
  folder_name: string;
  folder_description: string;
  folder_icon_url: string | null;
  folder_background_color: string | undefined;
  created_at: string;
  updated_at: string | null;
};

export type linkT = {
  link_id: string;
  folder_id: string;
  link_name: string;
  link_icon_url: string | null;
  link_background_color: string | null;
  link_url: string;
  created_at: string;
};

export type apiResponseT<T> = {
  error: boolean;
  data: T | null;
  statusCode: number;
  message: string;
}

export type iconUrlT = {
  favicon: String | null;
  image: ImageObject[]  | null;
}