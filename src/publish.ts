import HttpError from "./HttpError";

export interface PublishOptions {
  changelog?: URL;
  compatibility?: {
    minimum?: string;
    verified?: string;
    maximum?: string;
  };
  dryRun?: boolean;
  manifest: URL;
  packageID: string;
  version: string;
  token: `fvttp_${string}`;
}

interface ErrorResponse {
  errors: Record<string, { message: string }>;
}

export default async function publish(options: PublishOptions): Promise<void> {
  if (options.dryRun ?? false) {
    console.log(`Performing a dry run of publishing Foundry VTT package with id '${options.packageID}'.`);
  } else {
    console.log(`Publishing Foundry VTT package with id '${options.packageID}'.`);
  }

  const response = await fetch("https://api.foundryvtt.com/_api/packages/release_version/", {
    headers: {
      "Content-Type": "application/json",
      Authorization: options.token,
    },
    method: "POST",
    body: JSON.stringify({
      id: options.packageID,
      "dry-run": options.dryRun,
      release: {
        version: options.version,
        manifest: options.manifest,
        notes: options.changelog,
        compatibility: options.compatibility,
      },
    }),
  });

  const body = (await response.json()) as ErrorResponse;
  if (!response.ok) {
    throw new HttpError(
      response.status,
      Object.entries(body.errors).flatMap(([, v]: [string, { message: string }]) => v.message),
    );
  }

  if (options.dryRun) {
    console.log("Dry run completed successfully.");
  } else {
    console.log("Package published successfully.");
  }
}
