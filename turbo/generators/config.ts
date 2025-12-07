import type { PlopTypes } from '@turbo/gen';
import { z } from 'zod'

// ============================================================================
// TYPE DEFINITIONS & SCHEMAS
// ============================================================================

type Framework = 'nextjs' | 'tanstack-start' | 'angular' | 'vite';
type ServiceRuntime = 'go';
type PackageAnswers = {
    name: string
}
type AppAnswers = {
  name: string;
  framework: Framework;
}
type ServiceAnswers = {
  name: string;
  runtime: ServiceRuntime;
}

// Zod schemas for runtime validation
const PackageSchema = z.object({
    name: z
        .string()
        .min(1, 'Package name is required')
        .regex(/^[a-z0-9-]+$/, 'Package name must contain only lowercase letters, numbers, and hyphens')
        .refine(
            (name) => !name.startsWith('package-'),
            'Package name should not start with "package-"'
        ),
})

const AppSchema = z.object({
  name: z
    .string()
    .min(1, 'App name is required')
    .regex(/^[a-z0-9-]+$/, 'App name must contain only lowercase letters, numbers, and hyphens'),
  framework: z.enum(['nextjs', 'tanstack-start', 'angular', 'vite']),
});

const ServiceSchema = z.object({
  name: z
    .string()
    .min(1, 'Service name is required')
    .regex(/^[a-z0-9-]+$/, 'Service name must contain only lowercase letters, numbers, and hyphens'),
  runtime: z.enum(['go']),
});


// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Sanitizes and normalizes package/app names
 * Removes common prefixes and ensures consistent naming
 */
const sanitizeName = (name: string, prefix?: string): string => {
  let sanitized = name.trim().toLowerCase();

  // Remove common prefixes
  if (prefix && sanitized.startsWith(`${prefix}/`)) {
    sanitized = sanitized.replace(`${prefix}/`, '');
  }

  // Remove @org/ or @package/ patterns
  sanitized = sanitized.replace(/^@[a-z0-9-]+\//, '');

  return sanitized;
};

/**
 * Validates answers against schema and throws detailed error messages
 */
const validateAnswers = <T,>(schema: z.ZodSchema<T>, answers: unknown): T => {
  const result = schema.safeParse(answers);
  if (!result.success) {
    const errors = result.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new Error(`Validation failed: ${errors}`);
  }
  return result.data;
};

// ============================================================================
// GENERATOR SETUP
// ============================================================================
export default function generator(plop: PlopTypes.NodePlopAPI): void {
    // Register custom helpers
    plop.setHelper('pascalCase', (text: string) => {
        return text
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
    });

    plop.setHelper('camelCase', (text: string) => {
        const [first, ...rest] = text.split('-');
        return first + rest.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("");
    })


    // ========================================================================
    // PACKAGE GENERATOR
    // create a package for the monorepo
    // ========================================================================
    plop.setGenerator("package", {
        description: "Generate a new package for the monorepo",
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Package name (lowercase, hyphens allowed)',
                default: 'my-package'
            },
        ],
        actions: [
            // Validation & Sanitization
            (answers: object) => {
                try {
                    const answersRecord = answers as Record<string, unknown>;
                    const sanitized = sanitizeName(answersRecord.name as string, '@packages');
                    const validated = validateAnswers(PackageSchema, { name: sanitized });
                    answersRecord.name = validated.name;
                    return `✓ Package name validated: ${validated.name}`;
                } catch (error) {
                    throw error instanceof Error ? error : new Error(String(error));
                }
            },
            {
                type: "add",
                path: "packages/{{ name }}/package.json",
                templateFile: "templates/packages/package.json.hbs",
            },
            {
                type: "add",
                path: "packages/{{ name }}/tsconfig.json",
                templateFile: "templates/packages/tsconfig.json.hbs",
            },
            {
                type: 'add',
                path: 'packages/{{ name }}/README.md',
                templateFile: 'templates/packages/README.md.hbs',
            },
            {
                type: 'add',
                path: 'packages/{{ name }}/index.ts',
                templateFile: 'templates/packages/index.ts.hbs',
            },

            // Summary
            () => `✓ Package created: packages/{{ name }}`,
        ]
    })


    // ========================================================================
    // APP GENERATOR
    // either an Next.js, Tanstack Start, Angular, or Vite Application
    // ========================================================================
    plop.setGenerator('app', {
        description: 'Generate a new application (Next.js, Tanstack Start, Angular or Vite)',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Application name (lowercase, hyphens allowed)',
                default: 'my-app'
            },
            {
                type: "list",
                name: "framework",
                message: 'Select framework',
                choices: [
                    { name: 'Next.js (recommended)', value: 'nextjs' },
                    { name: 'Tanstack Start', value: 'tanstack-start' },
                    { name: 'Angular', value: 'angular' },
                    { name: 'Vite', value: 'vite' },
                ]
            }
        ],
        actions: [
            // Validation
            (answers: object) => {
                try {
                const answersRecord = answers as Record<string, unknown>;
                const sanitized = sanitizeName(answersRecord.name as string);
                const validated = validateAnswers(AppSchema, {
                    name: sanitized,
                    framework: answersRecord.framework,
                });
                answersRecord.name = validated.name;
                return `✓ App config validated: ${validated.name} (${validated.framework})`;
                } catch (error) {
                throw error instanceof Error ? error : new Error(String(error));
                }
            },
            // Framework-specific template selection
            {
                type: 'add',
                path: 'apps/{{ name }}/package.json',
                templateFile: (data: AppAnswers) => `templates/apps/${data.framework}/package.json.hbs`,
            },
            {
                type: 'add',
                path: 'apps/{{ name }}/tsconfig.json',
                templateFile: (data) => `templates/apps/${data.framework}/tsconfig.json.hbs`,
            },
            {
                type: 'add',
                path: 'apps/{{ name }}/README.md',
                templateFile: 'templates/apps/README.md.hbs',
            },

            // Next.js specific
            {
                type: 'add',
                path: 'apps/{{ name }}/next.config.ts',
                templateFile: 'templates/apps/nextjs/next.config.ts.hbs',
                skip: (data: AppAnswers) => data.framework !== 'nextjs',
            },
            {
                type: 'add',
                path: 'apps/{{ name }}/tailwind.config.ts',
                templateFile: 'templates/apps/nextjs/tailwind.config.ts.hbs',
                skip: (data) => data.framework !== 'nextjs',
            },
            {
                type: 'add',
                path: 'apps/{{ name }}/src/app/page.tsx',
                templateFile: 'templates/apps/nextjs/page.tsx.hbs',
                skip: (data) => data.framework !== 'nextjs',
            },

            // Tanstack Start specific
            {
                type: 'add',
                path: 'apps/{{ name }}/tsr.config.ts',
                templateFile: 'templates/apps/tanstack-start/tsr.config.ts.hbs',
                skip: (data) => data.framework !== 'tanstack-start',
            },

            // Angular specific
            {
                type: 'add',
                path: 'apps/{{ name }}/angular.json',
                templateFile: 'templates/apps/angular/angular.json.hbs',
                skip: (data) => data.framework !== 'angular',
            },

            // Vite specific
            {
                type: 'add',
                path: 'apps/{{ name }}/vite.config.ts',
                templateFile: 'templates/apps/vite/vite.config.ts.hbs',
                skip: (data) => data.framework !== 'vite',
            },

            () => `✓ App created: apps/{{ name }}`,
        ]
    })

    // ========================================================================
    // SERVICE GENERATOR
    // services are written in the GO language and must be initialized
    // ========================================================================

  plop.setGenerator('service', {
    description: 'Generate a new Go service',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Service name (lowercase, hyphens allowed)',
        default: 'my-service',
      },
      {
        type: 'list',
        name: 'runtime',
        message: 'Service runtime',
        choices: [{ name: 'Go', value: 'go' }],
      },
    ],
    actions: [
      // Validation
      (answers: object) => {
        try {
          const answersRecord = answers as Record<string, unknown>;
          const sanitized = sanitizeName(answersRecord.name as string);
          const validated = validateAnswers(ServiceSchema, {
            name: sanitized,
            runtime: answersRecord.runtime,
          });
          answersRecord.name = validated.name;
          answersRecord.moduleName = `github.com/limitlessmusicgroup/${validated.name}`;
          return `✓ Service config validated: ${validated.name} (${validated.runtime})`;
        } catch (error) {
          throw error instanceof Error ? error : new Error(String(error));
        }
      },

      // Go service files
      {
        type: 'add',
        path: 'services/{{ name }}/go.mod',
        templateFile: 'templates/services/go/go.mod.hbs',
      },
      {
        type: 'add',
        path: 'services/{{ name }}/go.sum',
        templateFile: 'templates/services/go/go.sum.hbs',
      },
      {
        type: 'add',
        path: 'services/{{ name }}/main.go',
        templateFile: 'templates/services/go/main.go.hbs',
      },
      {
        type: 'add',
        path: 'services/{{ name }}/Dockerfile',
        templateFile: 'templates/services/go/Dockerfile.hbs',
      },
      {
        type: 'add',
        path: 'services/{{ name }}/Makefile',
        templateFile: 'templates/services/go/Makefile.hbs',
      },
      {
        type: 'add',
        path: 'services/{{ name }}/.gitignore',
        templateFile: 'templates/services/go/.gitignore.hbs',
      },

      () => `✓ Service created: services/{{ name }}`,
    ],
  });


}