export default interface ApiCategoryDto {
    categoryId: number;
    name: string;
    imagePath: string;
    parentCategoryId: number | null;
}