export type HomeOpenGraphImageComponentType = (
  props: HomeOpenGraphImageProps,
) => React.JSX.Element;

type HomeOpenGraphImageProps = {
  backdrop: string;
};

export function OpenGraphImage({
  backdrop,
}: HomeOpenGraphImageProps): React.JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        height: "630px",
        width: "1200px",
      }}
    >
    </div>
  );
}
