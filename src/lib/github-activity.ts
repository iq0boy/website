import { PROFILE } from './profile';

export interface ActivityItem {
  type: 'commit' | 'release' | 'event';
  repo: string;
  repoUrl: string;
  message: string;
  url: string;
  isoDate: string;
}

// Fetches recent public activity for the configured GitHub user.
// Called at build time only — the result is baked into static HTML and the
// API is not hit on user page loads. If the API is unreachable (no network,
// rate-limited, etc.), returns an empty array so the section silently hides.
//
// To raise the rate limit, set GITHUB_TOKEN in your environment; build will
// authenticate using it.
export async function fetchRecentActivity(limit = 6): Promise<ActivityItem[]> {
  const handle = PROFILE.githubHandle;
  if (!handle) return [];

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'josephpire.dev-build',
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(`https://api.github.com/users/${handle}/events/public?per_page=30`, {
      headers,
    });
    if (!res.ok) {
      // Useful diagnostic during a dev build; in CI the section just won't render.
      // eslint-disable-next-line no-console
      console.warn(`[github-activity] ${res.status} ${res.statusText} — skipping section.`);
      return [];
    }
    const events = (await res.json()) as RawEvent[];
    return events
      .map(eventToActivityItem)
      .filter((item): item is ActivityItem => item !== null)
      .slice(0, limit);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[github-activity] fetch failed —', (err as Error).message);
    return [];
  }
}

interface RawEvent {
  type: string;
  repo: { name: string };
  created_at: string;
  payload?: {
    commits?: { message: string; sha: string }[];
    ref?: string;
    ref_type?: string;
    release?: { name?: string; tag_name?: string; html_url: string };
  };
}

function eventToActivityItem(e: RawEvent): ActivityItem | null {
  const repoUrl = `https://github.com/${e.repo.name}`;
  const base = { repo: e.repo.name, repoUrl, isoDate: e.created_at };

  if (e.type === 'PushEvent') {
    const last = e.payload?.commits?.[e.payload.commits.length - 1];
    if (!last) return null;
    return {
      ...base,
      type: 'commit',
      message: truncate(last.message.split('\n')[0], 80),
      url: `${repoUrl}/commit/${last.sha}`,
    };
  }
  if (e.type === 'ReleaseEvent' && e.payload?.release) {
    return {
      ...base,
      type: 'release',
      message: e.payload.release.name || e.payload.release.tag_name || 'release',
      url: e.payload.release.html_url,
    };
  }
  if (e.type === 'CreateEvent' && e.payload?.ref_type === 'repository') {
    return {
      ...base,
      type: 'event',
      message: `created ${e.repo.name.split('/')[1]}`,
      url: repoUrl,
    };
  }
  return null;
}

function truncate(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}
