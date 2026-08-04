export interface EntryItem {
    id: number;
    media_item_id: number;
    status: string;
    rating: number | null;
    notes: string | null;
    title: string;
    image_url: string;
    type: string;
    source: string;
    external_id: string;
    started_at: string | null;
    finished_at: string | null;
    updated_at: string | null;
}
