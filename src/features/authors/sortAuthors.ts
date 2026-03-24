import type { CollectionSort } from "~/features/authors/createCollectionSorter";

import { createCollectionSorter } from "~/features/authors/createCollectionSorter";

import type { AuthorsValue } from "./Authors";

/**
 * Sort type for collections.
 */
export type AuthorsSort = CollectionSort;

/**
 * Sorter function for collections, supporting name and review count sorting.
 */
export const sortAuthors = createCollectionSorter<AuthorsValue, AuthorsSort>();
