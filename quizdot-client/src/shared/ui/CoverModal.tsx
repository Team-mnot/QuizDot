interface CoverModalProps {
  isOpen: boolean;
  children?: React.ReactNode;
}

export function CoverModal(props: CoverModalProps) {
  if (!props.isOpen) return null;

  return (
    <div className="fixed left-0 top-0 z-40 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-md border-2 bg-white p-5 shadow-md">
        <div>{props.children}</div>
      </div>
    </div>
  );
}
