import { useSignal } from "@preact/signals";
import { useUI } from "$store/sdk/useUI.ts";
export interface Coupon {
  /** @description Nome que aparecerá na opção da roleta  */
  label: string;
  /** @description Cupom que será liberado ao cliente caso ele consiga essa opção (deixar em branco caso não seja uma opção vitoriosa)  */
  cupom?: string;
  /** @format color */
  /** @default #ffffff */
  background?: string;
  /** @description Selecione essa opção para caso seja uma opção de vitória  */
  /** @default true  */
  winner: boolean;
}

export interface Props {
  coupons: Coupon[];
}
export default function ModalNewsletter({ coupons }: Props) {
  const { displayNewsletterModal } = useUI();
  const alreadyRolled = useSignal(false);
  const copied = useSignal(false);
  const sorteado = useSignal(0);
  const rotation = useSignal(0);
  const itemsStyles = (item: Coupon, count: number, index: number) => {
    const width = 400;
    const raio = width * 0.5;
    const delta = 360 / count;
    const { background = "#fff" } = item;
    const borderTopWidth = width + width * 0.0025;
    const deltaInRadians = delta * Math.PI / 180;
    const borderRightWidth = width / (1 / Math.tan(deltaInRadians));
    const r = delta * (count - index);
    const textHeight = Math.floor(((2 * Math.PI * raio) / count) * .5);
    return {
      item: {
        borderTopWidth: borderTopWidth - 1,
        borderRightWidth: borderRightWidth,
        transform: `scale(2) rotate(${r}deg)`,
        borderTopColor: background,
      },
      label: {
        transform: `translateY(${width * -0.24}px) translateX(${
          textHeight * 1.03
        }px) rotateZ(${90 + delta * 0.5}deg)`,
        height: `${textHeight}px`,
        lineHeight: `${textHeight}px`,
        textIndent: `${raio * 0.11}px`,
      },
    };
  };
  const handleRoleta = (count: number) => {
    if (!document) return;
    const spinner = document.getElementById("spinner");
    if (!spinner) return;
    rotation.value = 0;
    spinner.classList.add("animate-spin");
    setTimeout(function () {
      spinner.classList.remove("animate-spin");
      rotation.value = Math.floor(Math.random() * 360);
      sorteado.value = Math.ceil(count * rotation.value / 360) === count
        ? 0
        : Math.ceil(count * rotation.value / 360);
      alreadyRolled.value = true;
    }, 3000);
  };
  const copyToClipBoard = async (e: Event, text:string) => {
    e.preventDefault();
    await navigator.clipboard.writeText(text);
    copied.value = true;
  }
  return (
    <>
      {displayNewsletterModal.value && (
        <div class="fixed bg-black/[.5] w-full h-full top-0 left-0 z-20 flex items-center justify-center">
          <div class="hidden animate-spin"></div>
          <div class="w-[1000px] h-[600px] bg-[#141313] rounded-lg relative">
            <span
              class="font-[Roboto] font-bold absolute top-3 right-3 text-white cursor-pointer"
              onClick={() => displayNewsletterModal.value = false}
            >
              X
            </span>
            <div class="w-full h-full flex items-center justify-center">
              <div
                id="roulette"
                class="block absolute w-[400px] h-[400px] top-1/2 left-1/2 -mt-[200px]"
              >
                <div
                  id="spinner"
                  class="block absolute top-0 left-0 right-0 bottom-0 border-4 border-solid border-white rounded-full overflow-hidden bg-white transition-all duration-1000"
                  style={{ transform: `rotate(${rotation.value}deg)` }}
                >
                  {coupons.map((c, index) => (
                    <div
                      class={`absolute -top-[200px] left-[200px] origin-[0%_400px] w-0 h-0 border-transparent`}
                      style={itemsStyles(c, coupons.length, index).item}
                    >
                      <span
                        class="block absolute text-white font-sans top-[8px] left-[1px] origin-[0_0] text-[0.6em]"
                        style={itemsStyles(c, coupons.length, index).label}
                      >
                        <span class="inline-block align-middle leading-none indent-0">
                          {c.label}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  class={`w-[100px] h-[100px] top-1/2 left-1/2 -ml-[50px] -mt-[50px] font-extrabold z-10 absolute bg-white rounded-full text-[#999] outline-none cursor-pointer shadow border text-center transition-all hover:text-black ${
                    alreadyRolled.value ? "pointer-events-none" : ""
                  }`}
                  onClick={() => handleRoleta(coupons.length)}
                >
                  <div class="absolute w-[15px] h-[15px] border -top-[157px] left-[calc(50%-7.5px)] rotate-45 border-r-0 border-b-0 bg-white">
                  </div>
                  <span class="text-[1.6em] tracking-[-0.05em] flex h-full justify-center items-center">
                    GIRAR
                  </span>
                </div>
              </div>

              <div class="w-full flex flex-col px-10">
                <form class="flex flex-col gap-5 items-center w-full max-w-[340px]">
                  <h2 class="font-mono  text-white text-[37px] font-bold uppercase tracking-wide mb-5">
                    Quer Desconto?
                  </h2>
                  <span class="text-white font-[Roboto] text-[19px] mb-2">
                    Coloque seu email e ganhe mais um cupom de desconto!
                  </span>

                  {alreadyRolled.value && (
                    <div class="text-white pb-2 flex flex-col items-center justify-center">
                      {coupons[sorteado.value].winner 
                      ? (
                          <>
                            <span>Cupom sorteado: <span class="border border-dashed border-white uppercase p-1">{coupons[sorteado.value].cupom}</span></span>
                            <button class="btn btn-outline border-white text-white mt-2 disabled:text-white" disabled={copied.value} onClick={(e) => copyToClipBoard(e, coupons[sorteado.value].cupom!)}>{copied.value ? "Copiado!" : "Copiar"}</button>
                          </>
                        )
                          : <>Poxa! Não foi dessa vez que você conseguiu... Volte mais tarde e tente novamente!</> 
                        }
                    </div>
                  )}

                  <div class="flex flex-col gap-3 w-full">
                    <label for="" class="text-white font-[Roboto] text-base">
                      Nome
                    </label>
                    <input
                      class="bg-white border-gray-400 rounded-md p-3"
                      type="text"
                      placeholder="Nome"
                    />
                  </div>
                  <div class="flex flex-col gap-3 w-full">
                    <label for="" class="text-white font-[Roboto] text-base">
                      E-mail
                    </label>
                    <input
                      class="w-full bg-white border-gray-400 rounded-md p-3"
                      type="email"
                      placeholder="E-mail"
                    />
                  </div>
                  <div class="flex flex-col gap-3 w-full">
                    <button class="w-full bg-orange-600 border-none rounded-md hover:bg-orange-700 hover:transition hover:duration-[.3s] py-3 px-5 text-white">
                      Enviar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
