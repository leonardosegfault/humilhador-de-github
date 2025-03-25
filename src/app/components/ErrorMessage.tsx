export default function ErrorMessage({ error }: { error: string }) {
  return (
    <div className="mt-10 p-4 w-sm md:w-lg break-words rounded-lg bg-red-100 border border-red-500 text-red-500">
      <h3 className="font-bold">Falha ao realizar uma análise</h3>
      <p className="my-2">{error}</p>
      <p className="my-2">Tente novamente mais tarde.</p>
    </div>
  );
}
