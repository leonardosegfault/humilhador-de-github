import truncateString from "@/utils/truncateString";
import { t } from "i18next";

interface GitHubUser {
  avatar_url: string;
  login: string;
  name?: string;
  bio?: string;
  location?: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  description?: string;
  fork: boolean;
  created_at: string;
  updated_at: string;
  stargazers_count: number;
  language: string;
  forks_count: number;
  archived: boolean;
  open_issues: number;
}

function throwError(status: number) {
  if (status == 404) {
    throw new Error(t("errors.notFound"));
  } else if (status == 500) {
    throw new Error(t("errors.github"));
  } else {
    throw new Error(t("errors.unknown"));
  }
}

export default async function getGitHubProfile(
  username: string
): Promise<{ user: GitHubUser; repos: GitHubRepo[] }> {
  let res = await fetch(`https://api.github.com/users/${username}`);
  if (res.status != 200) throwError(res.status);
  const user = (await res.json()) as GitHubUser;

  if (user.location) {
    user.location = truncateString(user.location, 48);
  }

  res = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100`
  );
  if (res.status != 200) throwError(res.status);
  const repos = (await res.json()) as GitHubRepo[];

  for (const repo of repos) {
    if (repo.description) {
      repo.description = truncateString(repo.description, 350);
    }
  }

  return {
    user,
    repos,
  };
}
