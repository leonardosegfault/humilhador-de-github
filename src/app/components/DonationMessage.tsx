export default function DonationMessage() {
  return (
    <div className="mt-10 p-4 w-sm md:w-lg break-words rounded-lg bg-blue-100 border border-blue-300">
      <h3 className="font-bold">Gostou? Então apoie!</h3>
      <p>
        O <b className="text-semibold">Humilhador de GitHub</b> é um projeto
        gratuito e de código aberto, mas que exige investimentos — A IA não é
        totalmente de graça... ainda.
      </p>
      <p className="mt-2">
        Ajude o projeto com qualquer valor no Pix e permita que outras pessoas
        também tenham a oportunidade de serem humilhadas.
      </p>

      <div className="w-full mt-2 text-right">
        <a
          href="https://livepix.gg/leosegfault"
          className="p-1 px-4 bg-blue-500 text-base rounded-lg text-white"
        >
          Apoiar
        </a>
      </div>
    </div>
  );
}
