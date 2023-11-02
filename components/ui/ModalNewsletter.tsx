import type { ImageWidget } from "apps/admin/widgets.ts";

export interface Props {
  image: ImageWidget;
}

export default function ModalNewsletter(props: Props) {
  return (
    <div class="fixed bg-black/[.5] w-full h-full top-0 left-0 z-20 flex items-center justify-center">
      <div class="w-[800px] h-[400px] bg-[#141313] relative">
        <span class="font-[Roboto] font-bold absolute top-3 right-3 text-white">
          X
        </span>
        <div class="w-full h-full">
          <img src={props.image} class="h-full animate-spin" />
        </div>
      </div>
    </div>
  );
}
