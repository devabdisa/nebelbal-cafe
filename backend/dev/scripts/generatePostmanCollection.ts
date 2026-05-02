/**
 * Builds a Postman Collection v2.1 from the live Express 5 app.
 *
 * `express-to-postman` targets Express 4 (`_router` + `layer.regexp`). Express 5
 * uses `app.router` and `router` package layers without mount paths on `regexp`,
 * so nested routers collapse to `/` and `/:id`. This script resolves mounts via
 * `mountedApiRouters` (same references as `app.use`) and walks each Router stack.
 *
 * Folders follow module names (last segment of each mount path). Sample bodies and
 * query params live in `postmanSamples.ts`.
 *
 * Nested routers under `/api/v1/address/…` are merged via `explicitAddressApiRoutes()` because
 * Express 5 stack walking does not surface those paths.
 *
 * The same applies to `/api/v1/product/…` (`categories`, `subcategories`, `templates`, `products`):
 * nested routers collapse in stack introspection, so `explicitProductApiRoutes()` supplies the real paths.
 * **`/api/v1/employee/…/documents`** and **`/api/v1/attendanceconfig/…/slots`** use `explicitEmployeeApiRoutes()` / `explicitAttendanceConfigApiRoutes()` for the same reason.
 * Product **category**, **subcategory**, **template**, and **product** POST bodies use `translations` (one entry per active language); PATCH product may include `translations` with the same rule. See `postmanSamples.ts`.
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { IRouter } from 'express';

import { app, mountedApiRouters } from '../../src/app.ts';
import {
  type RoutePattern,
  type RouteSample,
  samplesByModule,
  samplesGeneral,
} from './postmanSamples.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));

const GENERAL_FOLDER = 'General';

type RouteRow = { method: string; path: string };

function joinUrlPath(base: string, routePath: string): string {
  if (routePath === '/') {
    return base === '' ? '/' : base;
  }
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  const r = routePath.startsWith('/') ? routePath : `/${routePath}`;
  return `${b}${r}`;
}

function methodsFromRoute(route: { methods?: Record<string, boolean> }): string[] {
  const m = route.methods;
  if (!m) return [];
  return Object.keys(m).filter((k) => k !== '_all' && m[k]);
}

const routerToPrefix = new Map<IRouter, string>();
for (const { path, router } of mountedApiRouters) {
  routerToPrefix.set(router, path.startsWith('/') ? path : `/${path}`);
}

function collectFromStack(stack: unknown[] | undefined, prefix: string, out: RouteRow[]): void {
  if (!stack || !Array.isArray(stack)) return;

  for (const layer of stack) {
    if (!layer || typeof layer !== 'object') continue;
    const L = layer as {
      route?: { path: string | string[]; methods?: Record<string, boolean> };
      name?: string;
      handle?: IRouter & { stack?: unknown[] };
    };

    if (L.route?.path != null && L.route.methods) {
      const paths = Array.isArray(L.route.path) ? L.route.path : [L.route.path];
      const methods = methodsFromRoute(L.route);
      for (const p of paths) {
        const full = joinUrlPath(prefix, typeof p === 'string' ? p : String(p));
        for (const method of methods) {
          out.push({ method: method.toUpperCase(), path: full });
        }
      }
      continue;
    }

    if (L.name === 'router' && L.handle?.stack) {
      const mount = routerToPrefix.get(L.handle as IRouter);
      const nextPrefix = mount !== undefined ? joinUrlPath(prefix, mount) : prefix;
      collectFromStack(L.handle.stack, nextPrefix, out);
    }
  }
}

/**
 * Express 5 nested `Router.use('/countries', …)` layers do not expose mount paths to the stack
 * walker above, so `/api/v1/address/countries` etc. never appear. These match `addressRoutes.ts`.
 */
function explicitAddressApiRoutes(): RouteRow[] {
  const subs = ['countries', 'regions', 'city-zones', 'district-subcities'] as const;
  const out: RouteRow[] = [];
  for (const sub of subs) {
    const base = `/api/v1/address/${sub}`;
    out.push(
      { method: 'GET', path: base },
      { method: 'POST', path: base },
      { method: 'GET', path: `${base}/:id` },
      { method: 'PATCH', path: `${base}/:id` },
      { method: 'DELETE', path: `${base}/:id` },
    );
  }
  return out;
}

/** Matches `productRoutes.ts` mounts: category / subcategory / template / product item routers. */
function explicitProductApiRoutes(): RouteRow[] {
  const subs = ['categories', 'subcategories', 'templates', 'products'] as const;
  const out: RouteRow[] = [];
  for (const sub of subs) {
    const base = `/api/v1/product/${sub}`;
    out.push(
      { method: 'GET', path: base },
      { method: 'POST', path: base },
      { method: 'GET', path: `${base}/:id` },
      { method: 'PATCH', path: `${base}/:id` },
      { method: 'DELETE', path: `${base}/:id` },
    );
  }
  return out;
}

/** Express 5 stack walking often omits `/:id/documents` nested routes under `employee`. */
function explicitEmployeeApiRoutes(): RouteRow[] {
  const base = '/api/v1/employee';
  return [
    { method: 'GET', path: `${base}/:id/documents` },
    { method: 'POST', path: `${base}/:id/documents` },
    { method: 'GET', path: `${base}/:id/documents/:documentId` },
    { method: 'PATCH', path: `${base}/:id/documents/:documentId` },
    { method: 'DELETE', path: `${base}/:id/documents/:documentId` },
  ];
}

/** Nested `AttendanceSlot` paths under `attendanceconfig`. */
function explicitAttendanceConfigApiRoutes(): RouteRow[] {
  const base = '/api/v1/attendanceconfig';
  return [
    { method: 'GET', path: `${base}/:id/slots` },
    { method: 'POST', path: `${base}/:id/slots` },
    { method: 'GET', path: `${base}/:id/slots/:slotId` },
    { method: 'PATCH', path: `${base}/:id/slots/:slotId` },
    { method: 'DELETE', path: `${base}/:id/slots/:slotId` },
  ];
}

/** Stack walking merges nested product routers into bogus `/api/v1/product` and `/api/v1/product/:id` rows. */
function isInvalidIntrospectedProductRoute(path: string): boolean {
  if (path === '/api/v1/product') return true;
  if (!path.startsWith('/api/v1/product/')) return false;
  return !/^\/api\/v1\/product\/(categories|subcategories|templates|products)(\/|$)/.test(path);
}

/**
 * Stack walking can emit `/api/v1/employee/:id` rows that collide with `/documents` segments, or omit nested
 * document routes (handled via `explicitEmployeeApiRoutes`). Drop unknown extra segments.
 */
function isInvalidIntrospectedEmployeeRoute(path: string): boolean {
  if (path === '/api/v1/employee') return false;
  if (!path.startsWith('/api/v1/employee/')) return false;
  const rest = path.slice('/api/v1/employee'.length);
  if (/^\/:[^/]+$/.test(rest)) return false;
  if (/^\/[^/]+$/.test(rest)) return false;
  if (/^\/[^/]+\/documents$/.test(rest)) return false;
  if (/^\/[^/]+\/documents\/[^/]+$/.test(rest)) return false;
  if (/^\/:[^/]+\/documents$/.test(rest)) return false;
  if (/^\/:[^/]+\/documents\/:[^/]+$/.test(rest)) return false;
  return true;
}

function listRoutes(): RouteRow[] {
  const rows: RouteRow[] = [];
  const root = app.router?.stack;
  collectFromStack(root, '', rows);

  const seen = new Set<string>();
  const unique: RouteRow[] = [];
  for (const r of rows) {
    const key = `${r.method} ${r.path}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(r);
  }

  // Drop incorrect /api/v1/address (and /:id) rows from stack introspection; replace with explicit list.
  const withoutAddress = unique.filter(
    (r) => !(r.path === '/api/v1/address' || r.path.startsWith('/api/v1/address/')),
  );
  const withoutAddressAndProductNoise = withoutAddress.filter(
    (r) => !isInvalidIntrospectedProductRoute(r.path),
  );
  const withoutHrNoise = withoutAddressAndProductNoise.filter(
    (r) => !isInvalidIntrospectedEmployeeRoute(r.path),
  );
  const merged = [
    ...withoutHrNoise,
    ...explicitAddressApiRoutes(),
    ...explicitProductApiRoutes(),
    ...explicitEmployeeApiRoutes(),
    ...explicitAttendanceConfigApiRoutes(),
  ];
  unique.length = 0;
  seen.clear();
  const deduped: RouteRow[] = [];
  for (const r of merged) {
    const key = `${r.method} ${r.path}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(r);
  }
  deduped.sort((a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method));
  return deduped;
}

function normalizeMount(mountPath: string): string {
  return mountPath.endsWith('/') ? mountPath.slice(0, -1) : mountPath;
}

/** Longest matching `/api/v1/...` mount for this full path. */
function findMountForPath(fullPath: string): { mount: string; moduleSlug: string } | null {
  let best: { mount: string; moduleSlug: string; len: number } | null = null;
  for (const { path: mountPath } of mountedApiRouters) {
    const m = normalizeMount(mountPath);
    if (fullPath === m || fullPath.startsWith(`${m}/`)) {
      if (!best || m.length > best.len) {
        const parts = m.split('/').filter(Boolean);
        const moduleSlug = parts[parts.length - 1];
        if (moduleSlug) {
          best = { mount: m, moduleSlug, len: m.length };
        }
      }
    }
  }
  return best ? { mount: best.mount, moduleSlug: best.moduleSlug } : null;
}

const AUTH_LITERAL_SEGMENTS = new Set([
  'register',
  'login',
  'refresh',
  'forgot-password',
  'set-password',
  'change-password',
  'me',
  'profile',
  'context',
  'logout',
]);

/** Single-segment paths under `/api/v1/users` that are not `:id`. */
const USERS_LITERAL_SINGLE = new Set(['profile', 'platform']);

/** Second path segment under `/:id/...` for users admin routes (matches `usersRoutes`). */
const USERS_ID_SUFFIX = new Set(['status', 'soft-delete', 'platform-role', 'platform-overrides']);
const WORKSPACE_ID_SUFFIX = new Set(['status']);
const PRODUCT_SINGLE = new Set(['categories', 'subcategories', 'templates', 'products']);

/** Sub-routers under `/api/v1/address` (`addressRoutes.ts`). */
const ADDRESS_SUB = new Set(['countries', 'regions', 'city-zones', 'district-subcities']);

function isUuidLike(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);
}

/** Route path within a mounted router: `/`, `/:id`, `/settings`, `/accept`, `/decline`, auth literals, or users nested paths. */
function relativePattern(mountBase: string, fullPath: string): string {
  const m = normalizeMount(mountBase);
  if (fullPath === m) return '/';
  const rest = fullPath.slice(m.length);
  if (rest === '' || rest === '/') return '/';
  const segments = rest.split('/').filter(Boolean);
  if (segments.length === 1 && segments[0] === 'settings') {
    return '/settings';
  }
  if (segments.length === 1 && segments[0] === 'request') {
    return '/request';
  }
  if (segments.length === 1 && segments[0] === 'accept') {
    return '/accept';
  }
  if (segments.length === 1 && segments[0] === 'decline') {
    return '/decline';
  }
  if (m === '/api/v1/auth' && segments.length === 1 && AUTH_LITERAL_SEGMENTS.has(segments[0]!)) {
    return `/${segments[0]}`;
  }
  if (m === '/api/v1/users' && segments.length === 1 && USERS_LITERAL_SINGLE.has(segments[0]!)) {
    return `/${segments[0]}`;
  }
  if (m === '/api/v1/users' && segments.length === 2 && USERS_ID_SUFFIX.has(segments[1]!)) {
    return `/:id/${segments[1]}`;
  }
  if (m === '/api/v1/workspace' && segments.length === 2 && WORKSPACE_ID_SUFFIX.has(segments[1]!)) {
    return `/:id/${segments[1]}`;
  }
  if (m === '/api/v1/product') {
    if (segments.length === 1 && PRODUCT_SINGLE.has(segments[0]!)) {
      return `/${segments[0]}`;
    }
    if (segments.length === 2 && PRODUCT_SINGLE.has(segments[0]!)) {
      const seg = segments[1]!;
      const idOk = seg === ':id' || isUuidLike(seg);
      if (idOk) {
        return `/${segments[0]}/:id`;
      }
    }
  }
  if (m === '/api/v1/address') {
    if (segments.length === 1 && ADDRESS_SUB.has(segments[0]!)) {
      return `/${segments[0]}`;
    }
    if (
      segments.length === 2 &&
      ADDRESS_SUB.has(segments[0]!) &&
      (isUuidLike(segments[1]!) || segments[1] === ':id')
    ) {
      return `/${segments[0]}/:id`;
    }
  }
  if (m === '/api/v1/employee') {
    if (
      segments.length === 2 &&
      segments[1] === 'documents' &&
      (isUuidLike(segments[0]!) || segments[0] === ':id')
    ) {
      return '/:id/documents';
    }
    if (
      segments.length === 3 &&
      segments[1] === 'documents' &&
      (isUuidLike(segments[0]!) || segments[0] === ':id') &&
      (isUuidLike(segments[2]!) || segments[2] === ':documentId')
    ) {
      return '/:id/documents/:documentId';
    }
  }
  if (m === '/api/v1/attendanceconfig') {
    if (
      segments.length === 2 &&
      segments[1] === 'slots' &&
      (isUuidLike(segments[0]!) || segments[0] === ':id')
    ) {
      return '/:id/slots';
    }
    if (
      segments.length === 3 &&
      segments[1] === 'slots' &&
      (isUuidLike(segments[0]!) || segments[0] === ':id') &&
      (isUuidLike(segments[2]!) || segments[2] === ':slotId')
    ) {
      return '/:id/slots/:slotId';
    }
  }
  if (m === '/api/v1/invitation') {
    if (
      segments.length === 2 &&
      segments[1] === 'resend' &&
      (isUuidLike(segments[0]!) || segments[0] === ':id')
    ) {
      return '/:id/resend';
    }
    if (
      segments.length === 2 &&
      segments[1] === 'role' &&
      (isUuidLike(segments[0]!) || segments[0] === ':id')
    ) {
      return '/:id/role';
    }
  }
  if (m === '/api/v1/upload') {
    if (segments.length === 2 && segments[0] === 'profile' && segments[1] === 'picture') {
      return '/profile/picture';
    }
    if (segments.length === 2 && segments[0] === 'organization' && segments[1] === 'logo') {
      return '/organization/logo';
    }
    if (
      segments.length === 3 &&
      segments[0] === 'workspace' &&
      segments[2] === 'logo' &&
      (isUuidLike(segments[1]!) || segments[1] === ':id')
    ) {
      return '/workspace/:id/logo';
    }
    if (
      segments.length === 3 &&
      segments[0] === 'countries' &&
      segments[2] === 'flag' &&
      (isUuidLike(segments[1]!) || segments[1] === ':id')
    ) {
      return '/countries/:id/flag';
    }
  }
  if (segments.length === 1) return '/:id';
  return '/:id';
}

function sampleForRoute(method: string, fullPath: string): RouteSample {
  const generalKey = `${method} ${fullPath}`;
  if (Object.prototype.hasOwnProperty.call(samplesGeneral, generalKey)) {
    return samplesGeneral[generalKey] ?? {};
  }

  const mounted = findMountForPath(fullPath);
  if (!mounted) return {};

  const rel = relativePattern(mounted.mount, fullPath);
  const pattern = `${method} ${rel}` as RoutePattern;
  const mod = samplesByModule[mounted.moduleSlug];
  return mod?.[pattern] ?? {};
}

function folderForPath(fullPath: string): string {
  const mounted = findMountForPath(fullPath);
  if (mounted) return mounted.moduleSlug;
  return GENERAL_FOLDER;
}

function buildPostmanRequest(method: string, path: string, sample: RouteSample): object {
  const headers: { key: string; value: string }[] = [];
  if (sample.headers) {
    for (const h of sample.headers) {
      headers.push({ key: h.key, value: h.value });
    }
  }

  const wantsFormData =
    sample.formData !== undefined &&
    sample.formData.length > 0 &&
    ['POST', 'PATCH', 'PUT'].includes(method);
  const wantsJsonBody =
    !wantsFormData && sample.body !== undefined && ['POST', 'PATCH', 'PUT'].includes(method);
  if (wantsJsonBody) {
    headers.push({ key: 'Content-Type', value: 'application/json' });
  }

  const pathSegments = path === '/' ? [] : path.split('/').filter(Boolean);
  const url: Record<string, unknown> = {
    raw: `{{baseUrl}}${path}`,
    host: ['{{baseUrl}}'],
    path: pathSegments,
  };

  if (sample.query && Object.keys(sample.query).length > 0) {
    url['query'] = Object.entries(sample.query).map(([key, value]) => ({
      key,
      value: String(value),
    }));
  }

  const request: Record<string, unknown> = {
    method,
    header: headers,
    url,
  };

  if (sample.description) {
    request['description'] = sample.description;
  }

  if (wantsFormData && sample.formData) {
    request['body'] = {
      mode: 'formdata',
      formdata: sample.formData.map((part) => {
        if (part.type === 'file') {
          const row: Record<string, unknown> = {
            key: part.key,
            type: 'file',
            src: [],
          };
          if (part.description) {
            row['description'] = part.description;
          }
          return row;
        }
        return { key: part.key, type: 'text', value: part.value };
      }),
    };
  } else if (wantsJsonBody) {
    request['body'] = {
      mode: 'raw',
      raw: JSON.stringify(sample.body, null, 2),
      options: { raw: { language: 'json' } },
    };
  }

  return request;
}

function buildCollection(): object {
  const routes = listRoutes();
  const byFolder = new Map<string, { name: string; item: object[] }>();

  for (const { method, path } of routes) {
    const folder = folderForPath(path);
    const sample = sampleForRoute(method, path);
    if (!byFolder.has(folder)) {
      byFolder.set(folder, { name: folder, item: [] });
    }
    byFolder.get(folder)!.item.push({
      name: `${method} ${path}`,
      request: buildPostmanRequest(method, path, sample),
    });
  }

  const folderOrder = [GENERAL_FOLDER, ...Object.keys(samplesByModule).sort()];
  const seen = new Set<string>();
  const orderedFolders: { name: string; item: object[] }[] = [];
  for (const name of folderOrder) {
    const g = byFolder.get(name);
    if (g && g.item.length > 0) {
      orderedFolders.push(g);
      seen.add(name);
    }
  }
  for (const [name, g] of byFolder) {
    if (!seen.has(name) && g.item.length > 0) {
      orderedFolders.push(g);
    }
  }

  return {
    info: {
      name: 'SAS Inventory API',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    item: orderedFolders,
  };
}

const outPath = join(__dirname, '../../collections/api.json');
writeFileSync(outPath, `${JSON.stringify(buildCollection(), null, 2)}\n`, 'utf-8');
console.log(`Postman collection written to ${outPath}`);
