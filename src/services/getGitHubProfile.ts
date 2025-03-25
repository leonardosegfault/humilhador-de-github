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
    throw new Error("O usuário não foi encontrado.");
  } else if (status == 500) {
    throw new Error(
      "O estagiário do GitHub fez merda na API. Aguarde até que se estabilize."
    );
  } else {
    throw new Error(
      `Um erro desconhecido ocorreu (HTTP Status ${status}) — também conhecido como "meu dev foi muito preguiçoso de especificar o motivo com precisão".`
    );
  }
}

export default async function getGitHubProfile(
  username: string
): Promise<{ user: GitHubUser; repos: GitHubRepo[] }> {
  try {
    let res = await fetch(`https://api.github.com/users/${username}`);
    if (res.status != 200) throwError(res.status);
    const user = (await res.json()) as GitHubUser;

    res = await fetch(`https://api.github.com/users/${username}/repos`);
    if (res.status != 200) throwError(res.status);
    const repos = (await res.json()) as GitHubRepo[];

    return {
      user,
      repos,
    };
  } catch (e) {
    console.error(e);

    throw new Error(
      "O GitHub mandou um resultado que não era JSON (isso é raro, viu?)"
    );
  }
}
