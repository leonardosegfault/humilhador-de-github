import UserSection from "./components/UserSection";

export default function Home() {
  return (
    <main className="mt-20 text-zinc-800">
      <div>
        <h1 className="text-center text-6xl font-bold select-none">
          Humilhador de GitHub
        </h1>
        <p className="mt-2 text-2xl text-center text-zinc-700">
          Seus projetos nem são tão bons assim...
        </p>
      </div>

      <div className="w-fit mt-20 mx-auto">
        <UserSection />
      </div>
    </main>
  );
}
