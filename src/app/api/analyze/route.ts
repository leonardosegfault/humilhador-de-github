import getGitHubProfile, {
  GitHubUser,
  GitHubRepo,
} from "@/services/getGitHubProfile";
import redis from "@/services/redis";
import shuffleArray from "@/utils/shuffleArray";
import OpenAI, { type APIError } from "openai";

const client = new OpenAI({
  baseURL: process.env.BASE_URL,
  apiKey: process.env.API_KEY,
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const username = url.searchParams.get("u")?.toLowerCase();
  if (
    !username ||
    !(username.length >= 2 && username.length <= 39) ||
    !/^(?!-)[A-Za-z0-9-]+(?!-)$/.test(username)
  ) {
    return Response.json(
      {
        error: "Usuário inválido ou desconhecido.",
      },
      {
        status: 400,
      }
    );
  }

  const cachedAnalysis = await redis?.get("analysis:" + username);
  if (cachedAnalysis) {
    return Response.json({
      content: cachedAnalysis,
    });
  }

  let userData: GitHubUser;
  let userRepos: GitHubRepo[];
  try {
    const data = await getGitHubProfile(username);
    userData = data.user;
    userRepos = data.repos;
  } catch {
    return Response.json(
      {
        error: "Usuário inválido ou desconhecido.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    let prompt =
      "Seja extremamente breve, sarcástico e ácido sobre perfil no GitHub a seguir:\n";

    prompt += `- O usuário é "${userData.login}"\n`;
    prompt += `- Sua conta foi criada em ${userData.created_at}\n`;
    prompt += `- ${userData.public_repos} repositórios\n`;
    prompt += `- ${userData.followers} seguidores\n`;
    prompt += `- Seguindo ${userData.following} devs\n`;

    if (userData.name) prompt += `- Seu nome é "${userData.name}"\n`;
    if (userData.location) prompt += `- ${userData.location}\n`;
    if (userData.bio) prompt += `- Bio é "${userData.bio}"\n`;

    if (userRepos.length > 0) {
      prompt += `\n\nSeus repositórios são:\n`;

      shuffleArray(userRepos);

      for (const repo of userRepos.slice(10)) {
        prompt += `- ${repo.name}: ${repo.description}\n`;
        prompt += `- Criado em ${repo.created_at} e última vez atualizado em ${repo.updated_at};\n`;
        prompt += `- ${repo.stargazers_count} estrelas;\n`;

        if (repo.fork) prompt += "- é um fork;\n";
        if (repo.archived) prompt += "- arquivado;\n";
        if (repo.language) prompt += `- Feito em ${repo.language};\n`;
        if (repo.forks_count) prompt += `- ${repo.forks_count} forks;\n`;
        if (repo.open_issues > 0) prompt += `- ${repo.open_issues} issues;\n`;

        prompt += "\n";
      }
    }

    const completion = await client.chat.completions.create({
      model: process.env.MODEL as string,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1024,
    });
    const content = completion.choices[0].message.content;

    if (redis) {
      redis.set("analysis:" + username, content);
      redis.expire("analysis:" + username, 60 * 10);
    }

    return Response.json({
      content,
    });
  } catch (e) {
    if ((e as APIError).status == 429) {
      return Response.json(
        {
          error: "O servidor encontra-se sobrecarregado :(",
        },
        {
          status: 500,
        }
      );
    }

    console.error(e);

    return Response.json(
      {
        error: "Erro interno.",
      },
      {
        status: 500,
      }
    );
  }
}
