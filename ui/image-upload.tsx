import { onMount } from 'solid-js';
import type { TextNode } from '~/lib/nodes/state/Node';
import { expectNode, type UiArg } from '~/lib/ui/nodeHandle';

/**
 * `pie.ui.image_upload(img, src='/a.jpg')`: an "Upload an image" button. The chosen file is written into Text `img`
 * as a data URL, e.g. `data:image/jpeg;base64,...`.
 * `src`: an image loaded the same way when the UI first shows, if `img` is empty.
 */
export function ImageUpload(props: { args: UiArg[]; src?: string }) {
  const [img, setImg] = expectNode<TextNode>(props.args[0], ['Text']);

  const read = (blob: Blob) => {
    const reader = new FileReader();
    reader.onload = () => setImg({ value: reader.result as string });
    reader.readAsDataURL(blob);
  };

  onMount(() => {
    if (!img().value && props.src) fetch(props.src).then((r) => r.blob()).then(read);
  });

  const choose = (input: HTMLInputElement) => {
    const file = input.files?.[0];
    if (file) read(file);
    input.value = '';   // choosing the same file again still loads it
  };

  return (
    <label class="pie-image-upload">
      <input type="file" accept="image/*" onChange={(e) => choose(e.currentTarget)} />
      Upload an image
    </label>
  );
}
