interface WorkNode {
  id: string;
}

export function sliceWorksForBrowseMore(
  works: WorkNode[],
  sourceWorkId: string,
) {
  const windowSize = 5;
  const arraySize = works.length;

  if (windowSize > arraySize) {
    return [];
  }

  const workIsNotTitle = (work: WorkNode) => {
    return work.id !== sourceWorkId;
  };

  if (arraySize === windowSize) {
    return works.filter(workIsNotTitle);
  }

  const titleIndex = works.findIndex((work) => work.id === sourceWorkId);

  if (titleIndex + 3 <= arraySize && titleIndex - 2 >= 0) {
    return works.slice(titleIndex - 2, titleIndex + 3).filter(workIsNotTitle);
  }

  return [...works.slice(-2), ...works, ...works.slice(0, 3)]
    .slice(titleIndex, titleIndex + 5)
    .filter(workIsNotTitle);
}
