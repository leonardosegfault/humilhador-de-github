import { z } from "zod";
import OpenAI, { type APIError } from "openai";
import redis from "@/services/redis";

const repoSchema = z.object({
  name: z.string(),
  description: z.string().max(350).optional(),
  isFork: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  stars: z.number().nonnegative().int(),
  language: z.string().max(48).regex(/\w+/).optional(),
  forksCount: z.number().nonnegative().int(),
  isArchived: z.boolean(),
  openIssues: z.number().nonnegative().int(),
});

const schema = z.object({
  username: z
    .string()
    .min(2)
    .max(39)
    .regex(/^(?!-)[A-Za-z0-9-]+(?!-)$/),
  name: z.string().max(48).optional(),
  bio: z.string().max(160).optional(),
  createdAt: z.string().datetime(),
  location: z.string().max(48).optional(),
  publicRepos: z.number().nonnegative().int(),
  followers: z.number().nonnegative().int(),
  following: z.number().nonnegative().int(),
  repos: z.array(repoSchema).max(5),
  language: z.string().length(2),
});

const client = new OpenAI({
  baseURL: process.env.BASE_URL,
  apiKey: process.env.API_KEY,
});

export async function POST(req: Request) {
  const { success, data, error } = schema.safeParse(await req.json());
  if (!success) {
    console.error(error);

    return Response.json(
      {
        error:
          "Requisição inválida. Caso acredite que isso é um erro, avise na aba Issue do repositório no GitHub.",
      },
      {
        status: 400,
      }
    );
  }

  const cachedAnalysis = await redis?.get(
    "analysis:" + data.username.toLowerCase()
  );
  if (cachedAnalysis) {
    return Response.json({
      content: cachedAnalysis,
    });
  }

  try {
    let prompt = `Assumindo que hoje é ${new Date().toLocaleString()}, seja extremamente breve, sarcástico e ácido sobre perfil no GitHub a seguir`;
    if (data.language == "en") {
      prompt += " e responda em Inglês:\n";
    } else {
      prompt += ":\n";
    }

    prompt += `- O @ é "${data.username}"\n`;
    prompt += `- Sua conta foi criada em ${data.createdAt}\n`;
    prompt += `- ${data.publicRepos} repositórios\n`;
    prompt += `- ${data.followers} seguidores\n`;
    prompt += `- Seguindo ${data.following}\n`;

    if (data.name) prompt += `- Seu nome é "${data.name}"\n`;
    if (data.location) prompt += `- Localizado em "${data.location}"\n`;
    if (data.bio) prompt += `- Bio é "${data.bio}"\n`;

    if (data.repos.length > 0) {
      prompt += `\nSeus repositórios são:\n`;

      for (const repo of data.repos.slice(0, 5)) {
        prompt += `\n- ${repo.name}: ${repo.description ?? "sem descrição"}\n`;
        if (repo.createdAt == repo.updatedAt) {
          prompt += `- Criado em ${repo.createdAt};\n`;
        } else {
          prompt += `- Criado em ${repo.createdAt} e última vez atualizado em ${repo.updatedAt};\n`;
        }
        prompt += `- ${repo.stars} estrelas;\n`;

        if (repo.isFork) prompt += "- é um fork;\n";
        if (repo.isArchived) prompt += "- arquivado;\n";
        if (repo.language) prompt += `- Feito em ${repo.language};\n`;
        if (repo.forksCount) prompt += `- ${repo.forksCount} forks;\n`;
        if (repo.openIssues > 0) prompt += `- ${repo.openIssues} issues;\n`;
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
      max_tokens: 512,
    });
    const content = completion.choices[0].message.content;

    if (redis) {
      redis.set("analysis:" + data.username.toLowerCase(), content);
      redis.expire("analysis:" + data.username.toLowerCase(), 60 * 10);
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
