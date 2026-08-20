export interface Product {
    id: string;
    title: string;
    titleEn?: string;
    category: 'leafy' | 'fruits' | 'herbs' | 'mushrooms' | 'kits' | string;
    categoryName: string;
    categoryNameEn?: string;
    price: number;
    originalPrice: number;
    rating: number;
    reviews: number;
    discount: string;
    image: string;
    desc: string;
    descEn?: string;
    weight: string;
    weightEn?: string;
    harvestTime: string;
    stockStatus: string;
    farmOrigin: string;
    nutrition: string;
    nutritionEn?: string;
    storageTip: string;
    culinaryUses: string;
}

export interface CartItem {
    product: Product;
    qty: number;
}

export type RatingFilterType = 'all' | '4.5' | '4.0' | '3.0';

export interface FilterState {
    category: string;
    searchQuery: string;
    maxPrice: number;
    organicOnly: boolean;
    readyStockOnly: boolean;
    rating: RatingFilterType;
    sortBy: 'popular' | 'price-low' | 'price-high' | 'name';
}
