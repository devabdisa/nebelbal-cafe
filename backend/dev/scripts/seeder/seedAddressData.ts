/**
 * Seeds Country → Region → CityZone → DistrictSubcity from `data/address_seeder.json`
 * with `RegionTranslation` / `CityZoneTranslation` / `DistrictSubcityTranslation`
 * for seeded English + Amharic (`SEED_LANGUAGES` in `seedData.ts`).
 *
 * - Default `name` on each row = English (from JSON `name`).
 * - English translation row uses the same string.
 * - Amharic uses optional `name_am` on any node, else `ADDRESS_REGION_NAME_AM[region.name]` for regions,
 *   else falls back to English until you add `name_am` in the JSON.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { prisma } from '../../../src/config/db.ts';
import { SEED_LANGUAGES } from './data/seedData.ts';
import { ADDRESS_REGION_NAME_AM } from './data/addressRegionAmharic.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

type DistrictJson = {
  name: string;
  woredas?: string[];
  name_am?: string;
};

type CityZoneJson = {
  name: string;
  district_subcities: DistrictJson[];
  name_am?: string;
};

type RegionJson = {
  name: string;
  city_zones: CityZoneJson[];
  name_am?: string;
};

const COUNTRY_CODE = 'ET';
const COUNTRY_NAME_EN = 'Ethiopia';

function trimName(s: string): string {
  return s.trim();
}

async function upsertTranslations(
  kind: 'region' | 'cityZone' | 'districtSubcity',
  entityId: string,
  nameEn: string,
  nameAm: string,
  langEnId: string,
  langAmId: string,
): Promise<void> {
  if (kind === 'region') {
    await prisma.regionTranslation.upsert({
      where: {
        regionId_languageId: { regionId: entityId, languageId: langEnId },
      },
      create: {
        regionId: entityId,
        languageId: langEnId,
        name: nameEn,
        description: null,
      },
      update: { name: nameEn },
    });
    await prisma.regionTranslation.upsert({
      where: {
        regionId_languageId: { regionId: entityId, languageId: langAmId },
      },
      create: {
        regionId: entityId,
        languageId: langAmId,
        name: nameAm,
        description: null,
      },
      update: { name: nameAm },
    });
    return;
  }

  if (kind === 'cityZone') {
    await prisma.cityZoneTranslation.upsert({
      where: {
        cityZoneId_languageId: { cityZoneId: entityId, languageId: langEnId },
      },
      create: {
        cityZoneId: entityId,
        languageId: langEnId,
        name: nameEn,
        description: null,
      },
      update: { name: nameEn },
    });
    await prisma.cityZoneTranslation.upsert({
      where: {
        cityZoneId_languageId: { cityZoneId: entityId, languageId: langAmId },
      },
      create: {
        cityZoneId: entityId,
        languageId: langAmId,
        name: nameAm,
        description: null,
      },
      update: { name: nameAm },
    });
    return;
  }

  await prisma.districtSubcityTranslation.upsert({
    where: {
      districtSubcityId_languageId: {
        districtSubcityId: entityId,
        languageId: langEnId,
      },
    },
    create: {
      districtSubcityId: entityId,
      languageId: langEnId,
      name: nameEn,
      description: null,
    },
    update: { name: nameEn },
  });
  await prisma.districtSubcityTranslation.upsert({
    where: {
      districtSubcityId_languageId: {
        districtSubcityId: entityId,
        languageId: langAmId,
      },
    },
    create: {
      districtSubcityId: entityId,
      languageId: langAmId,
      name: nameAm,
      description: null,
    },
    update: { name: nameAm },
  });
}

export async function seedAddressData(logger: {
  info: (msg: string) => void;
  success: (msg: string) => void;
  warn: (msg: string) => void;
}): Promise<void> {
  const langEn = SEED_LANGUAGES.find((l) => l.code === 'en');
  const langAm = SEED_LANGUAGES.find((l) => l.code === 'am');
  if (!langEn || !langAm) {
    logger.warn(
      'seedAddressData: en/am languages missing from SEED_LANGUAGES; skipping address seed',
    );
    return;
  }

  const langEnId = langEn.id;
  const langAmId = langAm.id;

  const jsonPath = path.join(__dirname, 'data', 'address_seeder.json');
  const raw = readFileSync(jsonPath, 'utf8');
  const regions = JSON.parse(raw) as RegionJson[];

  const existing = await prisma.country.findUnique({ where: { code: COUNTRY_CODE } });
  if (existing) {
    logger.info(
      `Address seed skipped: country ${COUNTRY_CODE} already exists (delete address data or use --clear to reseed)`,
    );
    return;
  }

  logger.info(
    'Seeding Ethiopia address hierarchy from address_seeder.json (this may take a few minutes)...',
  );

  const country = await prisma.country.create({
    data: {
      code: COUNTRY_CODE,
      name: COUNTRY_NAME_EN,
    },
  });

  let regionCount = 0;
  let cityZoneCount = 0;
  let districtCount = 0;

  for (const regionNode of regions) {
    const nameEn = trimName(regionNode.name);
    const nameAm = regionNode.name_am?.trim() || ADDRESS_REGION_NAME_AM[nameEn] || nameEn;

    const region = await prisma.region.create({
      data: {
        countryId: country.id,
        name: nameEn,
      },
    });
    regionCount += 1;
    await upsertTranslations('region', region.id, nameEn, nameAm, langEnId, langAmId);

    for (const czNode of regionNode.city_zones ?? []) {
      const czEn = trimName(czNode.name);
      const czAm = czNode.name_am?.trim() || czEn;

      const cityZone = await prisma.cityZone.create({
        data: {
          regionId: region.id,
          name: czEn,
        },
      });
      cityZoneCount += 1;
      await upsertTranslations('cityZone', cityZone.id, czEn, czAm, langEnId, langAmId);

      for (const dNode of czNode.district_subcities ?? []) {
        const dEn = trimName(dNode.name);
        const dAm = dNode.name_am?.trim() || dEn;

        const district = await prisma.districtSubcity.create({
          data: {
            cityZoneId: cityZone.id,
            name: dEn,
          },
        });
        districtCount += 1;
        await upsertTranslations('districtSubcity', district.id, dEn, dAm, langEnId, langAmId);
      }
    }
  }

  logger.success(
    `Seeded address: 1 country (${COUNTRY_CODE}), ${regionCount} regions, ${cityZoneCount} city zones, ${districtCount} districts/subcities — EN + AM translations`,
  );
}
