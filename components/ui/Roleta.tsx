import { useUI } from "$store/sdk/useUI.ts";
import { ImageWidget } from "apps/admin/widgets.ts";

export interface Props {
  logo: ImageWidget;
}

function Roleta(props: Props) {
  const { displayNewsletterModal } = useUI();
  return (
    <div
      class="fixed right-[20px] bottom-[20px] rounded-full w-[4rem] h-[4rem] bg-stone-950 cursor-pointer"
      onClick={() => displayNewsletterModal.value = true}
    >
      <img src={props.logo} class="w-full animate-spin" height={64} width={64} />
    </div>
  );
}

export default Roleta;
