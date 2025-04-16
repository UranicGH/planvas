/**
 * Interface for assignments, including those coming from the server.
 * Property {@link selected} is only used by the client to indicate
 * assignments that have been selected by the user for other tasks,
 * such as deletion.
 */
export interface Assignment {
  id?: number;
  date: number;
  subject: string;
  details?: string;
  selected?: boolean;
  completed?: boolean;
}