import { useUI } from "$store/sdk/useUI.ts";

function Roleta() {
  const { displayNewsletterModal } = useUI();
  return (
    <div class="fixed right-[20px] bottom-[20px] rounded-full w-[4rem] h-[4rem] bg-stone-950 cursor-pointer" onClick={() => displayNewsletterModal.value = true}>
    </div>
  );
}

export default Roleta;
