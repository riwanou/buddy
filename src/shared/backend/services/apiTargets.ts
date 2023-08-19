import ky from "ky";
import { useEffect, useState } from "react";
import config from "shared/backend/config";

interface Release {
  sha: string;
  exclude_targets?: string[];
}

interface Tag {
  flags: Record<string, string[]>;
}

interface TargetFlag {
  values: string[];
}

interface Target {
  description: string;
  tags: string[];
}

interface Targets {
  releases: Record<string, Release>;
  flags: Record<string, TargetFlag>;
  tags: Record<string, Tag>;
  targets: Record<string, Target>;
}

let firmwareApiTargetCache: Targets | null = null;

export async function fetchApiTargets(): Promise<Targets> {
  if (!firmwareApiTargetCache) {
    try {
      const res = await ky("https://cloudbuild.edgetx.org/api/targets", {
        prefixUrl: config.proxyUrl,
      });
      if (!res.ok) {
        throw new Error("Oops, error while fetching targets");
      }
      firmwareApiTargetCache = await res.json();
    } catch (err) {
      if (err instanceof Error) throw err;
      throw new Error("Oops, could not fetch targets");
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return firmwareApiTargetCache!;
}

export function useApiTargets(): [Targets | undefined, String | undefined] {
  const [apiTargets, setApiTargets] = useState<Targets>();
  const [apiTargetsError, setApiTargetsError] = useState<String>();

  useEffect(() => {
    (async () => {
      try {
        setApiTargets(await fetchApiTargets());
      } catch (error) {
        if (error instanceof Error) setApiTargetsError(error.message);
      }
    })();
  }, []);

  return [apiTargets, apiTargetsError];
}
