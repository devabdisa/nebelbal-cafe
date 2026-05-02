import { prisma } from '../../../src/config/db.ts';
import { SEED_ATTENDANCE_SLOTS } from './data/seedData.ts';

type LogFn = (msg: string) => void;

const dayStart = (h: number, m: number) => {
  const d = new Date();
  d.setUTCHours(h, m, 0, 0);
  return d;
};

/**
 * Sample org compliance documents (`OrganizationDocument`).
 */
export async function seedOrganizationDocuments(
  organizationId: string,
  logger: { info: LogFn; success: LogFn },
): Promise<void> {
  logger.info('Seeding organization documents...');
  await prisma.organizationDocument.createMany({
    data: [
      {
        organizationId,
        type: 'BUSINESS_LICENSE',
        name: 'Demo business license (seed)',
        description: 'Placeholder file for local development',
        file: 'https://example.com/dev/seed/business-license.pdf',
      },
      {
        organizationId,
        type: 'BUSINESS_REGISTRATION',
        name: 'Commercial registration (seed)',
        file: 'https://example.com/dev/seed/registration.pdf',
      },
    ],
  });
  logger.success('Seeded organization documents');
}

export type SeedHrContext = {
  organizationId: string;
  workspaceId: string;
};

/**
 * Salary scales, employees, geofence zone, attendance config/slots, sample attendance and payroll row.
 */
export async function seedHrStack(
  ctx: SeedHrContext,
  logger: { info: LogFn; success: LogFn },
): Promise<void> {
  logger.info('Seeding HR: salary scales, employees, zone, attendance...');

  const roles = await prisma.orgRole.findMany({
    where: { organizationId: ctx.organizationId },
  });
  const ownerRole = roles.find((r) => r.roleType === 'OWNER');
  const memberRole = roles.find((r) => r.roleType === 'MEMBER');
  if (!ownerRole || !memberRole) {
    throw new Error('seedHrStack: Owner/Member org roles not found for organization');
  }

  const scaleOwnerMid = await prisma.salaryScale.create({
    data: {
      organizationId: ctx.organizationId,
      roleId: ownerRole.id,
      seniority: 'MID',
      workType: 'FULL_TIME',
      minExperienceYears: 3,
      maxExperienceYears: 10,
      baseSalary: '95000',
      currency: 'ETB',
    },
  });

  const scaleMemberJunior = await prisma.salaryScale.create({
    data: {
      organizationId: ctx.organizationId,
      roleId: memberRole.id,
      seniority: 'JUNIOR',
      workType: 'FULL_TIME',
      minExperienceYears: 0,
      maxExperienceYears: 2,
      baseSalary: '38000',
      currency: 'ETB',
    },
  });

  const scaleMemberMid = await prisma.salaryScale.create({
    data: {
      organizationId: ctx.organizationId,
      roleId: memberRole.id,
      seniority: 'MID',
      workType: 'FULL_TIME',
      minExperienceYears: 2,
      maxExperienceYears: 8,
      baseSalary: '52000',
      currency: 'ETB',
    },
  });

  const superAdminUser = await prisma.user.findUnique({
    where: { email: 'superadmin@company.com' },
  });
  const jane = await prisma.user.findUnique({ where: { email: 'jane@company.com' } });
  const manager = await prisma.user.findUnique({ where: { email: 'manager@company.com' } });
  if (!superAdminUser?.id || !jane?.id || !manager?.id) {
    throw new Error(
      'seedHrStack: superadmin@company.com, jane@company.com, manager@company.com must exist',
    );
  }

  const superAdminMember = await prisma.member.findUnique({
    where: {
      userId_organizationId: { userId: superAdminUser.id, organizationId: ctx.organizationId },
    },
  });
  const janeMember = await prisma.member.findUnique({
    where: {
      userId_organizationId: { userId: jane.id, organizationId: ctx.organizationId },
    },
  });
  const managerMember = await prisma.member.findUnique({
    where: {
      userId_organizationId: { userId: manager.id, organizationId: ctx.organizationId },
    },
  });
  if (!superAdminMember || !janeMember || !managerMember) {
    throw new Error('seedHrStack: members not found on primary organization for seeded users');
  }

  const empSuper = await prisma.employee.create({
    data: {
      memberId: superAdminMember.id,
      organizationId: ctx.organizationId,
      employeeCode: 'EMP-SEED-000',
      yearsOfExperience: 8,
      seniority: 'LEAD',
      workType: 'FULL_TIME',
      attendanceMode: 'TWO_SLOTS',
      salaryScaleId: scaleOwnerMid.id,
    },
  });

  const empJane = await prisma.employee.create({
    data: {
      memberId: janeMember.id,
      organizationId: ctx.organizationId,
      employeeCode: 'EMP-SEED-001',
      yearsOfExperience: 1,
      seniority: 'JUNIOR',
      workType: 'FULL_TIME',
      attendanceMode: 'TWO_SLOTS',
      salaryScaleId: scaleMemberJunior.id,
      emergencyName: 'Alex Smith',
      emergencyPhone: '+251900000001',
      emergencyRelation: 'Spouse',
    },
  });

  const empManager = await prisma.employee.create({
    data: {
      memberId: managerMember.id,
      organizationId: ctx.organizationId,
      employeeCode: 'EMP-SEED-002',
      yearsOfExperience: 5,
      seniority: 'MID',
      workType: 'FULL_TIME',
      attendanceMode: 'TWO_SLOTS',
      salaryScaleId: scaleMemberMid.id,
    },
  });

  await prisma.employeeRestDay.createMany({
    data: [
      { employeeId: empJane.id, day: 'SATURDAY' },
      { employeeId: empJane.id, day: 'SUNDAY' },
      { employeeId: empManager.id, day: 'SUNDAY' },
    ],
  });

  await prisma.employeeDocument.create({
    data: {
      employeeId: empJane.id,
      type: 'NATIONAL_ID',
      name: 'National ID (seed)',
      file: 'https://example.com/dev/seed/national-id.pdf',
      issuedBy: 'Ethiopia — demo',
      issueDate: new Date('2020-01-15'),
    },
  });

  const hqZone = await prisma.zone.create({
    data: {
      organizationId: ctx.organizationId,
      workspaceId: ctx.workspaceId,
      name: 'HQ check-in zone (seed)',
      centerLat: 9.005401,
      centerLng: 38.763611,
      radiusMeters: 150,
    },
  });

  const attendanceConfig = await prisma.attendanceConfig.create({
    data: {
      organizationId: ctx.organizationId,
      workspaceId: ctx.workspaceId,
      defaultMode: 'TWO_SLOTS',
      enforceFaceVerification: false,
      enforceGeoFence: false,
      attendanceSlots: {
        create: SEED_ATTENDANCE_SLOTS.map((slot) => ({
          slotKey: slot.slotKey,
          name: slot.name,
          order: slot.order,
          startTime: dayStart(slot.startHourUtc, slot.startMinuteUtc),
          endTime: dayStart(slot.endHourUtc, slot.endMinuteUtc),
        })),
      },
    },
    include: { attendanceSlots: true },
  });

  const morningSlot = attendanceConfig.attendanceSlots.find((s) => s.slotKey === 'MORNING_IN');
  const finalSlot = attendanceConfig.attendanceSlots.find((s) => s.slotKey === 'FINAL_OUT');
  if (!morningSlot || !finalSlot) {
    throw new Error('seedHrStack: MORNING_IN / FINAL_OUT slots missing');
  }

  /** Calendar day in UTC (matches `date` on `Attendance`). */
  const utcDay = (y: number, m0: number, d: number) => new Date(Date.UTC(y, m0, d, 0, 0, 0, 0));

  const now = new Date();
  const todayUtc = utcDay(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const yesterdayUtc = utcDay(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1);

  /** Slightly offset from zone center — within seeded radius. */
  const checkInLat = 9.00555;
  const checkInLng = 38.76372;

  type AttendanceSeed = {
    employeeId: string;
    date: Date;
    slotId: string;
    workedMinutes: number | null;
    clockIn: Date;
    clockOut: Date | null;
    status: 'PRESENT' | 'LATE' | 'ABSENT' | 'HALF_DAY';
    faceVerified: boolean;
    faceImageUrl?: string | null;
    geoValidated: boolean;
    validationNote?: string | null;
    zoneId: string;
    locationLat: number;
    locationLng: number;
  };

  const attendanceRows: AttendanceSeed[] = [
    // Jane — full day today (both slots), geo + zone per model
    {
      employeeId: empJane.id,
      date: todayUtc,
      slotId: morningSlot.id,
      workedMinutes: 210,
      clockIn: dayStart(6, 35),
      clockOut: dayStart(10, 5),
      status: 'PRESENT',
      faceVerified: false,
      geoValidated: true,
      validationNote: 'Seed: morning check-in inside HQ zone',
      zoneId: hqZone.id,
      locationLat: checkInLat,
      locationLng: checkInLng,
    },
    {
      employeeId: empJane.id,
      date: todayUtc,
      slotId: finalSlot.id,
      workedMinutes: 180,
      clockIn: dayStart(15, 5),
      clockOut: dayStart(18, 5),
      status: 'PRESENT',
      faceVerified: false,
      geoValidated: true,
      zoneId: hqZone.id,
      locationLat: checkInLat,
      locationLng: checkInLng,
    },
    // Jane — yesterday morning only (half-day pattern)
    {
      employeeId: empJane.id,
      date: yesterdayUtc,
      slotId: morningSlot.id,
      workedMinutes: 200,
      clockIn: dayStart(7, 0),
      clockOut: dayStart(10, 20),
      status: 'LATE',
      faceVerified: false,
      geoValidated: true,
      validationNote: 'Seed: late arrival',
      zoneId: hqZone.id,
      locationLat: checkInLat,
      locationLng: checkInLng,
    },
    // Manager — today both slots
    {
      employeeId: empManager.id,
      date: todayUtc,
      slotId: morningSlot.id,
      workedMinutes: 220,
      clockIn: dayStart(6, 15),
      clockOut: dayStart(10, 0),
      status: 'PRESENT',
      faceVerified: true,
      faceImageUrl: 'https://example.com/dev/seed/face-verify-placeholder.jpg',
      geoValidated: true,
      zoneId: hqZone.id,
      locationLat: checkInLat,
      locationLng: checkInLng,
    },
    {
      employeeId: empManager.id,
      date: todayUtc,
      slotId: finalSlot.id,
      workedMinutes: 195,
      clockIn: dayStart(15, 0),
      clockOut: dayStart(18, 15),
      status: 'PRESENT',
      faceVerified: true,
      geoValidated: true,
      zoneId: hqZone.id,
      locationLat: checkInLat,
      locationLng: checkInLng,
    },
    // Superadmin employee — today morning only in seed (optional second slot)
    {
      employeeId: empSuper.id,
      date: todayUtc,
      slotId: morningSlot.id,
      workedMinutes: 240,
      clockIn: dayStart(6, 0),
      clockOut: dayStart(10, 0),
      status: 'PRESENT',
      faceVerified: false,
      geoValidated: true,
      zoneId: hqZone.id,
      locationLat: checkInLat,
      locationLng: checkInLng,
    },
    {
      employeeId: empSuper.id,
      date: todayUtc,
      slotId: finalSlot.id,
      workedMinutes: 200,
      clockIn: dayStart(15, 30),
      clockOut: dayStart(18, 50),
      status: 'PRESENT',
      faceVerified: false,
      geoValidated: true,
      zoneId: hqZone.id,
      locationLat: checkInLat,
      locationLng: checkInLng,
    },
  ];

  await prisma.attendance.createMany({
    data: attendanceRows.map((r) => ({
      employeeId: r.employeeId,
      organizationId: ctx.organizationId,
      workspaceId: ctx.workspaceId,
      date: r.date,
      slotId: r.slotId,
      workedMinutes: r.workedMinutes,
      clockIn: r.clockIn,
      clockOut: r.clockOut,
      locationLat: r.locationLat,
      locationLng: r.locationLng,
      zoneId: r.zoneId,
      status: r.status,
      faceVerified: r.faceVerified,
      faceImageUrl: r.faceImageUrl ?? null,
      geoValidated: r.geoValidated,
      validationNote: r.validationNote ?? null,
    })),
  });

  /** Align `SalaryRecord.baseSalary` with `SalaryScale.baseSalary` (Decimal → number). */
  const baseFromScale = (scale: { baseSalary: unknown }) => Number(scale.baseSalary);

  const janeBase = baseFromScale(scaleMemberJunior);
  const managerBase = baseFromScale(scaleMemberMid);
  const superBase = baseFromScale(scaleOwnerMid);

  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;

  /** `SalaryRecord`: baseSalary, totalWorkedMinutes, deductions?, bonus?, finalSalary */
  const salarySeeds: Array<{
    employeeId: string;
    month: number;
    year: number;
    baseSalary: number;
    totalWorkedMinutes: number;
    deductions: number | null;
    bonus: number | null;
    finalSalary: number;
  }> = [
    {
      employeeId: empJane.id,
      month,
      year,
      baseSalary: janeBase,
      totalWorkedMinutes: 17_280,
      deductions: 1200,
      bonus: 500,
      finalSalary: janeBase - 1200 + 500,
    },
    {
      employeeId: empJane.id,
      month: prevMonth,
      year: prevYear,
      baseSalary: janeBase,
      totalWorkedMinutes: 16_800,
      deductions: 800,
      bonus: null,
      finalSalary: janeBase - 800,
    },
    {
      employeeId: empManager.id,
      month,
      year,
      baseSalary: managerBase,
      totalWorkedMinutes: 18_240,
      deductions: 2500,
      bonus: 1000,
      finalSalary: managerBase - 2500 + 1000,
    },
    {
      employeeId: empSuper.id,
      month,
      year,
      baseSalary: superBase,
      totalWorkedMinutes: 19_200,
      deductions: 5000,
      bonus: null,
      finalSalary: superBase - 5000,
    },
  ];

  await prisma.salaryRecord.createMany({
    data: salarySeeds.map((s) => ({
      employeeId: s.employeeId,
      organizationId: ctx.organizationId,
      month: s.month,
      year: s.year,
      baseSalary: s.baseSalary,
      totalWorkedMinutes: s.totalWorkedMinutes,
      deductions: s.deductions,
      bonus: s.bonus,
      finalSalary: s.finalSalary,
    })),
  });

  logger.success(
    'Seeded HR domain (SalaryScale, Employee, Zone, AttendanceConfig, Attendance, SalaryRecord)',
  );
}
