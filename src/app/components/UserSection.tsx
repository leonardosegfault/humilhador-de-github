"use client";

import { useState, FormEvent } from "react";
import Markdown from "react-markdown";
import getGitHubProfile from "@/services/getGitHubProfile";
import shuffleArray from "@/utils/shuffleArray";
import UserInput from "./UserInput";
import DonationMessage from "./DonationMessage";
import ErrorMessage from "./ErrorMessage";

type APIBody = GitHubUser & { repos: GitHubRepo[] };

interface GitHubUser {
  username: string;
  name?: string;
  bio?: string;
  createdAt: string;
  location?: string;
  publicRepos: number;
  followers: number;
  following: number;
}

interface GitHubRepo {
  name: string;
  description?: string;
  isFork: boolean;
  createdAt: string;
  updatedAt: string;
  stars: number;
  language?: string;
  forksCount: number;
  isArchived: boolean;
  openIssues: number;
}

export default function UserSection() {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [text, setText] = useState("");
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [isDonateHidden, setDonateHidden] = useState(true);

  async function handleSubmit(e: FormEvent) {
    const data = new FormData(e.target as HTMLFormElement);
    const username = data.get("username");
    let tempText = "";
    let length = 0;

    e.preventDefault();

    if (!username) {
      setError("Você não inseriu um usuário para ser analisado!");
      return;
    }

    setText("");
    setError("");
    setLoading(true);
    setDonateHidden(true);

    try {
      const { user, repos } = await getGitHubProfile(username as string);

      setAvatar(user.avatar_url);
      setName(user.name ?? user.login);

      shuffleArray(repos);
      const analysisRepos = repos.slice(0, 5);

      // Incluir pelo menos um repositório popular
      const mostPopularRepo = repos.sort(
        (a, b) => b.stargazers_count - a.stargazers_count
      )[0];
      if (analysisRepos.findIndex((v) => v.id == mostPopularRepo.id) == -1) {
        analysisRepos[0] = mostPopularRepo;
      }

      const body: APIBody = {
        username: user.login,
        createdAt: user.created_at,
        publicRepos: user.public_repos,
        followers: user.followers,
        following: user.following,
        repos: analysisRepos.map((v) => ({
          name: v.name,
          description: v.description ?? undefined,
          isFork: v.fork,
          createdAt: v.created_at,
          updatedAt: v.updated_at,
          stars: v.stargazers_count,
          language: v.language ?? undefined,
          forksCount: v.forks_count,
          isArchived: v.archived,
          openIssues: v.open_issues,
        })),
      };

      if (user.name) body.name = user.name;
      if (user.bio) body.bio = user.bio;
      if (user.location) body.location = user.location;

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (res.status != 200) {
        let errMessage = res.statusText || "HTTP Status " + res.status;

        if (res.status == 504) {
          errMessage =
            "A API demorou demais para te humilhar. Tente novamente.";
        } else {
          try {
            const apiData = await res.json();
            if (apiData.error) errMessage = apiData.error;
          } catch {}
        }

        throw new Error(errMessage);
      }

      const apiData = await res.json();
      tempText = apiData.content;
      length = tempText.length;
    } catch (e) {
      setText("");
      setError((e as Error).message);
      setLoading(false);
      setDonateHidden(true);

      console.error(e);

      return;
    }

    const int = setInterval(() => {
      if (length < 0) {
        clearInterval(int);
        setLoading(false);
        setDonateHidden(false);
        return;
      }

      setText(tempText.slice(0, tempText.length - length--));
    }, 30);
  }

  return (
    <section>
      <form className="w-fit mx-auto" onSubmit={handleSubmit}>
        <UserInput isLoading={isLoading} />
      </form>

      {text && (
        <div className="mt-10 p-4 w-sm md:w-lg break-words rounded-lg bg-linear-to-br from-lime-100 to-green-200">
          <div className="*:mx-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatar}
              alt="avatar"
              className="size-32 rounded-full bg-gray-50 select-none"
            />

            <h2 className="text-center text-xl font-bold">{name}</h2>
          </div>

          <div className="[&_p]:mt-2 [&_ol]:list-decimal [&_ul]:list-disc [&_li]:ml-4 list-inside">
            {<Markdown>{text}</Markdown>}
          </div>
        </div>
      )}

      {error && <ErrorMessage error={error} />}
      {!isDonateHidden && <DonationMessage />}
    </section>
  );
}
