export default class ArticleType{
    articleId?: number;
    name?: string;
    excerpt?: string;
    description?: string;
    imageUrl?: string;
    price?: number;
    status?: "available" | "visible" | "hidden";
    isPromoted?: number;
    articleFeatures?: {
        articleFeatureId: number;
        featureId: number;
        value: string;
    }[];
    features?: {
        featureId: number;
        name: string;
    }[];
    articlePrices?: {
        articlePriceId: number;
        price: number;
    }[];
    photos?: {
        photoId: number;
        imagePath: string;
    }[];
    categoryId?: number;
    category?: {
        name: string;
    };
}