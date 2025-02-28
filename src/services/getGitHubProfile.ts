import redis from "./redis";

export interface GitHubUser {
  login: string;
  name: string;
  bio: string;
  location: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  name: string;
  description: string;
  fork: boolean;
  created_at: string;
  updated_at: string;
  stargazers_count: number;
  language: string;
  forks_count: number;
  archived: boolean;
  open_issues: number;
}

export default async function getGitHubProfile(
  username: string
): Promise<{ user: GitHubUser; repos: GitHubRepo[] }> {
  let userData: GitHubUser | null;
  let userRepos: GitHubRepo[] | null;
  let cacheHit = false;

  if (redis) {
    userData = await redis.get(username);
    userRepos = await redis.get("repos:" + username);

    if (userData || userRepos) {
      cacheHit = true;
    }
  }

  try {
    let res = await fetch(`https://api.github.com/users/${username}`);
    if (res.status != 200) throw new Error(res.statusText);

    userData = (await res.json()) as GitHubUser;

    res = await fetch(`https://api.github.com/users/${username}/repos`);
    if (res.status != 200) throw new Error(res.statusText);

    userRepos = (await res.json()) as GitHubRepo[];
    if (redis && !cacheHit) {
      await redis.set(username, {
        login: userData.login,
        name: userData.name,
        bio: userData.bio,
        location: userData.location,
        public_repos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
        created_at: userData.created_at,
      });

      await redis.set(
        "repos:" + username,
        userRepos.map((v) => ({
          name: v.name,
          description: v.description,
          fork: v.fork,
          created_at: v.created_at,
          updated_at: v.updated_at,
          stargazers_count: v.stargazers_count,
          language: v.language,
          forks_count: v.forks_count,
          archived: v.archived,
          open_issues: v.open_issues,
        }))
      );

      redis.expire(username, 60 * 10);
      redis.expire("repos:" + username, 60 * 10);
    }
  } catch {
    throw new Error("Failed to retrieve user data");
  }

  return {
    user: userData,
    repos: userRepos,
  };
}
