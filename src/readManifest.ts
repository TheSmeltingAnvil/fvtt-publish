import z from "zod";

const VersionSchema = z.string().or(z.number().transform((v) => v.toString()));

const CompatibilitySchema = z.object({
  minimum: VersionSchema.optional(),
  verified: VersionSchema.optional(),
  maximum: VersionSchema.optional(),
});

const ManifestSchema = z.object({
  id: z.string(),
  version: VersionSchema,
  changelog: z.string().url().optional(),
  compatibility: CompatibilitySchema.optional(),
});

export type Manifest = z.infer<typeof ManifestSchema>;

export default async function readManifest(manifestURL: string): Promise<Manifest> {
  const response = await fetch(manifestURL);
  if (!response.ok) {
    throw new Error(`Failed to fetch manifest (${manifestURL}): ${response.statusText}`);
  }
  const body = await response.json();
  const manifest = await ManifestSchema.parseAsync(body);
  return manifest;
}
