import { z } from "zod";
import { NextResponse } from "next/server";
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
      },
    );
  }

  const cachedAnalysis = await redis?.get(
    "analysis:" + data.username.toLowerCase(),
  );
  if (cachedAnalysis) {
    return new NextResponse(cachedAnalysis as string);
  }

  try {
    let prompt = `Você é uma IA do Humilhador de GitHub e sua função é fazer uma análise extremamente breve e zoar o perfil dos usuários.`;
    if (data.language && data.language != "pt") {
      const languages = {
        en: "Inglês",
        es: "Espanhol",
      };

      prompt += ` Escreva o texto em ${languages[data.language as "en" | "es"] ?? languages["en"]}.\n`;
    }

    prompt += `\nAssuma que a data de hoje é ${new Date().toLocaleString(
      "pt-BR",
    )}`;

    let profilePrompt = `Analise o perfil abaixo:\n`;
    profilePrompt += `- O @ é "${data.username}"\n`;
    profilePrompt += `- Sua conta foi criada em ${data.createdAt}\n`;
    profilePrompt += `- ${data.publicRepos} repositórios\n`;
    profilePrompt += `- ${data.followers} seguidores\n`;
    profilePrompt += `- Seguindo ${data.following}\n`;

    if (data.name) profilePrompt += `- Seu nome é "${data.name}"\n`;
    if (data.location) profilePrompt += `- Localizado em "${data.location}"\n`;
    if (data.bio) profilePrompt += `- Bio é "${data.bio}"\n`;

    if (data.repos.length > 0) {
      profilePrompt += `\nSeus repositórios são:\n`;

      for (const repo of data.repos.slice(0, 5)) {
        profilePrompt += `\n- ${repo.name}: ${
          repo.description ?? "sem descrição"
        }\n`;
        if (repo.createdAt == repo.updatedAt) {
          profilePrompt += `- Criado em ${repo.createdAt};\n`;
        } else {
          profilePrompt += `- Criado em ${repo.createdAt} e última vez atualizado em ${repo.updatedAt};\n`;
        }
        profilePrompt += `- ${repo.stars} estrelas;\n`;

        if (repo.isFork) profilePrompt += "- é um fork;\n";
        if (repo.isArchived) profilePrompt += "- arquivado;\n";
        if (repo.language) profilePrompt += `- feito em ${repo.language};\n`;
        if (repo.forksCount) profilePrompt += `- ${repo.forksCount} forks;\n`;
        if (repo.openIssues > 0)
          profilePrompt += `- ${repo.openIssues} issues;\n`;
      }
    }

    const completion = await client.chat.completions.create({
      model: process.env.MODEL as string,
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: profilePrompt,
        },
      ],
      max_tokens: 1280,
      stream: true,
    });

    let content = "";
    const stream = new ReadableStream({
      async pull(controller) {
        for await (const event of completion) {
          const choice = event.choices[0];
          const text = choice.delta.content;
          content += text;
          controller.enqueue(text);
        }

        if (redis) {
          redis.set("analysis:" + data.username.toLowerCase(), content);
          redis.expire("analysis:" + data.username.toLowerCase(), 60 * 10);
        }

        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (e) {
    if ((e as APIError).status == 429) {
      return Response.json(
        {
          error: "O servidor encontra-se sobrecarregado :(",
        },
        {
          status: 500,
        },
      );
    }

    console.error(e);

    return Response.json(
      {
        error: "Erro interno.",
      },
      {
        status: 500,
      },
    );
  }
}
