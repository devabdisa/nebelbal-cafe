/**
 * Seed payloads aligned with `prisma/schema.prisma`:
 * PlatformPermission (key), PlatformRole, OrgPermission (catalog), users, orgs, workspaces.
 *
 * Keep `PLATFORM_PERMISSIONS` in sync with:
 * - `src/modules/platformpermission/platformPermissionKeys.ts`
 * - `src/modules/organizationpermission/organizationPermissionKeys.ts`
 * - `src/modules/platformrole/*RouteKeys.ts`, `organizationrole/*RouteKeys.ts`, `organization/organizationRouteKeys.ts`, `users/usersPlatformKeys.ts`
 * - `src/modules/address/addressRouteKeys.ts`
 * - `dev/scripts/seeder/data/address_seeder.json` + `addressRegionAmharic.ts` (Ethiopia address tree + AM labels for regions)
 *
 * Keep `ORG_PERMISSIONS` in sync with `*OrgScopeKeys.ts` (workspace, invitation, organizationmember, workspacemember, employee, zone, salaryscale, salaryrecord, report, attendanceconfig, attendance).
 */

import type { Language } from '../../../../src/generated/prisma/client.ts';
import {
  countryRouteKeys,
  regionRouteKeys,
  cityZoneRouteKeys,
  districtSubcityRouteKeys,
} from '../../../../src/modules/address/addressRouteKeys.ts';
import { attendanceOrgScopeKeys } from '../../../../src/modules/attendance/attendanceOrgScopeKeys.ts';
import { attendanceconfigOrgScopeKeys } from '../../../../src/modules/attendanceconfig/attendanceconfigOrgScopeKeys.ts';
import { employeeOrgScopeKeys } from '../../../../src/modules/employee/employeeOrgScopeKeys.ts';
import { invitationOrgScopeKeys } from '../../../../src/modules/invitation/invitationOrgScopeKeys.ts';
import { languageRouteKeys } from '../../../../src/modules/language/languageRouteKeys.ts';
import { organizationOrgScopeKeys } from '../../../../src/modules/organization/organizationOrgScopeKeys.ts';
import { organizationRouteKeys } from '../../../../src/modules/organization/organizationRouteKeys.ts';
import { organizationmemberOrgScopeKeys } from '../../../../src/modules/organizationmember/organizationmemberOrgScopeKeys.ts';
import { organizationPermissionRouteKeys } from '../../../../src/modules/organizationpermission/organizationPermissionKeys.ts';
import { organizationRoleRouteKeys } from '../../../../src/modules/organizationrole/organizationRoleKeys.ts';
import { platformPermissionRouteKeys } from '../../../../src/modules/platformpermission/platformPermissionKeys.ts';
import { platformRoleRouteKeys } from '../../../../src/modules/platformrole/platformRoleKeys.ts';
import {
  productCategoryRouteKeys,
  productRouteKeys,
  productSubCategoryRouteKeys,
  productTemplateRouteKeys,
} from '../../../../src/modules/product/productCategoryRouteKeys.ts';
import { salaryscaleOrgScopeKeys } from '../../../../src/modules/salaryscale/salaryscaleOrgScopeKeys.ts';
import { salaryrecordOrgScopeKeys } from '../../../../src/modules/salaryrecord/salaryrecordOrgScopeKeys.ts';
import { reportOrgScopeKeys } from '../../../../src/modules/report/reportOrgScopeKeys.ts';
import { usersPlatformRouteKeys } from '../../../../src/modules/users/usersPlatformKeys.ts';
import { workspaceOrgScopeKeys } from '../../../../src/modules/workspace/workspaceOrgScopeKeys.ts';
import { workspacememberOrgScopeKeys } from '../../../../src/modules/workspacemember/workspacememberOrgScopeKeys.ts';
import { zoneOrgScopeKeys } from '../../../../src/modules/zone/zoneOrgScopeKeys.ts';

type SeedPermission = { key: string; description: string };

function uniqueKeys(...groups: readonly string[][]): string[] {
  return [...new Set(groups.flat())];
}

function toSeedPermissions(
  keys: readonly string[],
  descriptions: Record<string, string>,
): SeedPermission[] {
  return keys.map((key) => ({
    key,
    description: descriptions[key] ?? `Permission for ${key}`,
  }));
}

/**
 * User administration platform permissions (`/api/v1/users` — keys must match `usersPlatformRouteKeys`).
 */
export const USER_PLATFORM_PERMISSIONS = [
  { key: usersPlatformRouteKeys.list, description: 'List users (including GET /platform)' },
  { key: usersPlatformRouteKeys.read, description: 'Read user by id' },
  {
    key: usersPlatformRouteKeys.update,
    description: 'Admin user updates: status, soft-delete, PATCH /:id',
  },
  {
    key: usersPlatformRouteKeys.platformManage,
    description: 'Assign/revoke platform role and manage platform permission overrides',
  },
] as const;

/** Platform route keys used by the app (see `platformPermissionKeys`, `organizationPermissionKeys`). */
const PLATFORM_PERMISSION_DESCRIPTIONS: Record<string, string> = {
  'platform_permission.list': 'List platform permissions',
  'platform_permission.read': 'Read platform permission',
  'platform_permission.create': 'Create platform permission',
  'platform_permission.update': 'Update platform permission',
  'platform_permission.delete': 'Delete platform permission',
  'organization_permission.list': 'List org-permission catalog',
  'organization_permission.read': 'Read org permission',
  'organization_permission.create': 'Create org permission',
  'organization_permission.update': 'Update org permission',
  'organization_permission.delete': 'Delete org permission',
  'platform_role.list': 'List platform roles',
  'platform_role.read': 'Read platform role',
  'platform_role.create': 'Create platform role',
  'platform_role.update': 'Update platform role',
  'platform_role.delete': 'Delete platform role',
  'organization_role.list': 'List organization roles',
  'organization_role.read': 'Read organization role',
  'organization_role.create': 'Create organization role',
  'organization_role.update': 'Update organization role',
  'organization_role.delete': 'Delete organization role',
  'organization.list': 'List organizations',
  'organization.read': 'Read organization',
  'organization.create': 'Create organization',
  'organization.update': 'Update organization',
  'organization.delete': 'Delete organization',
  'language.list': 'List languages',
  'language.read': 'Read language',
  'language.create': 'Create language',
  'language.update': 'Update language',
  'language.delete': 'Delete language',
  'address.country.list': 'List countries',
  'address.country.read': 'Read country',
  'address.country.create': 'Create country',
  'address.country.update': 'Update country',
  'address.country.delete': 'Delete country',
  'address.region.list': 'List regions',
  'address.region.read': 'Read region',
  'address.region.create': 'Create region',
  'address.region.update': 'Update region',
  'address.region.delete': 'Delete region',
  'address.city_zone.list': 'List city zones',
  'address.city_zone.read': 'Read city zone',
  'address.city_zone.create': 'Create city zone',
  'address.city_zone.update': 'Update city zone',
  'address.city_zone.delete': 'Delete city zone',
  'address.district_subcity.list': 'List districts / subcities',
  'address.district_subcity.read': 'Read district / subcity',
  'address.district_subcity.create': 'Create district / subcity',
  'address.district_subcity.update': 'Update district / subcity',
  'address.district_subcity.delete': 'Delete district / subcity',
  'product_category.list': 'List product categories',
  'product_category.read': 'Read product category',
  'product_category.create': 'Create product category',
  'product_category.update': 'Update product category',
  'product_category.delete': 'Delete product category',
  'product_subcategory.list': 'List product subcategories',
  'product_subcategory.read': 'Read product subcategory',
  'product_subcategory.create': 'Create product subcategory',
  'product_subcategory.update': 'Update product subcategory',
  'product_subcategory.delete': 'Delete product subcategory',
  'product_template.list': 'List product templates',
  'product_template.read': 'Read product template',
  'product_template.create': 'Create product template',
  'product_template.update': 'Update product template',
  'product_template.delete': 'Delete product template',
  'product.list': 'List products',
  'product.read': 'Read product',
  'product.create': 'Create product',
  'product.update': 'Update product',
  'product.delete': 'Delete product',
  'user.list': 'List users (including GET /platform)',
  'user.read': 'Read user by id',
  'user.update': 'Admin user updates: status, soft-delete, PATCH /:id',
  'user.platform_manage': 'Assign/revoke platform role and manage platform permission overrides',
};

const PLATFORM_PERMISSION_KEYS = uniqueKeys(
  Object.values(platformPermissionRouteKeys),
  Object.values(organizationPermissionRouteKeys),
  Object.values(platformRoleRouteKeys),
  Object.values(organizationRoleRouteKeys),
  Object.values(organizationRouteKeys),
  Object.values(languageRouteKeys),
  Object.values(countryRouteKeys),
  Object.values(regionRouteKeys),
  Object.values(cityZoneRouteKeys),
  Object.values(districtSubcityRouteKeys),
  Object.values(productCategoryRouteKeys),
  Object.values(productSubCategoryRouteKeys),
  Object.values(productTemplateRouteKeys),
  Object.values(productRouteKeys),
  Object.values(usersPlatformRouteKeys),
);

export const PLATFORM_PERMISSIONS: readonly SeedPermission[] = toSeedPermissions(
  PLATFORM_PERMISSION_KEYS,
  PLATFORM_PERMISSION_DESCRIPTIONS,
);

/** Every platform permission key seeded above — Super Admin and Admin both receive the full set. */
export const ALL_SEEDED_PLATFORM_PERMISSION_KEYS: readonly string[] = PLATFORM_PERMISSIONS.map(
  (p) => p.key,
);

export type PlatformRoleSeed = {
  name: string;
  description: string;
  /** Must match `PLATFORM_PERMISSIONS[].key` */
  permissionKeys: readonly string[];
};

export const PLATFORM_ROLES: readonly PlatformRoleSeed[] = [
  {
    name: 'Super Admin',
    description: 'Full platform access',
    permissionKeys: ALL_SEEDED_PLATFORM_PERMISSION_KEYS,
  },
  {
    name: 'Admin',
    description: 'Full platform access (same permission catalog as Super Admin for dev)',
    permissionKeys: ALL_SEEDED_PLATFORM_PERMISSION_KEYS,
  },
  {
    name: 'Manager',
    description: 'Read-only platform access',
    permissionKeys: [
      'platform_permission.list',
      'platform_permission.read',
      'organization_permission.list',
      'organization_permission.read',
      'platform_role.list',
      'platform_role.read',
      'organization_role.list',
      'organization_role.read',
      'organization.list',
      'organization.read',
      'user.list',
      'user.read',
      'product_category.list',
      'product_category.read',
      'product_subcategory.list',
      'product_subcategory.read',
      'product_template.list',
      'product_template.read',
      'product.list',
      'product.read',
    ],
  },
  {
    name: 'Employee',
    description: 'No platform admin routes by default',
    permissionKeys: [],
  },
];

/** Global org-permission catalog (`OrgPermission`). */
export const ORG_PERMISSIONS: readonly SeedPermission[] = [
  ...toSeedPermissions(
    uniqueKeys(
      Object.values(workspaceOrgScopeKeys),
      Object.values(invitationOrgScopeKeys),
      Object.values(organizationmemberOrgScopeKeys),
      Object.values(workspacememberOrgScopeKeys),
      Object.values(organizationOrgScopeKeys),
      Object.values(employeeOrgScopeKeys),
      Object.values(zoneOrgScopeKeys),
      Object.values(salaryscaleOrgScopeKeys),
      Object.values(salaryrecordOrgScopeKeys),
      Object.values(reportOrgScopeKeys),
      Object.values(attendanceconfigOrgScopeKeys),
      Object.values(attendanceOrgScopeKeys),
    ),
    {
      'org.member.read': 'View organization members',
      'org.member.manage': 'Invite and manage members',
      'org.workspace.manage': 'Create and manage workspaces',
      'org.settings.manage': 'Change organization settings',
      'org.employee.read': 'View employees and their documents',
      'org.employee.manage': 'Create, update, and delete employees and documents',
      'org.zone.read': 'View attendance geofence zones',
      'org.zone.manage': 'Create, update, and delete geofence zones',
      'org.salary_scale.read': 'View organization salary scales',
      'org.salary_scale.manage': 'Create, update, and delete salary scales',
      'org.salary_record.read': 'View payroll and salary history records',
      'org.salary_record.manage': 'Create, update, and delete salary records',
      'org.report.read': 'View organization HR and attendance reports',
      'org.attendance_config.read': 'View attendance configuration and slots',
      'org.attendance_config.manage':
        'Create, update, and delete attendance configuration and slots',
      'org.attendance.read': 'View attendance records',
      'org.attendance.manage': 'Create, update, and delete attendance records',
    },
  ),
];

export type SeedUserRow = {
  /** When set, used as `User.id` (stable for Postman `users` samples in `postmanSamples.ts`). */
  id?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  platformRoleName: string;
  /** Granted on top of the platform role (`PlatformPermissionOverride`). */
  extraPlatformPermissionKeys?: readonly string[];
  /** Matches seeded `OrgRole.name` ("Owner" or "Member"). */
  organizationRoleName: string;
  /** For Member rows: extra org keys via `MemberPermissionOverride`. */
  extraOrgPermissionKeys?: readonly string[];
};

export const SEED_USERS: readonly SeedUserRow[] = [
  {
    id: '1b350015-ce43-4645-b3ab-9ff216687d04',
    email: 'superadmin@company.com',
    password: 'superadmin123',
    firstName: 'Super',
    lastName: 'Admin',
    phoneNumber: '+251911000000',
    platformRoleName: 'Super Admin',
    organizationRoleName: 'Owner',
  },
  {
    id: '1b350015-ce43-4645-b3ab-9ff216687d05',
    email: 'admin@company.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    phoneNumber: '+251911000001',
    platformRoleName: 'Admin',
    organizationRoleName: 'Owner',
  },
  {
    id: '1b350015-ce43-4645-b3ab-9ff216687d06',
    email: 'manager@company.com',
    password: 'manager123',
    firstName: 'John',
    lastName: 'Manager',
    phoneNumber: '+251911000111',
    platformRoleName: 'Manager',
    organizationRoleName: 'Member',
    extraOrgPermissionKeys: [
      'org.member.manage',
      'org.workspace.manage',
      'org.employee.manage',
      'org.zone.manage',
      'org.salary_scale.manage',
      'org.salary_record.manage',
      'org.report.read',
      'org.attendance_config.manage',
      'org.attendance.manage',
    ],
  },
  {
    id: '1b350015-ce43-4645-b3ab-9ff216687d07',
    email: 'jane@company.com',
    password: 'employee123',
    firstName: 'Jane',
    lastName: 'Smith',
    phoneNumber: '+251911000222',
    platformRoleName: 'Employee',
    organizationRoleName: 'Member',
  },
];

export const SEED_LANGUAGES: readonly Language[] = [
  {
    id: '1b350015-ce43-4645-b3ab-9ff216687d08',
    code: 'en',
    name: 'English',
    locale: 'en-US',
    isDefault: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '1b350015-ce43-4645-b3ab-9ff216687d09',
    code: 'am',
    name: 'አማርኛ',
    locale: 'am-ET',
    isDefault: false,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export type SeedWorkspaceRow = {
  name: string;
  description?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'REMOVED';
  type: 'PUBLIC' | 'PRIVATE';
};

export type SeedOrganizationRow = {
  name: string;
  description: string;
  address?: string;
  industry?: string;
  status: 'APPROVED';
  /** Workspaces created under this organization (each org has its own Owner/Member roles). */
  workspaces: readonly SeedWorkspaceRow[];
};

/**
 * Multiple orgs for local dev. Super admin is seeded as Owner + workspace member on every org below.
 * Other `SEED_USERS` are members only of the first organization (`SEED_ORGANIZATIONS[0]`).
 */
export const SEED_ORGANIZATIONS: readonly SeedOrganizationRow[] = [
  {
    name: 'Demo Garment Co.',
    description: 'Seeded organization for local development',
    address: 'Addis Ababa',
    industry: 'Manufacturing',
    status: 'APPROVED',
    workspaces: [
      {
        name: 'Default',
        description: 'Default shared workspace for organization members',
        status: 'ACTIVE',
        type: 'PUBLIC',
      },
      {
        name: 'Production Floor',
        description: 'Restricted workspace for production operations',
        status: 'ACTIVE',
        type: 'PRIVATE',
      },
    ],
  },
  {
    name: 'Acme Textiles Ltd.',
    description: 'Second seeded organization — cross-org testing',
    address: 'Hawassa',
    industry: 'Textiles',
    status: 'APPROVED',
    workspaces: [
      {
        name: 'Main',
        description: 'Main collaboration workspace',
        status: 'ACTIVE',
        type: 'PUBLIC',
      },
      {
        name: 'Archive',
        description: 'Archived and restricted workspace for old records',
        status: 'SUSPENDED',
        type: 'PRIVATE',
      },
    ],
  },
];

/**
 * Fixed tokens for invitations created in `seed_migrateDB.ts` (accept/decline flows).
 * Only created when running the seed; replace by creating invitations via the API in real use.
 */
export const SEED_DEV_INVITATION_TOKENS = {
  /** Org-wide invite (`workspaceId` null) — use in POST `/api/v1/invitation/accept` | `decline`. */
  orgScope: 'a1'.repeat(32),
  /** Workspace-scoped invite — use in POST `/api/v1/invitation/accept` | `decline`. */
  workspaceScope: 'b2'.repeat(32),
} as const;

export type SeedAttendanceSlotRow = {
  slotKey: string;
  name: string;
  order: number;
  startHourUtc: number;
  startMinuteUtc: number;
  endHourUtc: number;
  endMinuteUtc: number;
};

/**
 * Default attendance slots used by `seedExtendedOrgData.ts` when creating `AttendanceConfig`.
 * Keep this aligned with attendance module expectations and tests.
 */
export const SEED_ATTENDANCE_SLOTS: readonly SeedAttendanceSlotRow[] = [
  {
    slotKey: 'MORNING_IN',
    name: 'Morning in',
    order: 0,
    startHourUtc: 6,
    startMinuteUtc: 0,
    endHourUtc: 10,
    endMinuteUtc: 0,
  },
  {
    slotKey: 'FINAL_OUT',
    name: 'End of day',
    order: 1,
    startHourUtc: 15,
    startMinuteUtc: 0,
    endHourUtc: 19,
    endMinuteUtc: 0,
  },
] as const;
