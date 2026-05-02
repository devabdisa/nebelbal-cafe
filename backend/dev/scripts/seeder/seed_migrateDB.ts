/**
 * Development database seed — matches `prisma/schema.prisma`:
 * auth/users, platform + org RBAC, addresses, organizations/workspaces/invitations,
 * product catalog (categories → templates → products → variants + indexed attributes),
 * org documents, and HR (salary scales, employees, zone, attendance, payroll sample).
 *
 * Usage:
 *   bun dev/scripts/seeder/seed_migrateDB.ts
 *   bun dev/scripts/seeder/seed_migrateDB.ts --clear
 */
import { config } from 'dotenv';
import { randomUUID } from 'node:crypto';

import { connectDB, disconnectDB, prisma } from '../../../src/config/db.ts';
import {
  ORG_PERMISSIONS,
  PLATFORM_PERMISSIONS,
  PLATFORM_ROLES,
  SEED_DEV_INVITATION_TOKENS,
  SEED_LANGUAGES,
  SEED_ORGANIZATIONS,
  SEED_USERS,
} from './data/seedData.ts';
import { seedAddressData } from './seedAddressData.ts';
import { seedOrganizationDocuments, seedHrStack } from './seedExtendedOrgData.ts';
import { seedProducts } from './seedProductData.ts';
config();

const logger = {
  info: (msg: string) => console.log(`ℹ️ ${msg}`),
  success: (msg: string) => console.log(`✅ ${msg}`),
  warn: (msg: string) => console.warn(`⚠️ ${msg}`),
  error: (msg: string) => console.error(`❌ ${msg}`),
};

async function clearDatabase(): Promise<void> {
  logger.info('Clearing database...');

  await prisma.$transaction(async (tx) => {
    await tx.salaryRecord.deleteMany();
    await tx.attendance.deleteMany();
    await tx.attendanceConfig.deleteMany();
    await tx.zone.deleteMany();
    await tx.employeeDocument.deleteMany();
    await tx.employeeRestDay.deleteMany();
    await tx.employee.deleteMany();
    await tx.salaryScale.deleteMany();
    await tx.productVariant.deleteMany();
    await tx.productIndexedAttribute.deleteMany();
    await tx.productTranslation.deleteMany();
    await tx.product.deleteMany();
    await tx.templateAttribute.deleteMany();
    await tx.templateTranslation.deleteMany();
    await tx.template.deleteMany();
    await tx.productSubCategoryTranslation.deleteMany();
    await tx.productSubCategory.deleteMany();
    await tx.productCategoryTranslation.deleteMany();
    await tx.productCategory.deleteMany();
    await tx.organizationDocument.deleteMany();
    await tx.oTPCode.deleteMany();
    await tx.memberPermissionOverride.deleteMany();
    await tx.orgRolePermission.deleteMany();
    await tx.member.deleteMany();
    await tx.workspaceMember.deleteMany();
    await tx.invitation.deleteMany();
    await tx.platformPermissionOverride.deleteMany();
    await tx.platformRolePermission.deleteMany();
    await tx.platformAccount.deleteMany();
    await tx.auth.deleteMany();
    await tx.userProfile.deleteMany();
    await tx.user.updateMany({
      data: { currentOrganizationId: null, currentWorkspaceId: null },
    });
    await tx.$executeRawUnsafe(`DELETE FROM "_UserOrganizations"`);
    await tx.districtSubcityTranslation.deleteMany();
    await tx.cityZoneTranslation.deleteMany();
    await tx.regionTranslation.deleteMany();
    await tx.districtSubcity.deleteMany();
    await tx.cityZone.deleteMany();
    await tx.region.deleteMany();
    await tx.country.deleteMany();
    await tx.workspace.deleteMany();
    await tx.orgRole.deleteMany();
    await tx.organization.deleteMany();
    await tx.orgPermission.deleteMany();
    await tx.user.deleteMany();
    await tx.platformRole.deleteMany();
    await tx.platformPermission.deleteMany();
    await tx.language.deleteMany();
  });

  logger.success('Database cleared');
}

async function seedLanguages(): Promise<void> {
  logger.info('Seeding languages...');
  for (const row of SEED_LANGUAGES) {
    await prisma.language.upsert({
      where: { id: row.id },
      update: row,
      create: row,
    });
  }
  logger.success(`Seeded ${SEED_LANGUAGES.length} languages`);
}
async function seedPlatformPermissions(): Promise<void> {
  logger.info('Seeding platform permissions...');
  for (const row of PLATFORM_PERMISSIONS) {
    await prisma.platformPermission.upsert({
      where: { key: row.key },
      update: { description: row.description },
      create: { key: row.key, description: row.description },
    });
  }
  logger.success(`Seeded ${PLATFORM_PERMISSIONS.length} platform permissions`);
}

async function seedPlatformRoles(): Promise<void> {
  logger.info('Seeding platform roles...');
  for (const roleSeed of PLATFORM_ROLES) {
    const role = await prisma.platformRole.upsert({
      where: { name: roleSeed.name },
      update: { description: roleSeed.description },
      create: { name: roleSeed.name, description: roleSeed.description },
    });

    const permissions = await prisma.platformPermission.findMany({
      where: { key: { in: [...roleSeed.permissionKeys] } },
    });

    for (const permission of permissions) {
      const existing = await prisma.platformRolePermission.findFirst({
        where: { roleId: role.id, permissionId: permission.id },
      });
      if (!existing) {
        await prisma.platformRolePermission.create({
          data: { roleId: role.id, permissionId: permission.id },
        });
      }
    }
  }
  logger.success(`Seeded ${PLATFORM_ROLES.length} platform roles`);
}

async function seedOrgPermissions(): Promise<void> {
  logger.info('Seeding org permission catalog...');
  for (const row of ORG_PERMISSIONS) {
    await prisma.orgPermission.upsert({
      where: { key: row.key },
      update: { description: row.description },
      create: { key: row.key, description: row.description },
    });
  }
  logger.success(`Seeded ${ORG_PERMISSIONS.length} org permissions`);
}

type SeededOrgBundle = {
  organizationId: string;
  ownerOrgRoleId: string;
  memberOrgRoleId: string;
  workspaceIds: string[];
};

async function seedUsersOrgAndWorkspace(): Promise<void> {
  logger.info('Seeding users, organizations, members, workspaces...');

  const orgPerms = await prisma.orgPermission.findMany();
  const permByKey = new Map(orgPerms.map((p) => [p.key, p.id]));

  const userIds: { email: string; id: string }[] = [];

  for (const row of SEED_USERS) {
    const id = row.id ?? randomUUID();
    const passwordHash = await Bun.password.hash(row.password, {
      algorithm: 'bcrypt',
      cost: 12,
    });

    const platformRole = await prisma.platformRole.findUnique({
      where: { name: row.platformRoleName },
    });
    if (!platformRole) {
      logger.warn(`Platform role "${row.platformRoleName}" not found for ${row.email}`);
      continue;
    }

    await prisma.user.create({
      data: {
        id,
        email: row.email,
        phoneNumber: row.phoneNumber,
        status: 'ACTIVE',
        profile: {
          create: {
            firstName: row.firstName,
            lastName: row.lastName,
          },
        },
        auth: {
          create: {
            passwordHash,
            emailVerified: true,
          },
        },
        platformAccount: {
          create: {
            roleId: platformRole.id,
          },
        },
      },
    });

    userIds.push({ email: row.email, id });

    const account = await prisma.platformAccount.findUnique({
      where: { userId: id },
    });
    if (account && row.extraPlatformPermissionKeys?.length) {
      for (const key of row.extraPlatformPermissionKeys) {
        const perm = await prisma.platformPermission.findUnique({ where: { key } });
        if (!perm) {
          logger.warn(`Unknown platform permission key for override: ${key}`);
          continue;
        }
        const existing = await prisma.platformPermissionOverride.findFirst({
          where: { platformAccountId: account.id, permissionId: perm.id },
        });
        if (!existing) {
          await prisma.platformPermissionOverride.create({
            data: {
              platformAccountId: account.id,
              permissionId: perm.id,
              allowed: true,
            },
          });
        }
      }
    }
  }

  const superAdmin = userIds.find((u) => u.email === 'superadmin@company.com');
  if (!superAdmin) {
    throw new Error('Super admin user was not created; cannot seed organizations');
  }

  const seededOrgs: SeededOrgBundle[] = [];

  for (const seedOrg of SEED_ORGANIZATIONS) {
    const org = await prisma.organization.create({
      data: {
        name: seedOrg.name,
        description: seedOrg.description,
        ...(seedOrg.address !== undefined ? { address: seedOrg.address } : {}),
        ...(seedOrg.industry !== undefined ? { industry: seedOrg.industry } : {}),
        status: seedOrg.status,
        createdById: superAdmin.id,
        approvedById: superAdmin.id,
        approvedAt: new Date(),
      },
    });

    const ownerOrgRole = await prisma.orgRole.create({
      data: {
        organizationId: org.id,
        name: 'Owner',
        description: 'Organization owner',
        roleType: 'OWNER',
      },
    });

    const memberOrgRole = await prisma.orgRole.create({
      data: {
        organizationId: org.id,
        name: 'Member',
        description: 'Standard member',
        roleType: 'MEMBER',
      },
    });

    for (const key of ORG_PERMISSIONS.map((p) => p.key)) {
      const pid = permByKey.get(key);
      if (!pid) continue;
      for (const orgRole of [ownerOrgRole, memberOrgRole]) {
        const grantToOwner = true;
        const grantToMember =
          key === 'org.member.read' ||
          key === 'org.employee.read' ||
          key === 'org.zone.read' ||
          key === 'org.salary_scale.read' ||
          key === 'org.salary_record.read' ||
          key === 'org.report.read' ||
          key === 'org.attendance_config.read' ||
          key === 'org.attendance.read';
        const shouldGrant = orgRole.id === ownerOrgRole.id ? grantToOwner : grantToMember;
        if (!shouldGrant) continue;
        const existing = await prisma.orgRolePermission.findFirst({
          where: { roleId: orgRole.id, permissionId: pid },
        });
        if (!existing) {
          await prisma.orgRolePermission.create({
            data: { roleId: orgRole.id, permissionId: pid },
          });
        }
      }
    }

    const workspaceIds: string[] = [];
    for (const ws of seedOrg.workspaces) {
      const workspace = await prisma.workspace.create({
        data: {
          organizationId: org.id,
          name: ws.name,
          ...(ws.description !== undefined ? { description: ws.description } : {}),
          status: ws.status,
          type: ws.type,
          createdById: superAdmin.id,
        },
      });
      workspaceIds.push(workspace.id);
    }

    seededOrgs.push({
      organizationId: org.id,
      ownerOrgRoleId: ownerOrgRole.id,
      memberOrgRoleId: memberOrgRole.id,
      workspaceIds,
    });
  }

  const primary = seededOrgs[0];
  if (!primary) {
    throw new Error('SEED_ORGANIZATIONS must define at least one organization');
  }

  for (const bundle of seededOrgs) {
    await prisma.member.create({
      data: {
        userId: superAdmin.id,
        organizationId: bundle.organizationId,
        roleId: bundle.ownerOrgRoleId,
        status: 'ACTIVE',
      },
    });
    for (const workspaceId of bundle.workspaceIds) {
      await prisma.workspaceMember.create({
        data: {
          workspaceId,
          userId: superAdmin.id,
          roleId: bundle.ownerOrgRoleId,
        },
      });
    }
  }

  for (const row of SEED_USERS) {
    const uid = userIds.find((u) => u.email === row.email)?.id;
    if (!uid) continue;

    if (row.email === 'superadmin@company.com') {
      await prisma.user.update({
        where: { id: uid },
        data: {
          currentOrganizationId: primary.organizationId,
          currentWorkspaceId: primary.workspaceIds[0] ?? null,
          organizations: {
            connect: seededOrgs.map((b) => ({ id: b.organizationId })),
          },
        },
      });
      continue;
    }

    const orgRoleId =
      row.organizationRoleName === 'Owner' ? primary.ownerOrgRoleId : primary.memberOrgRoleId;

    const member = await prisma.member.create({
      data: {
        userId: uid,
        organizationId: primary.organizationId,
        roleId: orgRoleId,
        status: 'ACTIVE',
      },
    });

    if (row.extraOrgPermissionKeys?.length) {
      for (const key of row.extraOrgPermissionKeys) {
        const pid = permByKey.get(key);
        if (!pid) {
          logger.warn(`Unknown org permission key for override: ${key}`);
          continue;
        }
        const existing = await prisma.memberPermissionOverride.findFirst({
          where: { memberId: member.id, permissionId: pid },
        });
        if (!existing) {
          await prisma.memberPermissionOverride.create({
            data: {
              memberId: member.id,
              permissionId: pid,
              allowed: true,
            },
          });
        }
      }
    }

    for (const workspaceId of primary.workspaceIds) {
      await prisma.workspaceMember.create({
        data: {
          workspaceId,
          userId: uid,
          roleId: orgRoleId,
        },
      });
    }

    await prisma.user.update({
      where: { id: uid },
      data: {
        currentOrganizationId: primary.organizationId,
        currentWorkspaceId: primary.workspaceIds[0] ?? null,
        organizations: { connect: { id: primary.organizationId } },
      },
    });
  }

  const inviteExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const primaryWorkspaceId = primary.workspaceIds[0];
  await prisma.invitation.createMany({
    data: [
      {
        email: 'pending-org-invite@example.com',
        token: SEED_DEV_INVITATION_TOKENS.orgScope,
        status: 'PENDING',
        organizationId: primary.organizationId,
        workspaceId: null,
        invitedById: superAdmin.id,
        roleId: primary.memberOrgRoleId,
        expiresAt: inviteExpiry,
      },
      {
        email: 'pending-workspace-invite@example.com',
        token: SEED_DEV_INVITATION_TOKENS.workspaceScope,
        status: 'PENDING',
        organizationId: primary.organizationId,
        workspaceId: primaryWorkspaceId ?? null,
        invitedById: superAdmin.id,
        roleId: primary.memberOrgRoleId,
        expiresAt: inviteExpiry,
      },
    ],
  });
  logger.info(
    'Sample invitations: pending-org-invite@ / pending-workspace-invite@ — tokens in seedData SEED_DEV_INVITATION_TOKENS',
  );

  logger.info(
    'Users API (`/api/v1/users`): seeded ids 00000000-0000-4000-8000-000000000004–000000000007 — see `SEED_USERS` / `postmanSamples` users module',
  );
  logger.success(
    `Seeded users, ${seededOrgs.length} organizations, memberships, workspaces, and sample invitations`,
  );
}

async function seedData(): Promise<void> {
  const clearData = process.argv.includes('--clear');
  let exitCode = 0;

  try {
    logger.info('Connecting to database...');
    await connectDB();

    if (clearData) {
      await clearDatabase();
    }
    await seedLanguages();
    await seedAddressData(logger);
    await seedPlatformPermissions();
    await seedPlatformRoles();
    await seedOrgPermissions();
    await seedUsersOrgAndWorkspace();

    const firstSeedOrg = SEED_ORGANIZATIONS[0];
    const firstSeedWorkspace = firstSeedOrg?.workspaces[0];
    const primaryOrg =
      firstSeedOrg !== undefined
        ? await prisma.organization.findFirst({
            where: { name: firstSeedOrg.name },
            select: { id: true },
          })
        : null;
    const primaryWorkspace =
      primaryOrg !== null && firstSeedWorkspace !== undefined
        ? await prisma.workspace.findFirst({
            where: {
              organizationId: primaryOrg.id,
              name: firstSeedWorkspace.name,
            },
            select: { id: true },
          })
        : null;
    if (primaryOrg?.id && primaryWorkspace?.id) {
      const superAdmin = await prisma.user.findUnique({
        where: { email: 'superadmin@company.com' },
        select: { id: true },
      });
      if (superAdmin?.id) {
        await seedOrganizationDocuments(primaryOrg.id, logger);
        await seedProducts(primaryOrg.id, superAdmin.id);
        await seedHrStack(
          {
            organizationId: primaryOrg.id,
            workspaceId: primaryWorkspace.id,
          },
          logger,
        );
      }
    } else {
      logger.warn('Primary org/workspace not found; skipping product and HR seed');
    }

    logger.success('Database seeding completed successfully.');
  } catch (error: unknown) {
    exitCode = 1;
    const err = error as { message?: string; code?: string; stack?: string };
    logger.error('Seeding failed:');
    logger.error(err.message ?? String(error));
    if (err.code) {
      logger.error(`Error code: ${err.code}`);
    }
    if (err.stack) {
      logger.error(err.stack);
    }
  } finally {
    await disconnectDB();
    logger.info('Database connection closed.');
  }

  process.exit(exitCode);
}

void seedData();
