import type { Prisma } from '../../../src/generated/prisma/client.ts';
import { prisma } from '../../../src/config/db.ts';
import {
  SEED_PRODUCT_CATEGORIES,
  SEED_PRODUCTS,
  SEED_PRODUCT_SUBCATEGORIES,
  SEED_PRODUCT_VARIANTS,
  SEED_TEMPLATES,
} from './data/productSeeder.ts';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function indexedRowsFromAttributes(
  organizationId: string,
  productId: string,
  attributes: Record<string, JsonValue>,
  createdById: string,
): Prisma.ProductIndexedAttributeCreateManyInput[] {
  const rows: Prisma.ProductIndexedAttributeCreateManyInput[] = [];
  for (const [key, value] of Object.entries(attributes)) {
    if (value === null || value === undefined) continue;
    const base = {
      organizationId,
      productId,
      key,
      createdById,
    };
    if (typeof value === 'string') {
      const asDate = Date.parse(value);
      if (!Number.isNaN(asDate) && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
        rows.push({ ...base, valueDate: new Date(asDate) });
      } else {
        rows.push({ ...base, valueString: value });
      }
    } else if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        rows.push({ ...base, valueInt: value });
      } else {
        rows.push({ ...base, valueFloat: value });
      }
    } else if (typeof value === 'boolean') {
      rows.push({ ...base, valueString: value ? 'true' : 'false' });
    }
  }
  return rows;
}

export async function seedProducts(organizationId: string, createdById: string) {
  const categoryByName = new Map<string, string>();
  const subCategoryByName = new Map<string, string>();
  const templateByName = new Map<string, string>();
  const productByName = new Map<string, string>();

  const activeLanguages = await prisma.language.findMany({
    where: { isActive: true },
    select: { id: true },
    orderBy: { code: 'asc' },
  });
  if (activeLanguages.length === 0) {
    throw new Error('No active languages found for product seeding');
  }

  for (const categorySeed of SEED_PRODUCT_CATEGORIES) {
    const category = await prisma.productCategory.create({
      data: {
        organizationId,
        createdById,
        translations: {
          createMany: {
            data: activeLanguages.map((lang) => ({
              languageId: lang.id,
              name: categorySeed.name,
            })),
          },
        },
      },
    });
    categoryByName.set(categorySeed.name, category.id);
  }

  for (const subCategorySeed of SEED_PRODUCT_SUBCATEGORIES) {
    const categoryId = categoryByName.get(subCategorySeed.categoryName);
    if (!categoryId) continue;

    const subCategory = await prisma.productSubCategory.create({
      data: {
        organizationId,
        categoryId,
        createdById,
        translations: {
          createMany: {
            data: activeLanguages.map((lang) => ({
              languageId: lang.id,
              name: subCategorySeed.name,
            })),
          },
        },
      },
    });
    subCategoryByName.set(subCategorySeed.name, subCategory.id);
  }

  for (const templateSeed of SEED_TEMPLATES) {
    const template = await prisma.template.create({
      data: {
        createdById,
        translations: {
          createMany: {
            data: activeLanguages.map((lang) => ({
              languageId: lang.id,
              name: templateSeed.name,
            })),
          },
        },
      },
    });

    templateByName.set(templateSeed.name, template.id);

    for (const attributeSeed of templateSeed.attributes) {
      await prisma.templateAttribute.create({
        data: {
          templateId: template.id,
          organizationId,
          name: attributeSeed.name,
          dataType: attributeSeed.dataType,
          isRequired: attributeSeed.isRequired ?? false,
          createdById,
        },
      });
    }
  }

  for (const productSeed of SEED_PRODUCTS) {
    const subCategoryId = subCategoryByName.get(productSeed.subCategoryName);
    const templateId = templateByName.get(productSeed.templateName);
    if (!subCategoryId || !templateId) continue;

    const product = await prisma.product.create({
      data: {
        organizationId,
        subcategoryId: subCategoryId,
        templateId,
        attributes: productSeed.attributes as Prisma.InputJsonValue,
        createdById,
        translations: {
          createMany: {
            data: activeLanguages.map((lang) => ({
              languageId: lang.id,
              name: productSeed.name,
              ...(productSeed.description !== undefined
                ? { description: productSeed.description }
                : {}),
            })),
          },
        },
      },
    });
    productByName.set(productSeed.name, product.id);

    const indexed = indexedRowsFromAttributes(
      organizationId,
      product.id,
      productSeed.attributes,
      createdById,
    );
    if (indexed.length > 0) {
      await prisma.productIndexedAttribute.createMany({ data: indexed });
    }
  }

  for (const variantSeed of SEED_PRODUCT_VARIANTS) {
    const productId = productByName.get(variantSeed.productName);
    if (!productId) continue;

    await prisma.productVariant.create({
      data: {
        organizationId,
        productId,
        sku: variantSeed.sku,
        price: variantSeed.price,
        attributes: variantSeed.attributes,
        createdById,
      },
    });
  }
}
