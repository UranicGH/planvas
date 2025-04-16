import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Assignment } from 'src/app/domain/assignment';

/**
 * This service handles API requests made to the server.
 * All of these return Observables.  The http requests will
 * not be executed until a subscription is made to that
 * Observable.  This includes Observables that do not return
 * a value (void).  If the method does not seem to be returning
 * a value, check to see if "subscribe" has actually been
 * called.
 */
@Injectable({
  providedIn: 'root'
})
export class AssignmentsService {

  constructor (private http: HttpClient) {}

  /**
   * Get a list of assignments for the specified page of the specified size.
   * @param page the page of assignments to get
   * @param pageSize the size of the page
   * @returns a Observable for the request
   */
  assignments (
    page: number,
    pageSize: number
  ): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(
      'api/assignments',
      {
        params: new HttpParams()
          .set('page', page)
          .set('pageSize', pageSize)
      }
    );
  }

  /**
   * Get a list of unique contacts
   * @returns a Observable for the request
   */
  getContacts (): Observable<string[]> {
    return this.http.get<string[]>('api/assignments/contacts');
  }

  /**
   * Get a list of upcoming assignments for the next 24 hours.
   * @returns a Observable for the request
   */
  getUpcoming (): Observable<Assignment[]> {
    return this.http.get<Assignment[]>('api/assignments/upcoming');
  }

  /**
   * Get the total number of assignments.
   *
   * Note: the request returns the total wrapped in a JSON object,
   * but this method unwraps it in order to only emit the total number.
   * @returns a Observable for the request
   */
  total (): Observable<number> {
    return this.http.get<{ total: number }>('api/assignments/total')
      .pipe(map(results => results.total));
  }

  /**
   * Edit an assignment.
   *
   * @param assignment The assignment with updated details.
   * @returns An Observable of the updated assignment.
   */
  edit (assignment: Assignment): Observable<Assignment> {
    return this.http.put<Assignment>(`api/assignments/${assignment.id}`, assignment);
  }

  /**
   * Delete a list of assignments.
   *
   * Note: even though this request does not return a value, a subscription
   * must still be made to the Observable to execute the request.
   * @param assignments the list of assignments to delete
   * @returns a Observable for the request
   */
  delete (assignments: Assignment[]): Observable<void> {
    return this.http.delete<void>(
      'api/assignments',
      {
        params: new HttpParams({
          // Only a list of ids should be passed to the delete request,
          // so "map" can be used to pull out just those ids into a list.
          // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map.
          fromObject: { ids: assignments.map(assignment => assignment.id) }
        })
      }
    );
  }
  add (assignment: Assignment): Observable<Assignment> {
    return this.http.post<Assignment>(
      'api/assignments',
      assignment
    );
  }

}
