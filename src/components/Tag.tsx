export default function Tag(props: { label: string }) {
  return (
    <div className="bg-sky-100 text-cyan-700 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
      {props.label}
    </div>
  );
}