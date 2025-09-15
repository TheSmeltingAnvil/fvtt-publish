import core, { getBooleanInput, getInput, setFailed, setOutput } from "@actions/core";
import publish, { PublishOptions } from "./publish";
import readManifest from "./readManifest";

export default async function run() {
  try {
    const dryRun = getBooleanInput("dry-run") ?? false;
    const token = checkToken(getInput("token"));
    const manifestURL = checkManifest(getInput("manifest"));
    const manifest = await readManifest(manifestURL);

    const options: PublishOptions = {
      manifest: new URL(manifestURL),
      packageID: manifest.id,
      version: manifest.version,
      token,
      changelog: manifest.changelog ? new URL(manifest.changelog) : undefined,
      dryRun,
      compatibility: manifest.compatibility,
    };
    await publish(options);

    setOutput("success", true);
  } catch (error: Error | unknown) {
    setOutput("success", false);
    if (error instanceof Error) {
      setFailed(error.message);
    }
  }
}

function checkToken(token: string): `fvttp_${string}` {
  core.debug(`Token: ${token}`);
  if (!token) {
    throw new Error("The 'token' input is required.");
  }
  if (!token.startsWith("fvttp_")) {
    throw new Error("The 'token' input must start with 'fvttp_'.");
  }
  if (token.length !== 30) {
    throw new Error("The 'token' input must be 30 characters long.");
  }
  return token as `fvttp_${string}`;
}

function checkManifest(manifestURL: string): string {
  if (!manifestURL) {
    throw new Error("A valid package manifest URL is required.");
  }
  return manifestURL;
}
