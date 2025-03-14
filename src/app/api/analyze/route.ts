import getGitHubProfile, {
  GitHubUser,
  GitHubRepo,
} from "@/services/getGitHubProfile";
import shuffleArray from "@/utils/shuffleArray";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const username = url.searchParams.get("u");
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

    const content = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1024,
    });

    return Response.json({
      content: content.choices[0].message.content,
    });
  } catch (e) {
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
