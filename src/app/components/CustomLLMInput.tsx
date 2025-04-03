"use client";
import { ChangeEventHandler, useState } from "react";

export function CustomLLMInput({ isLoading }: { isLoading: boolean }) {
  const [url, setUrl] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [opened, setOpened] = useState<boolean>(false);

  return (
    <div className="my-4">
      <button
        className="text-sm text-center w-full block hover"
        onClick={(e) => {
          e.preventDefault();
          setOpened(!opened);
        }}
      >
        Quer ser humilhado pelo sua IA?{" "}
        <span className="text-2xl">{opened ? "▴" : "▾"}</span>
      </button>

      {opened && (
        <>
          <Input
            label="URL"
            name="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
            }}
            disabled={isLoading}
            placeholder="http://localhost:11434/v1"
          />

          <Input
            label="Modelo"
            name="model"
            value={model}
            onChange={(e) => {
              setModel(e.target.value);
            }}
            disabled={isLoading}
            placeholder="llama3.2:3b"
          />

          <Input
            label="API Key"
            name="apiKey"
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
            }}
            disabled={isLoading}
            placeholder="ollama"
          />
        </>
      )}
    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  disabled,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  disabled: boolean;
  placeholder: string;
}) {
  return (
    <div className="my-2">
      <label className="text-center text-zinc-700 select-none" htmlFor={name}>
        {label}
      </label>
      <div className="w-2xs px-2 pr-0 flex gap-2 items-center rounded-lg border border-gray-300 text-xl bg-white">
        <input
          type="text"
          name={name}
          id={name}
          value={value}
          minLength={2}
          maxLength={39}
          onChange={onChange}
          className="w-full h-full py-1 rounded-lg bg-white outline-none"
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
