import { AttributeDataType } from '../../../../src/generated/prisma/client.ts';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export type ProductCategorySeed = {
  name: string;
};

export type ProductSubCategorySeed = {
  name: string;
  categoryName: string;
};

export type TemplateAttributeSeed = {
  name: string;
  dataType: AttributeDataType;
  isRequired?: boolean;
};

export type TemplateSeed = {
  name: string;
  attributes: TemplateAttributeSeed[];
};

export type ProductSeed = {
  name: string;
  subCategoryName: string;
  templateName: string;
  description?: string;
  attributes: Record<string, JsonValue>;
};

export type ProductVariantSeed = {
  productName: string;
  sku: string;
  price: number;
  attributes: Record<string, JsonValue>;
};

/** ProductCategory model seed data. */
export const SEED_PRODUCT_CATEGORIES: ProductCategorySeed[] = [
  { name: 'Fashion & Apparel' },
  { name: 'Electronics' },
  { name: 'Food & Beverage' },
  { name: 'Automotive' },
  { name: 'Health & Beauty' },
  { name: 'Agriculture' },
  { name: 'Furniture' },
  { name: 'Software & SaaS' },
];

/** ProductSubCategory model seed data. */
export const SEED_PRODUCT_SUBCATEGORIES: ProductSubCategorySeed[] = [
  { categoryName: 'Fashion & Apparel', name: 'Men Clothing' },
  { categoryName: 'Fashion & Apparel', name: 'Women Clothing' },
  { categoryName: 'Fashion & Apparel', name: 'Shoes' },
  { categoryName: 'Fashion & Apparel', name: 'Accessories' },
  { categoryName: 'Electronics', name: 'Smartphones' },
  { categoryName: 'Electronics', name: 'Laptops' },
  { categoryName: 'Electronics', name: 'Televisions' },
  { categoryName: 'Electronics', name: 'Accessories' },
  { categoryName: 'Food & Beverage', name: 'Packaged Food' },
  { categoryName: 'Food & Beverage', name: 'Drinks' },
  { categoryName: 'Food & Beverage', name: 'Fresh Produce' },
  { categoryName: 'Automotive', name: 'Cars' },
  { categoryName: 'Automotive', name: 'Motorcycles' },
  { categoryName: 'Automotive', name: 'Parts' },
  { categoryName: 'Health & Beauty', name: 'Skincare' },
  { categoryName: 'Health & Beauty', name: 'Medicine' },
  { categoryName: 'Health & Beauty', name: 'Supplements' },
  { categoryName: 'Agriculture', name: 'Seeds' },
  { categoryName: 'Agriculture', name: 'Fertilizers' },
  { categoryName: 'Agriculture', name: 'Machinery' },
  { categoryName: 'Furniture', name: 'Home Furniture' },
  { categoryName: 'Furniture', name: 'Office Furniture' },
  { categoryName: 'Software & SaaS', name: 'CRM Tools' },
  { categoryName: 'Software & SaaS', name: 'Analytics Tools' },
  { categoryName: 'Software & SaaS', name: 'Dev Tools' },
];

/** Template and TemplateAttribute model seed data. */
export const SEED_TEMPLATES: TemplateSeed[] = [
  {
    name: 'Fashion Product Template',
    attributes: [
      { name: 'size', dataType: AttributeDataType.STRING, isRequired: true },
      { name: 'color', dataType: AttributeDataType.STRING, isRequired: true },
      { name: 'material', dataType: AttributeDataType.STRING },
      { name: 'brand', dataType: AttributeDataType.STRING },
      { name: 'price', dataType: AttributeDataType.DOUBLE, isRequired: true },
    ],
  },
  {
    name: 'Electronics Product Template',
    attributes: [
      { name: 'brand', dataType: AttributeDataType.STRING },
      { name: 'model', dataType: AttributeDataType.STRING, isRequired: true },
      { name: 'ram_gb', dataType: AttributeDataType.INT },
      { name: 'storage_gb', dataType: AttributeDataType.INT },
      { name: 'warranty_months', dataType: AttributeDataType.INT },
      { name: 'price', dataType: AttributeDataType.DOUBLE },
    ],
  },
  {
    name: 'Food Product Template',
    attributes: [
      { name: 'expiry_date', dataType: AttributeDataType.DATE_TIME },
      { name: 'weight_grams', dataType: AttributeDataType.DOUBLE },
      { name: 'organic', dataType: AttributeDataType.BOOLEAN },
      { name: 'brand', dataType: AttributeDataType.STRING },
      { name: 'price', dataType: AttributeDataType.DOUBLE },
    ],
  },
  {
    name: 'Automotive Template',
    attributes: [
      { name: 'brand', dataType: AttributeDataType.STRING },
      { name: 'model', dataType: AttributeDataType.STRING },
      { name: 'year', dataType: AttributeDataType.INT },
      { name: 'engine_size', dataType: AttributeDataType.STRING },
      { name: 'fuel_type', dataType: AttributeDataType.STRING },
      { name: 'price', dataType: AttributeDataType.DOUBLE },
    ],
  },
  {
    name: 'Health Product Template',
    attributes: [
      { name: 'dosage', dataType: AttributeDataType.STRING },
      { name: 'form', dataType: AttributeDataType.STRING },
      { name: 'expiry_date', dataType: AttributeDataType.DATE_TIME },
      { name: 'is_prescription', dataType: AttributeDataType.BOOLEAN },
      { name: 'price', dataType: AttributeDataType.DOUBLE },
    ],
  },
  {
    name: 'Agriculture Template',
    attributes: [
      { name: 'type', dataType: AttributeDataType.STRING },
      { name: 'season', dataType: AttributeDataType.STRING },
      { name: 'organic', dataType: AttributeDataType.BOOLEAN },
      { name: 'weight_kg', dataType: AttributeDataType.DOUBLE },
    ],
  },
  {
    name: 'Furniture Template',
    attributes: [
      { name: 'material', dataType: AttributeDataType.STRING },
      { name: 'dimensions', dataType: AttributeDataType.STRING },
      { name: 'color', dataType: AttributeDataType.STRING },
      { name: 'weight_kg', dataType: AttributeDataType.DOUBLE },
      { name: 'price', dataType: AttributeDataType.DOUBLE },
    ],
  },
  {
    name: 'Software Template',
    attributes: [
      { name: 'version', dataType: AttributeDataType.STRING },
      { name: 'license_type', dataType: AttributeDataType.STRING },
      { name: 'platform', dataType: AttributeDataType.STRING },
      { name: 'subscription_monthly_price', dataType: AttributeDataType.DOUBLE },
      { name: 'is_cloud', dataType: AttributeDataType.BOOLEAN },
    ],
  },
];

/** Product model seed data. */
export const SEED_PRODUCTS: ProductSeed[] = [
  {
    name: 'Slim Fit Jeans',
    subCategoryName: 'Men Clothing',
    templateName: 'Fashion Product Template',
    attributes: { size: '32', color: 'Blue', material: 'Denim', brand: 'Levis', price: 49.99 },
  },
  {
    name: 'Summer Dress',
    subCategoryName: 'Women Clothing',
    templateName: 'Fashion Product Template',
    attributes: { size: 'M', color: 'Red', material: 'Cotton', brand: 'Zara', price: 39.99 },
  },
  {
    name: 'iPhone 15 Pro',
    subCategoryName: 'Smartphones',
    templateName: 'Electronics Product Template',
    attributes: {
      brand: 'Apple',
      model: 'iPhone 15 Pro',
      ram_gb: 8,
      storage_gb: 256,
      warranty_months: 12,
      price: 1299,
    },
  },
  {
    name: 'Dell XPS 15',
    subCategoryName: 'Laptops',
    templateName: 'Electronics Product Template',
    attributes: {
      brand: 'Dell',
      model: 'XPS 15',
      ram_gb: 16,
      storage_gb: 1024,
      warranty_months: 24,
      price: 1899,
    },
  },
  {
    name: 'Organic Honey',
    subCategoryName: 'Packaged Food',
    templateName: 'Food Product Template',
    attributes: {
      expiry_date: new Date().toISOString(),
      weight_grams: 500,
      organic: true,
      brand: 'Natural Farms',
      price: 12.5,
    },
  },
  {
    name: 'Toyota Corolla 2024',
    subCategoryName: 'Cars',
    templateName: 'Automotive Template',
    attributes: {
      brand: 'Toyota',
      model: 'Corolla',
      year: 2024,
      engine_size: '1.8L',
      fuel_type: 'Hybrid',
      price: 25000,
    },
  },
  {
    name: 'Paracetamol 500mg',
    subCategoryName: 'Medicine',
    templateName: 'Health Product Template',
    attributes: {
      dosage: '500mg',
      form: 'Tablet',
      expiry_date: new Date().toISOString(),
      is_prescription: false,
      price: 2.5,
    },
  },
  {
    name: 'Maize Seeds Premium',
    subCategoryName: 'Seeds',
    templateName: 'Agriculture Template',
    attributes: { type: 'Maize', season: 'Summer', organic: true, weight_kg: 5 },
  },
  {
    name: 'Office Desk',
    subCategoryName: 'Office Furniture',
    templateName: 'Furniture Template',
    attributes: {
      material: 'Wood',
      dimensions: '120x60x75 cm',
      color: 'Brown',
      weight_kg: 25,
      price: 199,
    },
  },
  {
    name: 'CRM Pro SaaS',
    subCategoryName: 'CRM Tools',
    templateName: 'Software Template',
    attributes: {
      version: '2.0',
      license_type: 'Subscription',
      platform: 'Web',
      subscription_monthly_price: 29.99,
      is_cloud: true,
    },
  },
];

/** ProductVariant model seed data. */
export const SEED_PRODUCT_VARIANTS: ProductVariantSeed[] = [
  { productName: 'Slim Fit Jeans', sku: 'JEAN-32-BLUE', price: 49.99, attributes: { size: '32' } },
  { productName: 'Summer Dress', sku: 'DRESS-M-RED', price: 39.99, attributes: { size: 'M' } },
  {
    productName: 'iPhone 15 Pro',
    sku: 'IPHONE15P-256',
    price: 1299,
    attributes: { color: 'Black' },
  },
  { productName: 'Dell XPS 15', sku: 'XPS15-16-1TB', price: 1899, attributes: { color: 'Silver' } },
  { productName: 'Organic Honey', sku: 'HONEY-500G', price: 12.5, attributes: { unit: 'Jar' } },
  {
    productName: 'Toyota Corolla 2024',
    sku: 'COROLLA-2024-HYB',
    price: 25000,
    attributes: { trim: 'Base' },
  },
  {
    productName: 'Paracetamol 500mg',
    sku: 'PARA-500MG-TAB',
    price: 2.5,
    attributes: { pack_size: 20 },
  },
  {
    productName: 'Maize Seeds Premium',
    sku: 'MAIZE-5KG',
    price: 19.99,
    attributes: { unit: 'Bag' },
  },
  {
    productName: 'Office Desk',
    sku: 'DESK-120-BROWN',
    price: 199,
    attributes: { finish: 'Matte' },
  },
  {
    productName: 'CRM Pro SaaS',
    sku: 'CRM-PRO-MONTHLY',
    price: 29.99,
    attributes: { billing: 'monthly' },
  },
];
