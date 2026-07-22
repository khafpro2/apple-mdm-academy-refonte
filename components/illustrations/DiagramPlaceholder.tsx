import { MediaPlaceholder } from "@/components/video/placeholders/MediaPlaceholder";

type DiagramPlaceholderProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function DiagramPlaceholder({
  title,
  description,
  className = "",
}: DiagramPlaceholderProps) {
  return (
    <MediaPlaceholder
      variant="architecture"
      title={title}
      description={description}
      className={className}
    />
  );
}
