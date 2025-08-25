import { Grade } from "./Grade";

export function ListItemGrade({ grade }: { grade: string }) {
  return <Grade className="-mb-0.5 pb-[3px]" height={15} value={grade} />;
}
