import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '../..');

const createDirectory = (dirPath: string): void => {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
};

const slugify = (raw: string): string => {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
};

const pascalCase = (slug: string): string => slug.charAt(0).toUpperCase() + slug.slice(1);

const ensureBaseLocaleFile = (filePath: string, constName: 'en' | 'am'): void => {
  if (!existsSync(filePath)) {
    const baseContent = `const ${constName} = {\n};\n\nexport default ${constName};\n`;
    writeFileSync(filePath, baseContent);
  }
};

const addImportBeforeConst = (
  content: string,
  constName: 'en' | 'am',
  importName: string,
  jsonPath: string,
): string => {
  const marker = `const ${constName} = {`;
  if (content.includes(`import ${importName} from '${jsonPath}'`)) {
    return content;
  }
  const idx = content.indexOf(marker);
  if (idx === -1) {
    throw new Error(`Could not find "${marker}" in locales/${constName}.ts`);
  }
  const insert = `import ${importName} from '${jsonPath}';\n\n`;
  return content.slice(0, idx) + insert + content.slice(idx);
};

const addLastSpreadBeforeClosing = (
  content: string,
  spreadVar: string,
  constName: 'en' | 'am'
): string => {
  const spreadLine = `  ...${spreadVar},`;
  if (content.includes(spreadLine)) {
    return content;
  }
  
  const lines = content.split('\n');
  let lastSpreadIndex = -1;
  let markerIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    if (line.includes(`const ${constName} = {`)) {
      markerIndex = i;
    }
    if (/^\s*\.\.\.[a-zA-Z0-9]+,?\s*$/.test(line)) {
      lastSpreadIndex = i;
    }
  }

  if (lastSpreadIndex !== -1) {
    // Insert after the last spread line found
    lines.splice(lastSpreadIndex + 1, 0, spreadLine);
  } else if (markerIndex !== -1) {
    // No spread lines exist yet, insert right after the marker
    lines.splice(markerIndex + 1, 0, spreadLine);
  } else {
    throw new Error(`Could not find a place to insert the spread variable in ${constName}.ts`);
  }
  
  return lines.join('\n');
};

const moduleCreator = (rawName: string): void => {
  const slug = slugify(rawName);
  if (!slug) {
    console.error('Module name must contain at least one letter or number.');
    process.exit(1);
  }

  const modulePath = join(projectRoot, 'src', 'modules', slug);
  const localesPath = join(projectRoot, 'src', 'locales', slug);
  const rootLocalesPath = join(projectRoot, 'src', 'locales');

  if (existsSync(modulePath)) {
    console.error(`Module folder already exists: ${modulePath}`);
    process.exit(1);
  }
  if (existsSync(join(localesPath, 'en.json')) || existsSync(join(localesPath, 'am.json'))) {
    console.error(`Locale files already exist: ${localesPath}`);
    process.exit(1);
  }

  console.log('Resolved module path:', modulePath);

  const directories = ['controllers', 'routes', 'services', 'validations'];
  createDirectory(modulePath);
  directories.forEach((dir) => createDirectory(join(modulePath, dir)));
  createDirectory(rootLocalesPath); // Ensure root locales directory exists

  const Name = pascalCase(slug);

  const indexTs = `export { ${slug}Controller } from './controllers/${slug}Controller';\nexport { default as ${slug}Routes } from './routes/${slug}Routes';\nexport { ${slug}Service } from './services/${slug}Service';\nexport { ${slug}Validation } from './validations/${slug}Validation';\n`;

  const controllerTs = `export const ${slug}Controller = {\n  // ${Name} handlers\n};\n`;

  const routesTs = `import { Router } from 'express';\n\nconst ${slug}Routes = Router();\n\nexport default ${slug}Routes;\n`;

  const serviceTs = `export const ${slug}Service = {\n  // ${Name} business logic\n};\n`;

  const validationTs = `export const ${slug}Validation = {\n  // Joi.object() schemas for ${Name} — import Joi from 'joi' when you add rules\n};\n`;

  const localePayload: Record<string, Record<string, string>> = {
    [slug]: {
      title: \`\${Name}\`,
    },
  };

  writeFileSync(join(modulePath, 'index.ts'), indexTs);
  writeFileSync(join(modulePath, 'controllers', `${slug}Controller.ts`), controllerTs);
  writeFileSync(join(modulePath, 'routes', `${slug}Routes.ts`), routesTs);
  writeFileSync(join(modulePath, 'services', `${slug}Service.ts`), serviceTs);
  writeFileSync(join(modulePath, 'validations', `${slug}Validation.ts`), validationTs);

  createDirectory(localesPath);
  writeFileSync(join(localesPath, 'en.json'), \`\${JSON.stringify(localePayload, null, 2)}\\n\`);
  writeFileSync(join(localesPath, 'am.json'), \`\${JSON.stringify(localePayload, null, 2)}\\n\`);

  const enTsPath = join(rootLocalesPath, 'en.ts');
  const amTsPath = join(rootLocalesPath, 'am.ts');

  // Ensure base files exist before reading
  ensureBaseLocaleFile(enTsPath, 'en');
  ensureBaseLocaleFile(amTsPath, 'am');

  let enTs = readFileSync(enTsPath, 'utf8');
  let amTs = readFileSync(amTsPath, 'utf8');

  enTs = addImportBeforeConst(enTs, 'en', `${slug}En`, `./${slug}/en.json`);
  enTs = addLastSpreadBeforeClosing(enTs, `${slug}En`, 'en');

  amTs = addImportBeforeConst(amTs, 'am', `${slug}Am`, `./${slug}/am.json`);
  amTs = addLastSpreadBeforeClosing(amTs, `${slug}Am`, 'am');

  writeFileSync(enTsPath, enTs);
  writeFileSync(amTsPath, amTs);

  console.log(\`Module "\${slug}" created under src/modules/\${slug}\`);
  console.log(\`Locales: src/locales/\${slug}/en.json & am.json (merged via en.ts / am.ts)\`);
};

const moduleName = process.argv[2];
if (!moduleName) {
  console.error('Usage: bun run create-module <module-name> (or npm run module <module-name>)');
  console.error('Example: npm run module product');
  process.exit(1);
}

moduleCreator(moduleName);
