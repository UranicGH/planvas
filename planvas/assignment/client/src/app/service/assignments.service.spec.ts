import { HttpClient, HttpParams } from '@angular/common/http';
import { fakeAsync, tick } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { Assignment } from 'src/app/domain/assignment';

import { AssignmentsService } from './assignments.service';

describe('AssignmentsService', () => {
  let service: AssignmentsService,
    mockRequest$: Subject<unknown>,
    httpClientMock: HttpClient;

  beforeEach(() => {
    mockRequest$ = new Subject();

    httpClientMock = jasmine.createSpyObj('HttpClient', {
      get: mockRequest$.asObservable(),
      delete: mockRequest$.asObservable()
    });

    service = new AssignmentsService(httpClientMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('assignments', () => {

    it('should make a GET request to get a list of assignments', fakeAsync((done: () => void) => {
      const page = 1,
        pageNumber = 10,
        expectedAssignments: Assignment[] = [
          { id: 1, subject: 'cs 370', date: 1234 }
        ];

      const actual$ = service.assignments(page, pageNumber);

      expect(actual$).toBeDefined();
      expect(httpClientMock.get).toHaveBeenCalledWith(
        'api/assignments',
        {
          params: new HttpParams()
            .set('page', page)
            .set('pageSize', pageNumber)
        }
      );

      // test observable

      mockRequest$.next(expectedAssignments);
      tick();

      actual$.subscribe(assignments => {
        expect(assignments).toEqual(expectedAssignments);
        done();
      });
    }));

  });

  describe('getUpcoming', () => {

    it('should make a GET request to get a list of upcoming assignments', fakeAsync((done: () => void) => {
      const expectedAssignments: Assignment[] = [
        { id: 1, subject: 'cs 370', date: 1234 }
      ];

      const actual$ = service.getUpcoming();

      expect(actual$).toBeDefined();
      expect(httpClientMock.get).toHaveBeenCalledWith('api/assignments/upcoming');

      // test observable

      mockRequest$.next(expectedAssignments);
      tick();

      actual$.subscribe(assignments => {
        expect(assignments).toEqual(expectedAssignments);
        done();
      });
    }));

  });

  describe('getContacts', () => {

    it('should make a GET request to get a list of contacts', fakeAsync((done: () => void) => {
      const expectedContacts: string[] = [
        'cs 370',
        'Steve'
      ];

      const actualContact$ = service.getContacts();

      expect(actualContact$).toBeDefined();
      expect(httpClientMock.get).toHaveBeenCalledWith(
        'api/assignments/contacts');

      // test observable
      mockRequest$.next(expectedContacts);
      tick();

      actualContact$.subscribe(contacts => {
        expect(contacts).toEqual(expectedContacts);
        done();
      });
    }));

  });

  describe('total', () => {

    it('should make a GET request to get a total number of assignments', fakeAsync((done: () => void) => {
      const expectedTotal = 36,
        returnTotal = {
          total: expectedTotal
        };

      const actual$ = service.total();

      expect(actual$).toBeDefined();
      expect(httpClientMock.get).toHaveBeenCalledWith('api/assignments/total');

      // test observable

      mockRequest$.next(returnTotal);
      tick();

      actual$.subscribe(total => {
        // The total should be unwrapped by the map pipe operator.
        expect(total).toEqual(expectedTotal);
        done();
      });
    }));

  });

  describe('delete', () => {

    it('should make a DELETE request to delete specified assignments by ID', fakeAsync((done: () => void) => {
      // eslint-disable-next-line no-magic-numbers
      const assignments = [
          { id: 10, subject: 'cs 370', date: 1234 },
          { id: 11, subject: 'Sally', date: 2345 }
        ],
        expectedIds = assignments.map(assignment => assignment.id);

      const actual$ = service.delete(assignments);

      expect(actual$).toBeDefined();
      expect(httpClientMock.delete).toHaveBeenCalledWith(
        'api/assignments',
        {
          params: new HttpParams({
            fromObject: { ids: expectedIds }
          })
        }
      );

      // test observable

      mockRequest$.next(undefined); // doesn't actually provide a value
      tick();

      actual$.subscribe(total => {
        expect(total).toBeUndefined();
        done();
      });
    }));

  });
});
