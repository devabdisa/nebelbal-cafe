/**
 * Sample JSON bodies and query strings for Postman requests.
 * Kept alongside the API — update when validation rules change.
 */
export type RoutePattern =
  | 'GET /'
  | 'GET /:id'
  | 'GET /me'
  | 'GET /platform'
  | 'POST /'
  | 'POST /register'
  | 'POST /login'
  | 'POST /google'
  | 'POST /refresh'
  | 'POST /forgot-password'
  | 'POST /set-password'
  | 'POST /send'
  | 'POST /resend'
  | 'POST /verify'
  | 'POST /logout'
  | 'POST /request'
  | 'POST /:id/soft-delete'
  | 'POST /:id/resend'
  | 'POST /:id/platform-role'
  | 'POST /:id/platform-overrides'
  | 'PATCH /:id'
  | 'PATCH /:id/role'
  | 'PATCH /change-password'
  | 'PATCH /:id/status'
  | 'PATCH /context'
  | 'PATCH /profile'
  | 'PATCH /settings'
  | 'DELETE /:id'
  | 'DELETE /:id/platform-role'
  | 'DELETE /:id/platform-overrides'
  | 'POST /accept'
  | 'POST /decline'
  | 'GET /countries'
  | 'POST /countries'
  | 'GET /countries/:id'
  | 'PATCH /countries/:id'
  | 'DELETE /countries/:id'
  | 'GET /regions'
  | 'POST /regions'
  | 'GET /regions/:id'
  | 'PATCH /regions/:id'
  | 'DELETE /regions/:id'
  | 'GET /city-zones'
  | 'POST /city-zones'
  | 'GET /city-zones/:id'
  | 'PATCH /city-zones/:id'
  | 'DELETE /city-zones/:id'
  | 'GET /district-subcities'
  | 'POST /district-subcities'
  | 'GET /district-subcities/:id'
  | 'PATCH /district-subcities/:id'
  | 'DELETE /district-subcities/:id'
  | 'POST /profile/picture'
  | 'PATCH /profile/picture'
  | 'DELETE /profile/picture'
  | 'POST /organization/logo'
  | 'PATCH /organization/logo'
  | 'DELETE /organization/logo'
  | 'POST /workspace/:id/logo'
  | 'PATCH /workspace/:id/logo'
  | 'DELETE /workspace/:id/logo'
  | 'POST /countries/:id/flag'
  | 'PATCH /countries/:id/flag'
  | 'DELETE /countries/:id/flag'
  | 'GET /categories'
  | 'POST /categories'
  | 'GET /categories/:id'
  | 'PATCH /categories/:id'
  | 'DELETE /categories/:id'
  | 'GET /subcategories'
  | 'POST /subcategories'
  | 'GET /subcategories/:id'
  | 'PATCH /subcategories/:id'
  | 'DELETE /subcategories/:id'
  | 'GET /templates'
  | 'POST /templates'
  | 'GET /templates/:id'
  | 'PATCH /templates/:id'
  | 'DELETE /templates/:id'
  | 'GET /products'
  | 'POST /products'
  | 'GET /products/:id'
  | 'PATCH /products/:id'
  | 'DELETE /products/:id'
  | 'GET /:id/documents'
  | 'POST /:id/documents'
  | 'GET /:id/documents/:documentId'
  | 'PATCH /:id/documents/:documentId'
  | 'DELETE /:id/documents/:documentId'
  | 'GET /:id/slots'
  | 'POST /:id/slots'
  | 'GET /:id/slots/:slotId'
  | 'PATCH /:id/slots/:slotId'
  | 'DELETE /:id/slots/:slotId';

/** Seeded `Language.id` values from `seedData.ts` (en / am) — use for `languageId` on address reads. */
const SEED_LANG_EN_ID = '1b350015-ce43-4645-b3ab-9ff216687d08';
const SEED_LANG_AM_ID = '1b350015-ce43-4645-b3ab-9ff216687d09';

/** Example UUIDs for product category / subcategory routes (replace with real ids from your API). */
const SAMPLE_PRODUCT_CATEGORY_ID = 'a1000000-0000-4000-8000-000000000001';
const SAMPLE_PRODUCT_SUBCATEGORY_ID = 'a2000000-0000-4000-8000-000000000002';
/** Example UUID for `templateId` on products (replace with id from your API after seeding). */
const SAMPLE_PRODUCT_TEMPLATE_ID = 'a3000000-0000-4000-8000-000000000003';

/**
 * Product routes require auth plus org/workspace context (`authMiddleware`).
 * Replace UUIDs after seed or use `PATCH /api/v1/auth/context` to persist defaults on the user.
 */
const PRODUCT_SAMPLE_HEADERS: { key: string; value: string }[] = [
  { key: 'Authorization', value: 'Bearer {{accessToken}}' },
  { key: 'x-org-id', value: '46aa0fb1-e876-4140-aef0-b5ae94888012' },
  { key: 'x-workspace-id', value: '46aa0fb1-e876-4140-aef0-b5ae94888022' },
];

/** Org-scoped HR routes (`employee`, `zone`, `salaryscale`, `attendanceconfig`, `attendance`). */
const HR_ORG_SAMPLE_HEADERS: { key: string; value: string }[] = [
  { key: 'Authorization', value: 'Bearer {{accessToken}}' },
  { key: 'x-org-id', value: '46aa0fb1-e876-4140-aef0-b5ae94888012' },
];

/** Replace with `Member.id` from `GET /api/v1/organizationmember` (must be ACTIVE and not already linked to an employee). */
const SAMPLE_MEMBER_ID_FOR_EMPLOYEE = 'f40e8e53-63b6-4eac-ae30-09f0725c04681';
/** Replace with `Employee.id` from `GET /api/v1/employee`. */
const SAMPLE_EMPLOYEE_ID = 'f40e8e53-63b6-4eac-ae30-09f0725c04682';
/** Replace with `EmployeeDocument.id` from `GET /api/v1/employee/:id/documents`. */
// const SAMPLE_EMPLOYEE_DOCUMENT_ID = 'f40e8e53-63b6-4eac-ae30-09f0725c04683';
/** Replace with `Zone.id` from `GET /api/v1/zone`. */
const SAMPLE_ZONE_ID = 'f40e8e53-63b6-4eac-ae30-09f0725c043z1';
/** Replace with `OrgRole.id` from org roles list (same organization). */
const SAMPLE_ORG_ROLE_ID = 'f40e8e53-63b6-4eac-ae30-09f0725c043r1';
/** Replace with `SalaryScale.id` from `GET /api/v1/salaryscale`. */
// const SAMPLE_SALARY_SCALE_ID = 'f40e8e53-63b6-4eac-ae30-09f0725c043s1';
/** Replace with `AttendanceConfig.id` from `GET /api/v1/attendanceconfig`. */
// const SAMPLE_ATTENDANCE_CONFIG_ID = 'f40e8e53-63b6-4eac-ae30-09f0725c043c1';
/** Replace with `AttendanceSlot.id` from `GET /api/v1/attendanceconfig/:id/slots`. */
const SAMPLE_ATTENDANCE_SLOT_ID = 'f40e8e53-63b6-4eac-ae30-09f0725c043c2';
/** Replace with `Attendance.id` from `GET /api/v1/attendance`. */
// const SAMPLE_ATTENDANCE_ID = 'f40e8e53-63b6-4eac-ae30-09f0725c043a1';
const SAMPLE_WORKSPACE_ID_HR = '46aa0fb1-e876-4140-aef0-b5ae94888022';

export type RouteFormDataPart =
  | { key: string; type: 'file'; description?: string }
  | { key: string; type: 'text'; value: string };

export type RouteSample = {
  body?: unknown;
  /** Serialized as Postman `url.query` (all values as strings). */
  query?: Record<string, string | number | boolean>;
  /** When set (POST/PATCH/PUT), Postman uses `multipart/form-data` instead of JSON. */
  formData?: RouteFormDataPart[];
  /** Extra request headers (e.g. `x-org-id` for org-scoped uploads). */
  headers?: { key: string; value: string }[];
  /** Shown on the Postman request (permissions / setup hints). */
  description?: string;
};

/** Routes mounted under `/api/v1/<module>/…`. Key = last path segment (folder name). */
export const samplesByModule: Record<string, Partial<Record<RoutePattern, RouteSample>>> = {
  auth: {
    'POST /register': {
      body: {
        email: 'user@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Doe',
      },
    },
    'POST /login': {
      body: {
        email: 'user@example.com',
        password: 'password123',
      },
    },
    'POST /google': {
      body: {
        idToken: 'paste-google-id-token-from-client',
      },
    },
    'POST /refresh': {
      body: { refreshToken: 'paste-refresh-token-from-login-response' },
    },
    'POST /forgot-password': {
      body: {
        email: 'user@example.com',
      },
    },
    'POST /set-password': {
      body: {
        email: 'user@example.com',
        temporaryToken: 'paste-temporary-token-from-otp-verify-response',
        newPassword: 'newPassword123',
      },
    },
    'GET /me': {},
    'PATCH /profile': {
      description:
        'Updates `User.phoneNumber` and `UserProfile` text fields (firstName, middleName, lastName, location, bio). For avatar use POST/PATCH `/api/v1/upload/profile/picture` (multipart `file`).',
      body: {
        phoneNumber: '+251911000222',
        firstName: 'Jane',
        middleName: '',
        lastName: 'Smith',
        location: 'Addis Ababa',
        bio: 'Sample profile update',
      },
    },
    'PATCH /change-password': {
      body: {
        currentPassword: 'password123',
        newPassword: 'newPassword123',
      },
    },
    'PATCH /context': {
      body: {
        organizationId: '46aa0fb1-e876-4140-aef0-b5ae94888012',
        workspaceId: '46aa0fb1-e876-4140-aef0-b5ae94888022',
      },
    },
    'POST /logout': {},
  },
  otp: {
    'POST /send': {
      body: {
        purpose: 'PASSWORD_RESET',
        email: 'user@example.com',
      },
    },
    'POST /resend': {
      body: {
        purpose: 'PASSWORD_RESET',
        email: 'user@example.com',
      },
    },
    'POST /verify': {
      body: {
        purpose: 'PASSWORD_RESET',
        email: 'user@example.com',
        code: '123456',
      },
    },
  },
  platformpermission: {
    'GET /': {
      query: { page: 1, limit: 20, sortBy: 'key', sortOrder: 'asc' },
    },
    'POST /': {
      body: { key: 'example.platform.permission', description: 'Sample platform permission' },
    },
    'PATCH /:id': {
      body: { key: 'example.platform.permission', description: 'Updated description' },
    },
  },
  organizationpermission: {
    'GET /': {
      query: { page: 1, limit: 20, sortBy: 'key', sortOrder: 'asc' },
    },
    'POST /': {
      body: { key: 'example.org.permission', description: 'Sample organization permission' },
    },
    'PATCH /:id': {
      body: { key: 'example.org.permission', description: 'Updated description' },
    },
  },
  platformrole: {
    'GET /': {
      query: { page: 1, limit: 20, sortBy: 'name', sortOrder: 'asc' },
    },
    'POST /': {
      body: {
        name: 'Administrator',
        description: 'Platform role with elevated access',
        permissionIds: ['46aa0fb1-e876-4140-aef0-b5ae94888012'],
      },
    },
    'PATCH /:id': {
      body: {
        name: 'Administrator',
        description: 'Updated role description',
        permissionIds: ['46aa0fb1-e876-4140-aef0-b5ae94888012'],
      },
    },
  },
  organization: {
    'GET /': {
      query: { page: 1, limit: 20, sortBy: 'name', sortOrder: 'asc', status: 'APPROVED' },
    },
    'POST /': {
      body: {
        name: 'Acme Garments',
        description: 'New organization',
        address: 'Addis Ababa',
        industry: 'Retail',
        status: 'PENDING',
      },
    },
    'POST /request': {
      description:
        'Authenticated user request endpoint. Requires verified email + phone. Uses multipart form-data. First `file` is business license; additional `file` entries are saved as attachments.',
      formData: [
        { key: 'name', type: 'text', value: 'Acme Garments PLC' },
        { key: 'districtSubcityId', type: 'text', value: '46aa0fb1-e876-4140-aef0-b5ae94888012' },
        { key: 'address', type: 'text', value: 'Addis Ababa, Ethiopia' },
        { key: 'area', type: 'text', value: 'Bole' },
        { key: 'phoneNumber', type: 'text', value: '+251911000111' },
        { key: 'website', type: 'text', value: 'https://acme.example.com' },
        { key: 'industry', type: 'text', value: 'Retail' },
        { key: 'contactName', type: 'text', value: 'Jane Doe' },
        { key: 'contactEmail', type: 'text', value: 'ops@acme.example.com' },
        { key: 'contactPhone', type: 'text', value: '+251911000222' },
        { key: 'licenseDescription', type: 'text', value: 'Trade license document' },
        {
          key: 'file',
          type: 'file',
          description: 'Required: business license (pdf/jpeg/png/webp)',
        },
        { key: 'file', type: 'file', description: 'Optional: additional attachment (repeat key)' },
      ],
    },
    'PATCH /:id': {
      body: { status: 'APPROVED' },
    },
    'PATCH /settings': {
      body: {
        name: 'Acme Garments PLC',
        description: 'Updated description',
      },
    },
  },
  workspace: {
    'GET /': {
      query: { page: 1, limit: 20, status: 'ACTIVE', sortBy: 'status', sortOrder: 'asc' },
    },
    'POST /': {
      body: {
        name: 'Production Floor',
        description: 'Primary workspace for daily operations',
        type: 'PRIVATE',
      },
    },
    'PATCH /:id': {
      body: {
        name: 'Production Floor A',
        description: 'Updated workspace description',
        type: 'PUBLIC',
      },
    },
    'PATCH /:id/status': {
      body: { status: 'SUSPENDED' },
    },
  },
  organizationmember: {
    'GET /': {
      query: { page: 1, limit: 20, sortBy: 'joinedAt', sortOrder: 'desc', includeRemoved: 'false' },
    },
    'POST /': {
      body: {
        userId: '46aa0fb1-e876-4140-aef0-b5ae94888022',
        roleId: '46aa0fb1-e876-4140-aef0-b5ae94888032',
        status: 'ACTIVE',
      },
    },
    'PATCH /:id': {
      body: { status: 'SUSPENDED' },
    },
  },
  workspacemember: {
    'GET /': {
      query: {
        workspaceId: '46aa0fb1-e876-4140-aef0-b5ae94888012',
        page: 1,
        limit: 20,
        sortBy: 'joinedAt',
        sortOrder: 'desc',
      },
    },
    'POST /': {
      body: {
        workspaceId: '46aa0fb1-e876-4140-aef0-b5ae94888012',
        userId: '46aa0fb1-e876-4140-aef0-b5ae94888022',
        roleId: '46aa0fb1-e876-4140-aef0-b5ae94888032',
      },
    },
    'PATCH /:id': {
      body: { roleId: null },
    },
  },
  organizationrole: {
    'GET /': {
      query: {
        organizationId: '46aa0fb1-e876-4140-aef0-b5ae94888012',
        page: 1,
        limit: 20,
        sortBy: 'name',
        sortOrder: 'asc',
      },
    },
    'POST /': {
      body: {
        organizationId: '46aa0fb1-e876-4140-aef0-b5ae94888012',
        name: 'Workspace Manager',
        description: 'Can manage members and settings',
        roleType: 'MEMBER',
        permissionIds: ['46aa0fb1-e876-4140-aef0-b5ae94888022'],
      },
    },
    'PATCH /:id': {
      body: {
        name: 'Workspace Manager',
        description: 'Updated',
        roleType: 'OWNER',
        permissionIds: ['46aa0fb1-e876-4140-aef0-b5ae94888022'],
      },
    },
  },
  invitation: {
    'GET /': {
      query: {
        page: 1,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        status: 'PENDING',
        type: 'ORGANIZATION_INVITE',
      },
      description:
        'Optional `type` filter: PLATFORM_INVITE | ORGANIZATION_INVITE | WORKSPACE_INVITE. Workspace/org scope is resolved from authenticated user context.',
    },
    'POST /': {
      body: {
        email: 'invitee@example.com',
        roleId: '46aa0fb1-e876-4140-aef0-b5ae94888032',
        workspaceId: null,
      },
    },
    'POST /accept': {
      body: { token: 'paste-invitation-token-from-create-response' },
    },
    'POST /decline': {
      body: { token: 'paste-invitation-token-from-create-response' },
    },
    'PATCH /:id': {},
    'PATCH /:id/role': {
      description:
        'PENDING only. Updates org role on ORGANIZATION_INVITE or WORKSPACE_INVITE. Not supported for PLATFORM_INVITE.',
      body: { roleId: '46aa0fb1-e876-4140-aef0-b5ae94888032' },
    },
    'POST /:id/resend': {
      description:
        'PENDING only. Refreshes token and expiry, then queues invitation email again. Optional body `phone` sends SMS. For WORKSPACE_INVITE, user must have current workspace context.',
      body: { phone: '' },
    },
  },
  /**
   * Stable target user id for `:id` samples: `SEED_USERS` row `jane@company.com`
   * (`46aa0fb1-e876-4140-aef0-b5ae94888072`). Use `GET /api/v1/users` or `/platform` to discover ids after seed.
   */
  users: {
    'GET /': {
      query: {
        page: 1,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        platformOnly: false,
      },
    },
    'GET /platform': {
      query: { page: 1, limit: 20, sortBy: 'email', sortOrder: 'asc', platformOnly: true },
    },
    'GET /:id': {},
    'PATCH /profile': {
      body: {
        firstName: 'Jane',
        lastName: 'Smith',
        phoneNumber: '+251911000999',
        bio: 'Sample profile update',
      },
    },
    'PATCH /:id': {
      body: { firstName: 'Jane', lastName: 'Smith', status: 'ACTIVE' },
    },
    'PATCH /:id/status': {
      body: { status: 'SUSPENDED' },
    },
    'POST /:id/soft-delete': {},
    'POST /:id/platform-role': {
      body: { roleId: '46aa0fb1-e876-4140-aef0-b5ae94888102' },
    },
    'DELETE /:id/platform-role': {},
    'POST /:id/platform-overrides': {
      body: { permissionKey: 'platform_permission.read', allowed: true },
    },
    'DELETE /:id/platform-overrides': {
      query: { permissionKey: 'platform_permission.read' },
    },
  },
  language: {
    'GET /': {
      query: { page: 1, limit: 20, sortBy: 'code', sortOrder: 'asc' },
    },
    'POST /': {
      body: {
        code: 'en',
        name: 'English',
        locale: 'en-US',
        isDefault: false,
        isActive: true,
      },
    },
    'PATCH /:id': {
      body: {
        code: 'en',
        name: 'English',
        locale: 'en-US',
        isDefault: false,
        isActive: true,
      },
    },
    'DELETE /:id': {},
  },
  /**
   * Mounted at `/api/v1/address` with sub-routers `countries`, `regions`, `city-zones`, `district-subcities`.
   * Replace placeholder UUIDs with ids from list responses after seed (`seedAddressData`).
   */
  address: {
    'GET /countries': {
      query: {
        page: 1,
        limit: 20,
        sortBy: 'name',
        sortOrder: 'asc',
        hasPagination: true,
        search: '',
      },
    },
    'POST /countries': {
      body: { code: 'KE', name: 'Kenya' },
    },
    'GET /countries/:id': {},
    'PATCH /countries/:id': {
      body: { name: 'Kenya (updated)' },
    },
    'DELETE /countries/:id': {},
    'GET /regions': {
      query: {
        countryId: '46aa0fb1-e876-4140-aef0-b5ae94888012',
        page: 1,
        limit: 20,
        sortBy: 'name',
        sortOrder: 'asc',
        languageId: SEED_LANG_AM_ID,
        includeTranslations: false,
        hasPagination: true,
        search: '',
      },
    },
    'POST /regions': {
      body: {
        countryId: '46aa0fb1-e876-4140-aef0-b5ae94888012',
        name: 'Sample Region',
        translations: [
          { languageId: SEED_LANG_EN_ID, name: 'Sample Region', description: null },
          { languageId: SEED_LANG_AM_ID, name: 'ናሙና ክፍለገር', description: null },
        ],
      },
    },
    'GET /regions/:id': {
      query: {
        languageId: SEED_LANG_AM_ID,
        includeTranslations: true,
      },
    },
    'PATCH /regions/:id': {
      body: {
        name: 'Sample Region (updated)',
        translations: [{ languageId: SEED_LANG_AM_ID, name: 'የተሻሻለ ክፍለገር', description: null }],
      },
    },
    'DELETE /regions/:id': {},
    'GET /city-zones': {
      query: {
        regionId: '46aa0fb1-e876-4140-aef0-b5ae94888022',
        page: 1,
        limit: 20,
        sortBy: 'name',
        sortOrder: 'asc',
        languageId: SEED_LANG_AM_ID,
        includeTranslations: false,
        hasPagination: true,
        search: '',
      },
    },
    'POST /city-zones': {
      body: {
        regionId: '46aa0fb1-e876-4140-aef0-b5ae94888022',
        name: 'Sample City Zone',
        translations: [
          { languageId: SEED_LANG_EN_ID, name: 'Sample City Zone' },
          { languageId: SEED_LANG_AM_ID, name: 'ናሙና የከተማ ዞን' },
        ],
      },
    },
    'GET /city-zones/:id': {
      query: { languageId: SEED_LANG_EN_ID, includeTranslations: true },
    },
    'PATCH /city-zones/:id': {
      body: {
        name: 'Sample City Zone (updated)',
        translations: [{ languageId: SEED_LANG_AM_ID, name: 'የተሻሻለ ዞን' }],
      },
    },
    'DELETE /city-zones/:id': {},
    'GET /district-subcities': {
      query: {
        cityZoneId: '46aa0fb1-e876-4140-aef0-b5ae94888032',
        page: 1,
        limit: 20,
        sortBy: 'name',
        sortOrder: 'asc',
        languageId: SEED_LANG_AM_ID,
        includeTranslations: false,
        hasPagination: true,
        search: '',
      },
    },
    'POST /district-subcities': {
      body: {
        cityZoneId: '46aa0fb1-e876-4140-aef0-b5ae94888032',
        name: 'Sample District',
        translations: [
          { languageId: SEED_LANG_EN_ID, name: 'Sample District' },
          { languageId: SEED_LANG_AM_ID, name: 'ናሙና ወረዳ' },
        ],
      },
    },
    'GET /district-subcities/:id': {
      query: { languageId: SEED_LANG_AM_ID, includeTranslations: true },
    },
    'PATCH /district-subcities/:id': {
      body: {
        name: 'Sample District (updated)',
        translations: [{ languageId: SEED_LANG_EN_ID, name: 'Updated district' }],
      },
    },
    'DELETE /district-subcities/:id': {},
  },
  /**
   * `/api/v1/upload` — multipart field name **`file`**. Images: jpeg, png, gif, webp.
   * Replace UUIDs from `GET /workspaces`, `GET /address/countries`, and set `x-org-id` (or `orgId` query) to match a membership with the required org permissions.
   */
  upload: {
    'POST /profile/picture': {
      description:
        'Auth only. Requires existing UserProfile (same as PATCH /users/profile). Form field: file.',
      formData: [
        { key: 'file', type: 'file', description: 'Select an image (jpeg, png, gif, webp)' },
      ],
    },
    'PATCH /profile/picture': {
      description: 'Same as POST — replaces profile picture.',
      formData: [
        { key: 'file', type: 'file', description: 'Select an image (jpeg, png, gif, webp)' },
      ],
    },
    'DELETE /profile/picture': {
      description: 'Removes picture from storage and clears UserProfile.picture.',
    },
    'POST /organization/logo': {
      description:
        'Org permission `org.settings.manage`. Updates Organization.logo for the resolved organization context.',
      headers: [{ key: 'x-org-id', value: '46aa0fb1-e876-4140-aef0-b5ae94888012' }],
      formData: [{ key: 'file', type: 'file', description: 'Organization logo image' }],
    },
    'PATCH /organization/logo': {
      description: 'Same as POST — replaces organization logo.',
      headers: [{ key: 'x-org-id', value: '46aa0fb1-e876-4140-aef0-b5ae94888012' }],
      formData: [{ key: 'file', type: 'file', description: 'Organization logo image' }],
    },
    'DELETE /organization/logo': {
      description: 'Clears Organization.logo and deletes stored file when resolvable.',
      headers: [{ key: 'x-org-id', value: '46aa0fb1-e876-4140-aef0-b5ae94888012' }],
    },
    'POST /workspace/:id/logo': {
      description:
        'Org permission `org.workspace.manage`. Workspace must belong to the organization in context.',
      headers: [{ key: 'x-org-id', value: '46aa0fb1-e876-4140-aef0-b5ae94888012' }],
      formData: [{ key: 'file', type: 'file', description: 'Workspace logo image' }],
    },
    'PATCH /workspace/:id/logo': {
      description: 'Same as POST — replaces workspace logo.',
      headers: [{ key: 'x-org-id', value: '46aa0fb1-e876-4140-aef0-b5ae94888012' }],
      formData: [{ key: 'file', type: 'file', description: 'Workspace logo image' }],
    },
    'DELETE /workspace/:id/logo': {
      description: 'Clears Workspace.logo for the given id within the org context.',
      headers: [{ key: 'x-org-id', value: '46aa0fb1-e876-4140-aef0-b5ae94888012' }],
    },
    'POST /countries/:id/flag': {
      description:
        'Platform permission `address.country.update`. Invalidates address cache on success.',
      formData: [{ key: 'file', type: 'file', description: 'Country flag image' }],
    },
    'PATCH /countries/:id/flag': {
      description: 'Same as POST — replaces country flag.',
      formData: [{ key: 'file', type: 'file', description: 'Country flag image' }],
    },
    'DELETE /countries/:id/flag': {
      description: 'Clears Country.flag and deletes stored file when resolvable.',
    },
  },
  /**
   * `/api/v1/product/{categories|subcategories|templates|products}` — CRUD per entity.
   * Categories & subcategories: org from `x-org-id` / user default. Templates: platform catalog; optional `organizationId` + `attributes` on create/update defines per-org `TemplateAttribute` rows (product `attributes` JSON is validated against those for the same org + `templateId`).
   * Products: require both org and workspace (`x-workspace-id` or user default + membership).
   */
  product: {
    'GET /categories': {
      headers: PRODUCT_SAMPLE_HEADERS,
      query: {
        page: 1,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        languageId: SEED_LANG_EN_ID,
        includeSubcategories: true,
        includeTranslations: false,
        hasPagination: true,
        search: '',
      },
      description:
        'Org-scoped list. Context: `x-org-id` or `User.currentOrganizationId`. Platform permission `product_category.list`. `includeTranslations=true` returns every stored translation; `languageId` still picks list `name`/`description`. With `includeTranslations=false`, pass `languageId` to scope the embedded `translations` array to that language only.',
    },
    'POST /categories': {
      headers: PRODUCT_SAMPLE_HEADERS,
      body: {
        translations: [
          {
            languageId: SEED_LANG_EN_ID,
            name: 'Apparel',
            description: 'Top-level category for clothing items',
          },
          {
            languageId: SEED_LANG_AM_ID,
            name: 'Sample product category (seed AM language)',
            description: null,
          },
        ],
      },
      description:
        'Body: `translations` — one object per **active** `Language` (unique `languageId` each). Same rule as PATCH. Do not send `organizationId`.',
    },
    'GET /categories/:id': {
      headers: PRODUCT_SAMPLE_HEADERS,
      query: {
        languageId: SEED_LANG_EN_ID,
        includeSubcategories: true,
        includeTranslations: false,
      },
      description:
        '`includeTranslations=true` loads all translations; `languageId` selects top-level `name`/`description`. With `includeTranslations=false` and `languageId`, response includes only that language in `translations`.',
    },
    'PATCH /categories/:id': {
      headers: PRODUCT_SAMPLE_HEADERS,
      body: {
        translations: [
          {
            languageId: SEED_LANG_EN_ID,
            name: 'Apparel & Fashion',
            description: 'Updated category name',
          },
          {
            languageId: SEED_LANG_AM_ID,
            name: 'Sample product category — updated (seed AM language)',
            description: 'Updated localized description',
          },
        ],
      },
      description:
        'Same `translations` shape as POST: must include every **active** language. Permission `product_category.update`.',
    },
    'DELETE /categories/:id': {
      headers: PRODUCT_SAMPLE_HEADERS,
    },
    'GET /subcategories': {
      headers: PRODUCT_SAMPLE_HEADERS,
      query: {
        page: 1,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        categoryId: SAMPLE_PRODUCT_CATEGORY_ID,
        languageId: SEED_LANG_EN_ID,
        includeTranslations: false,
        hasPagination: true,
        search: '',
      },
      description:
        'Optional `categoryId` filters by parent category in current org. Permission `product_subcategory.list`. `includeTranslations=true` returns every stored translation; `languageId` still picks list `name`/`description`. With `includeTranslations=false`, pass `languageId` to scope the embedded `translations` array to that language only.',
    },
    'POST /subcategories': {
      headers: PRODUCT_SAMPLE_HEADERS,
      body: {
        categoryId: SAMPLE_PRODUCT_CATEGORY_ID,
        translations: [
          {
            languageId: SEED_LANG_EN_ID,
            name: 'Men Clothing',
            description: 'Subcategory under Apparel',
          },
          {
            languageId: SEED_LANG_AM_ID,
            name: 'Sample product subcategory (seed AM language)',
            description: null,
          },
        ],
      },
      description:
        'Body: `categoryId` (UUID) + `translations` — one object per **active** `Language`. Org from context; categoryId must belong to that org.',
    },
    'GET /subcategories/:id': {
      headers: PRODUCT_SAMPLE_HEADERS,
      query: {
        languageId: SEED_LANG_EN_ID,
        includeTranslations: false,
      },
      description:
        '`includeTranslations=true` loads all translations; `languageId` selects top-level `name`/`description`. With `includeTranslations=false` and `languageId`, response includes only that language in `translations`.',
    },
    'PATCH /subcategories/:id': {
      headers: PRODUCT_SAMPLE_HEADERS,
      body: {
        translations: [
          {
            languageId: SEED_LANG_EN_ID,
            name: 'Menswear',
            description: 'Updated subcategory name',
          },
          {
            languageId: SEED_LANG_AM_ID,
            name: 'Sample product subcategory — updated (seed AM language)',
            description: 'Updated localized description',
          },
        ],
      },
      description:
        'Same `translations` shape as POST: must include every **active** language. Permission `product_subcategory.update`.',
    },
    'DELETE /subcategories/:id': {
      headers: PRODUCT_SAMPLE_HEADERS,
    },
    'GET /templates': {
      headers: PRODUCT_SAMPLE_HEADERS,
      query: {
        page: 1,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        languageId: SEED_LANG_EN_ID,
        organizationId: '46aa0fb1-e876-4140-aef0-b5ae94888012',
        includeTranslations: false,
        includeAttributes: true,
        hasPagination: true,
        search: '',
        isActive: true,
      },
      description:
        'Platform template catalog. `includeTranslations=true` returns every stored translation; `languageId` still picks list `name`/`description`. With `includeTranslations=false`, pass `languageId` to scope the embedded `translations` array. Optional `isActive`. With `includeAttributes=true`, pass `organizationId` (UUID) to return that org’s attribute definitions and `attributeCount`; omit `organizationId` for a global `attributeCount` only. Permission `product_template.list`.',
    },
    'POST /templates': {
      headers: PRODUCT_SAMPLE_HEADERS,
      body: {
        translations: [
          {
            languageId: SEED_LANG_EN_ID,
            name: 'Standard Apparel Template',
            description: 'Platform template for apparel SKUs',
          },
          {
            languageId: SEED_LANG_AM_ID,
            name: 'Sample product template (seed AM language)',
            description: null,
          },
        ],
        attributes: [
          { name: 'size', dataType: 'STRING', isRequired: true },
          { name: 'color', dataType: 'STRING' },
        ],
        version: 1,
        isActive: true,
      },
      description:
        'Body: `translations` — one object per **active** `Language` (unique `languageId` each). Optional `version`, `isActive`. Optional `organizationId` + `attributes`: when `attributes` is non-empty, org scope comes from `organizationId` in the body or from request org context (`x-org-id` / user current organization). Rows are stored as `TemplateAttribute` (names + `dataType` STRING|INT|DOUBLE|DATE_TIME|BOOLEAN).',
    },
    'GET /templates/:id': {
      headers: PRODUCT_SAMPLE_HEADERS,
      query: {
        languageId: SEED_LANG_EN_ID,
        organizationId: '46aa0fb1-e876-4140-aef0-b5ae94888012',
        includeTranslations: false,
        includeAttributes: true,
      },
      description:
        '`includeTranslations=true` loads all translations; `languageId` selects top-level `name`/`description`. With `includeTranslations=false` and `languageId`, response includes only that language in `translations`. With `includeAttributes=true`, optional `organizationId` filters `attributes` to that org’s definitions.',
    },
    'PATCH /templates/:id': {
      headers: PRODUCT_SAMPLE_HEADERS,
      body: {
        translations: [
          {
            languageId: SEED_LANG_EN_ID,
            name: 'Standard Apparel Template v2',
            description: 'Updated template description',
          },
          {
            languageId: SEED_LANG_AM_ID,
            name: 'Sample product template — updated (seed AM language)',
            description: 'Updated localized description',
          },
        ],
        attributes: [{ name: 'size', dataType: 'STRING', isRequired: true }],
        version: 2,
        isActive: true,
      },
      description:
        'Same `translations` shape as POST: must include every **active** language. Optional `organizationId` + `attributes` replaces that org’s `TemplateAttribute` rows for this template (`attributes: []` clears them). Org scope matches POST (body `organizationId` or `x-org-id` / current org). Permission `product_template.update`.',
    },
    'DELETE /templates/:id': {
      headers: PRODUCT_SAMPLE_HEADERS,
    },
    'GET /products': {
      headers: PRODUCT_SAMPLE_HEADERS,
      query: {
        page: 1,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        languageId: SEED_LANG_EN_ID,
        subcategoryId: SAMPLE_PRODUCT_SUBCATEGORY_ID,
        templateId: SAMPLE_PRODUCT_TEMPLATE_ID,
        includeTranslations: false,
        hasPagination: true,
        search: '',
      },
      description:
        'Requires workspace context (`x-workspace-id` or member workspace + org match). Optional filters: `subcategoryId`, `templateId` (UUID). Permission `product.list`.',
    },
    'POST /products': {
      headers: PRODUCT_SAMPLE_HEADERS,
      body: {
        subcategoryId: SAMPLE_PRODUCT_SUBCATEGORY_ID,
        templateId: SAMPLE_PRODUCT_TEMPLATE_ID,
        attributes: {
          size: 'M',
          color: 'Black',
          material: 'Cotton',
          brand: 'Example Co',
          price: 29.99,
        },
        translations: [
          {
            languageId: SEED_LANG_EN_ID,
            name: 'Crew Neck T-Shirt',
            description: 'Basic cotton t-shirt',
          },
          {
            languageId: SEED_LANG_AM_ID,
            name: 'Sample product (seed AM language)',
            description: null,
          },
        ],
      },
      description:
        'Body: `subcategoryId`, `templateId` (UUID), `attributes` (JSON object), `translations` — one object per **active** language. When the template has `TemplateAttribute` rows for the current org, `attributes` keys and value types must match those definitions.',
    },
    'GET /products/:id': {
      headers: PRODUCT_SAMPLE_HEADERS,
      query: {
        languageId: SEED_LANG_EN_ID,
        includeTranslations: false,
      },
      description:
        '`includeTranslations=true` loads all translations; `languageId` selects top-level `name`/`description`. With `includeTranslations=false` and `languageId`, response includes only that language in `translations`.',
    },
    'PATCH /products/:id': {
      headers: PRODUCT_SAMPLE_HEADERS,
      body: {
        subcategoryId: SAMPLE_PRODUCT_SUBCATEGORY_ID,
        templateId: SAMPLE_PRODUCT_TEMPLATE_ID,
        attributes: {
          size: 'L',
          color: 'Navy Blue',
          material: 'Cotton',
          brand: 'Example Co',
          price: 32.99,
        },
        translations: [
          {
            languageId: SEED_LANG_EN_ID,
            name: 'Crew Neck T-Shirt',
            description: 'Updated product description',
          },
          {
            languageId: SEED_LANG_AM_ID,
            name: 'Sample product — updated (seed AM language)',
            description: 'Updated localized description',
          },
        ],
      },
      description:
        'Partial update: any of `subcategoryId`, `templateId`, `attributes`, `translations` (if `translations` is sent, it must list every **active** language). `attributes` is validated against the effective template (updated `templateId` or existing) and org `TemplateAttribute` definitions when present.',
    },
    'DELETE /products/:id': {
      headers: PRODUCT_SAMPLE_HEADERS,
    },
  },
  employee: {
    'GET /': {
      headers: HR_ORG_SAMPLE_HEADERS,
      query: {
        page: 1,
        limit: 20,
        sortBy: 'joiningDate',
        sortOrder: 'desc',
        includeRemoved: 'false',
      },
      description:
        'Requires `org.employee.read` or `org.employee.manage`. Replace `x-org-id` with your organization.',
    },
    'POST /': {
      headers: HR_ORG_SAMPLE_HEADERS,
      body: {
        memberId: SAMPLE_MEMBER_ID_FOR_EMPLOYEE,
        employeeCode: 'API-EMP-001',
        yearsOfExperience: 2,
        seniority: 'MID',
        workType: 'FULL_TIME',
        restDays: ['SATURDAY', 'SUNDAY'],
      },
      description:
        "`memberId` must reference an ACTIVE org member without an existing `Employee` row. Adjust `x-org-id` to match that member's organization.",
    },
    'GET /:id': {
      headers: HR_ORG_SAMPLE_HEADERS,
      description: 'Use `Employee.id` in the path (replace sample UUID).',
    },
    'PATCH /:id': {
      headers: HR_ORG_SAMPLE_HEADERS,
      body: { isActive: true, yearsOfExperience: 3 },
    },
    'DELETE /:id': {
      headers: HR_ORG_SAMPLE_HEADERS,
    },
    'GET /:id/documents': {
      headers: HR_ORG_SAMPLE_HEADERS,
    },
    'POST /:id/documents': {
      headers: HR_ORG_SAMPLE_HEADERS,
      description:
        'Multipart form-data: text fields below plus `file` (PDF or image). Alternatively send JSON with a `file` URL if you already uploaded elsewhere.',
      formData: [
        { key: 'type', type: 'text', value: 'PASSPORT' },
        { key: 'name', type: 'text', value: 'Passport scan' },
        { key: 'issuedBy', type: 'text', value: 'Gov' },
        { key: 'issueDate', type: 'text', value: '2020-01-01T00:00:00.000Z' },
        {
          key: 'file',
          type: 'file',
          description: 'Required unless `file` is sent as a URL string in JSON body',
        },
      ],
    },
    'GET /:id/documents/:documentId': {
      headers: HR_ORG_SAMPLE_HEADERS,
    },
    'PATCH /:id/documents/:documentId': {
      headers: HR_ORG_SAMPLE_HEADERS,
      description:
        'Optional multipart: include a new `file` to replace the stored document URL, and/or text fields to patch metadata.',
      formData: [
        { key: 'name', type: 'text', value: 'Passport scan (updated)' },
        { key: 'file', type: 'file', description: 'Optional: replace file' },
      ],
    },
    'DELETE /:id/documents/:documentId': {
      headers: HR_ORG_SAMPLE_HEADERS,
    },
  },
  zone: {
    'GET /': {
      headers: HR_ORG_SAMPLE_HEADERS,
      query: {
        page: 1,
        limit: 20,
        sortBy: 'name',
        sortOrder: 'asc',
      },
    },
    'POST /': {
      headers: HR_ORG_SAMPLE_HEADERS,
      body: {
        name: 'Branch geofence',
        centerLat: 9.01,
        centerLng: 38.76,
        radiusMeters: 200,
        workspaceId: SAMPLE_WORKSPACE_ID_HR,
      },
      description: 'Optional `workspaceId`; omit or null for org-wide zone.',
    },
    'GET /:id': { headers: HR_ORG_SAMPLE_HEADERS },
    'PATCH /:id': {
      headers: HR_ORG_SAMPLE_HEADERS,
      body: { radiusMeters: 250, name: 'Branch geofence (updated)' },
    },
    'DELETE /:id': { headers: HR_ORG_SAMPLE_HEADERS },
  },
  salaryscale: {
    'GET /': {
      headers: HR_ORG_SAMPLE_HEADERS,
      query: {
        page: 1,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      },
    },
    'POST /': {
      headers: HR_ORG_SAMPLE_HEADERS,
      body: {
        roleId: SAMPLE_ORG_ROLE_ID,
        seniority: 'SENIOR',
        workType: 'FULL_TIME',
        minExperienceYears: 5,
        maxExperienceYears: 15,
        baseSalary: 120000,
        currency: 'ETB',
      },
      description: '`roleId` must belong to the same organization as `x-org-id`.',
    },
    'GET /:id': { headers: HR_ORG_SAMPLE_HEADERS },
    'PATCH /:id': {
      headers: HR_ORG_SAMPLE_HEADERS,
      body: { baseSalary: '125000', maxExperienceYears: 20 },
    },
    'DELETE /:id': { headers: HR_ORG_SAMPLE_HEADERS },
  },
  attendanceconfig: {
    'GET /': {
      headers: HR_ORG_SAMPLE_HEADERS,
      query: { page: 1, limit: 20, sortBy: 'createdAt', sortOrder: 'desc' },
    },
    'POST /': {
      headers: HR_ORG_SAMPLE_HEADERS,
      body: {
        workspaceId: SAMPLE_WORKSPACE_ID_HR,
        defaultMode: 'TWO_SLOTS',
        enforceFaceVerification: false,
        enforceGeoFence: true,
        slots: [
          {
            slotKey: 'MORNING_IN',
            name: 'Morning',
            order: 0,
            startTime: '2026-01-01T06:00:00.000Z',
            endTime: '2026-01-01T10:00:00.000Z',
          },
          {
            slotKey: 'FINAL_OUT',
            name: 'Evening',
            order: 1,
            startTime: '2026-01-01T15:00:00.000Z',
            endTime: '2026-01-01T19:00:00.000Z',
          },
        ],
      },
      description:
        'One config per `(organizationId, workspaceId)` scope. Omit `workspaceId` for org-wide config.',
    },
    'GET /:id': { headers: HR_ORG_SAMPLE_HEADERS },
    'PATCH /:id': {
      headers: HR_ORG_SAMPLE_HEADERS,
      body: { enforceFaceVerification: true },
    },
    'DELETE /:id': { headers: HR_ORG_SAMPLE_HEADERS },
    'GET /:id/slots': { headers: HR_ORG_SAMPLE_HEADERS },
    'POST /:id/slots': {
      headers: HR_ORG_SAMPLE_HEADERS,
      body: {
        slotKey: 'EXTRA_SLOT',
        name: 'Optional slot',
        order: 2,
        startTime: '2026-01-01T12:00:00.000Z',
        endTime: '2026-01-01T13:00:00.000Z',
      },
    },
    'GET /:id/slots/:slotId': { headers: HR_ORG_SAMPLE_HEADERS },
    'PATCH /:id/slots/:slotId': {
      headers: HR_ORG_SAMPLE_HEADERS,
      body: { name: 'Renamed slot' },
    },
    'DELETE /:id/slots/:slotId': { headers: HR_ORG_SAMPLE_HEADERS },
  },
  attendance: {
    'GET /': {
      headers: HR_ORG_SAMPLE_HEADERS,
      query: {
        page: 1,
        limit: 20,
        sortBy: 'date',
        sortOrder: 'desc',
        employeeId: SAMPLE_EMPLOYEE_ID,
      },
      description:
        'Optional filters: `workspaceId`, `slotId`, `status`, `dateFrom`, `dateTo` (ISO).',
    },
    'POST /': {
      headers: HR_ORG_SAMPLE_HEADERS,
      body: {
        employeeId: SAMPLE_EMPLOYEE_ID,
        workspaceId: SAMPLE_WORKSPACE_ID_HR,
        date: '2026-04-22T00:00:00.000Z',
        slotId: SAMPLE_ATTENDANCE_SLOT_ID,
        workedMinutes: 240,
        status: 'PRESENT',
        zoneId: SAMPLE_ZONE_ID,
        locationLat: 9.0055,
        locationLng: 38.7637,
        geoValidated: true,
      },
      description:
        '`slotId` must belong to an `AttendanceConfig` in the same org. `employeeId` must be an employee in that org.',
    },
    'GET /:id': { headers: HR_ORG_SAMPLE_HEADERS },
    'PATCH /:id': {
      headers: HR_ORG_SAMPLE_HEADERS,
      body: { status: 'LATE', workedMinutes: 200, validationNote: 'Adjusted by admin' },
    },
    'DELETE /:id': { headers: HR_ORG_SAMPLE_HEADERS },
  },
};

/** Top-level app routes (not under a module mount). */
export const samplesGeneral: Record<string, RouteSample> = {
  'GET /': {},
  'GET /api/v1/time': {},
};
