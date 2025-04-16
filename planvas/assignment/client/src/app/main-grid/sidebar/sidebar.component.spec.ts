import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MockModule, MockProvider } from 'ng-mocks';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';
import { Assignment } from 'src/app/domain/assignment';
import { PageSizeOption } from 'src/app/global/constants';
import { AssignmentsService } from 'src/app/service/assignments.service';
import { ConfigService } from 'src/app/service/config.service';

import { AddNewAssignmentComponent } from '.././modal/add-new-assignment.component';
import { LoadContactsComponent } from '.././modal/load-contacts.component';
import { LoadUpcomingAssignmentsComponent } from '.././modal/load-upcoming-assignments.component';
import { RemoveAssignmentsComponent } from '.././modal/remove-assignments.component';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let fixture: ComponentFixture<SidebarComponent>,
    component: SidebarComponent,
    // This is kind of a hack to be able to access private and protected properties.
    // This will probably not on JavaScript private properties intruduced in
    // ES2022.
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rawComponent: any,
    assignmentsService: jasmine.SpyObj<AssignmentsService>,
    bsModalService: jasmine.SpyObj<BsModalService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SidebarComponent
      ],
      imports: [
        // satisfies fa-icon component
        MockModule(FontAwesomeModule)
      ],
      providers: [
        MockProvider(AssignmentsService),
        MockProvider(BsModalService),
        MockProvider(ConfigService)
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    rawComponent = component;

    assignmentsService = TestBed.inject(AssignmentsService) as jasmine.SpyObj<AssignmentsService>;
    bsModalService = TestBed.inject(BsModalService) as jasmine.SpyObj<BsModalService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {

    it('should load assignments', () => {
      const expectedPage = 3,
        expectedPageSize: PageSizeOption = 15;

      component.page = expectedPage;
      component.pageSize = expectedPageSize;

      spyOn(component, 'loadAssignments');

      fixture.detectChanges();

      expect(component.loadAssignments).toHaveBeenCalledWith(expectedPage, expectedPageSize);
    });

  });

  describe('ngOnDestroy', () => {

    it('should unsubscribe from all subscriptions', () => {
      spyOn(rawComponent.subscriptions, 'unsubscribe');

      fixture.destroy();

      expect(rawComponent.subscriptions.unsubscribe).toHaveBeenCalledWith();
    });

  });

  describe('loadAssignments', () => {

    it('should request assignments and total', fakeAsync(() => {
      const assignments$ = new Subject<Assignment[]>(),
        total$ = new Subject<number>(),
        expectedPage = 2,
        expectedPageSize: PageSizeOption = 30,
        expectedAssignments: Assignment[] = [
          { id: 1, subject: 'cs 370', date: 1234 }
        ],
        expectedTotal = 23;

      assignmentsService.assignments.and.returnValue(assignments$.asObservable());
      assignmentsService.total.and.returnValue(total$.asObservable());
      spyOn(rawComponent.subscriptions, 'add');
      spyOn(rawComponent, 'setAssignments');

      component.loadAssignments(expectedPage, expectedPageSize);

      expect(assignmentsService.assignments).toHaveBeenCalledWith(expectedPage, expectedPageSize);
      expect(assignmentsService.total).toHaveBeenCalledWith();
      expect(rawComponent.subscriptions.add).toHaveBeenCalledWith(jasmine.any(Subscription));
      expect(rawComponent.setAssignments).not.toHaveBeenCalled();

      assignments$.next(expectedAssignments);
      total$.next(expectedTotal);
      tick();

      expect(rawComponent.setAssignments).toHaveBeenCalledWith(expectedAssignments, expectedTotal);
    }));

  });

  describe('loadContacts', () => {

    it('should request contacts', fakeAsync(() => {
      const contact$ = new Subject<string[]>(),
        value$ = new Subject<boolean>(),
        bsModalRef: BsModalRef = {
          content: { value$ },
          hide: jasmine.createSpy(),
          setClass: jasmine.createSpy()
        },
        expectedContacts: string[] = [ 'cs 370', 'Steve'];

      assignmentsService.getContacts.and.returnValue(contact$.asObservable());
      bsModalService.show.and.returnValue(bsModalRef);

      component.loadContacts();

      value$.next(true);
      contact$.next(expectedContacts);
      tick();

      expect(assignmentsService.getContacts).toHaveBeenCalled();
      expect(bsModalService.show).toHaveBeenCalledWith(
        LoadContactsComponent,
        jasmine.objectContaining({
          backdrop: 'static',
          initialState: {
            contacts: expectedContacts
          }
        })
      );
    }));

  });

  describe('loadUpcomingAssignments', () => {

    it('should request contacts', fakeAsync(() => {
      const upcomingAssignments$ = new Subject<Assignment[]>(),
        value$ = new Subject<boolean>(),
        bsModalRef: BsModalRef = {
          content: { value$ },
          hide: jasmine.createSpy(),
          setClass: jasmine.createSpy()
        },
        expectedAssignments: Assignment[] = [
          { id: 1, subject: 'cs 370', date: 1234 }
        ];

      assignmentsService.getUpcoming.and.returnValue(upcomingAssignments$.asObservable());
      bsModalService.show.and.returnValue(bsModalRef);

      component.loadUpcomingAssignments();

      value$.next(true);
      upcomingAssignments$.next(expectedAssignments);
      tick();

      expect(assignmentsService.getUpcoming).toHaveBeenCalled();
      expect(bsModalService.show).toHaveBeenCalledWith(
        LoadUpcomingAssignmentsComponent,
        jasmine.objectContaining({
          backdrop: 'static',
          initialState: {
            upcomingAssignments: expectedAssignments
          }
        })
      );
    }));

  });

  describe('loadContacts', () => {

    it('should request contacts', fakeAsync(() => {
      const contact$ = new Subject<string[]>(),
        value$ = new Subject<boolean>(),
        bsModalRef: BsModalRef = {
          content: { value$ },
          hide: jasmine.createSpy(),
          setClass: jasmine.createSpy()
        },
        expectedContacts: string[] = [ 'cs 370', 'Steve'];

      assignmentsService.getContacts.and.returnValue(contact$.asObservable());
      bsModalService.show.and.returnValue(bsModalRef);

      component.loadContacts();

      value$.next(true);
      contact$.next(expectedContacts);
      tick();

      expect(assignmentsService.getContacts).toHaveBeenCalled();
      expect(bsModalService.show).toHaveBeenCalledWith(
        LoadContactsComponent,
        jasmine.objectContaining({
          backdrop: 'static',
          initialState: {
            contacts: expectedContacts
          }
        })
      );
    }));

  });

  describe('setAssignments', () => {

    it('should set the assignments, total, and total pages properties', () => {
      const pageSize: PageSizeOption = 5,
        expectedAssignments: Assignment[] = [
          { id: 1, subject: 'cs 370', date: 1234 }
        ],
        expectedTotal = 52,
        expectedTotalPages = Math.ceil(expectedTotal / pageSize);

      component.pageSize = pageSize;
      component.assignments = [];
      component.total = 0;
      component.totalPages = 0;

      rawComponent.setAssignments(expectedAssignments, expectedTotal);

      expect(component.assignments).toEqual(expectedAssignments);
      expect(component.total).toEqual(expectedTotal);
      expect(component.totalPages).toEqual(expectedTotalPages);
    });

  });

  describe('pageFlipping_NotEmptyAssignments', () => {

    it('should properly switch pages when setting up assignments with a non-empty assignments list', () => {
      const pageSize: PageSizeOption = 10,
        expectedAssignments: Assignment[] = [
          { id: 1, subject: 'cs 370', date: 1234 }
        ],
        expectedPage = 1,
        expectedTotal = 52,
        expectedTotalPages = Math.ceil(expectedTotal / pageSize);

      component.page = expectedPage;
      component.pageSize = pageSize;
      component.assignments = [];
      component.total = 0;
      component.totalPages = 0;

      rawComponent.setAssignments(expectedAssignments, expectedTotal);

      expect(component.page).toEqual(expectedPage);
      expect(component.assignments).toEqual(expectedAssignments);
      expect(component.total).toEqual(expectedTotal);
      expect(component.totalPages).toEqual(expectedTotalPages);
    });

  });

  describe('pageFlipping_EmptyAssignments', () => {

    it('should properly switch pages when setting up assignments when setting up with an empty assignments list', fakeAsync(() => {
      const assignments$ = new Subject<Assignment[]>(),
        total$ = new Subject<number>(),
        pageSize: PageSizeOption = 10,
        expectedAssignments: Assignment[] = [],
        expectedTotal = 52;

      component.page = 1;
      component.pageSize = pageSize;
      component.assignments = [];
      component.total = 0;
      component.totalPages = 0;

      assignmentsService.assignments.and.returnValue(assignments$.asObservable());
      assignmentsService.total.and.returnValue(total$.asObservable());

      rawComponent.setAssignments(expectedAssignments, expectedTotal);

      assignments$.next(expectedAssignments);
      total$.next(expectedTotal);
      tick();

      expect(component.page).toEqual(1);
      expect(component.assignments).toEqual([]);
      // eslint-disable-next-line no-magic-numbers
      expect(component.total).toEqual(52);
      // eslint-disable-next-line no-magic-numbers
      expect(component.totalPages).toEqual(6);
    }));

  });

  describe('pageFlipping_NonZeroTotalAssignments', () => {

    it('should properly switch pages when setting up assignments with at least one assignment', fakeAsync(() => {
      const assignments$ = new Subject<Assignment[]>(),
        total$ = new Subject<number>(),
        pageSize: PageSizeOption = 10,
        expectedAssignments: Assignment[] = [],
        expectedTotal = 52;

      component.page = 1;
      component.pageSize = pageSize;
      component.assignments = [];
      component.total = 0;
      component.totalPages = 0;

      assignmentsService.assignments.and.returnValue(assignments$.asObservable());
      assignmentsService.total.and.returnValue(total$.asObservable());

      rawComponent.setAssignments(expectedAssignments, expectedTotal);

      assignments$.next(expectedAssignments);
      total$.next(expectedTotal);
      tick();

      expect(component.page).toEqual(1);
      expect(component.assignments).toEqual([]);
      // eslint-disable-next-line no-magic-numbers
      expect(component.total).toEqual(52);
      // eslint-disable-next-line no-magic-numbers
      expect(component.totalPages).toEqual(6);
    }));

  });

  describe('pageFlipping_ZeroTotalAssignments', () => {

    it('should properly switch pages when setting up assignments with at zero total assignments', fakeAsync(() => {
      const assignments$ = new Subject<Assignment[]>(),
        total$ = new Subject<number>(),
        pageSize: PageSizeOption = 10,
        expectedAssignments: Assignment[] = [],
        expectedTotal = 0;

      component.page = 1;
      component.pageSize = pageSize;
      component.assignments = [];
      component.total = 0;
      component.totalPages = 0;

      assignmentsService.assignments.and.returnValue(assignments$.asObservable());
      assignmentsService.total.and.returnValue(total$.asObservable());

      rawComponent.setAssignments(expectedAssignments, expectedTotal);

      assignments$.next(expectedAssignments);
      total$.next(expectedTotal);
      tick();

      expect(component.page).toEqual(1);
      expect(component.assignments).toEqual([]);
      expect(component.total).toEqual(1);
      expect(component.totalPages).toEqual(1);
    }));

  });

  describe('pageFlipping_SecondPageAssignments', () => {

    it('should properly switch pages when setting up assignments when at the second page', fakeAsync(() => {
      const assignments$ = new Subject<Assignment[]>(),
        total$ = new Subject<number>(),
        pageSize: PageSizeOption = 10,
        expectedAssignments: Assignment[] = [],
        expectedTotal = 52;

      component.page = 2;
      component.pageSize = pageSize;
      component.assignments = [];
      component.total = 0;
      component.totalPages = 0;

      assignmentsService.assignments.and.returnValue(assignments$.asObservable());
      assignmentsService.total.and.returnValue(total$.asObservable());

      rawComponent.setAssignments(expectedAssignments, expectedTotal);

      assignments$.next(expectedAssignments);
      total$.next(expectedTotal);
      tick();

      expect(component.page).toEqual(1);
      expect(component.assignments).toEqual([]);
      // eslint-disable-next-line no-magic-numbers
      expect(component.total).toEqual(52);
      // eslint-disable-next-line no-magic-numbers
      expect(component.totalPages).toEqual(6);
    }));

  });

  describe('pageFlipping_notSecondPageAssignments', () => {

    //essentially equivalent to this.page === 1 -> this case it's supposed to stay on its page
    it('should properly switch pages when setting up assignments with zero total assignments from second page', fakeAsync(() => {
      const assignments$ = new Subject<Assignment[]>(),
        total$ = new Subject<number>(),
        pageSize: PageSizeOption = 10,
        expectedAssignments: Assignment[] = [],
        expectedTotal = 52;

      component.page = 1;
      component.pageSize = pageSize;
      component.assignments = [];
      component.total = 0;
      component.totalPages = 0;

      assignmentsService.assignments.and.returnValue(assignments$.asObservable());
      assignmentsService.total.and.returnValue(total$.asObservable());

      rawComponent.setAssignments(expectedAssignments, expectedTotal);

      assignments$.next(expectedAssignments);
      total$.next(expectedTotal);
      tick();

      expect(component.page).toEqual(1);
      expect(component.assignments).toEqual([]);
      // eslint-disable-next-line no-magic-numbers
      expect(component.total).toEqual(52);
      // eslint-disable-next-line no-magic-numbers
      expect(component.totalPages).toEqual(6);
    }));

  });

  describe('toggleAssignment', () => {

    it('should toggle the selected property of an assignment', () => {
      const assignment: Assignment = { id: 1, subject: 'cs 370', date: 1234 };

      // toggle undefined to true

      component.toggleAssignment(assignment);

      expect(assignment.selected).toBe(true);

      // toggle true to false

      component.toggleAssignment(assignment);

      expect(assignment.selected).toBe(false);

      // toggle false to true

      component.toggleAssignment(assignment);

      expect(assignment.selected).toBe(true);
    });

  });

  describe('removeAssignments', () => {

    it('should show a remove assignments modal', fakeAsync(() => {
      const assignmentUnselected = { id: 1, subject: 'cs 370', date: 1234 },
        assignmentSelected = { id: 2, subject: 'Sally', date: 1234, selected: true },
        assignments: Assignment[] = [
          assignmentUnselected,
          assignmentSelected
        ],
        expectedRemoveAssignments: Assignment[] = [
          assignmentSelected
        ],
        value$ = new Subject<boolean>(),
        bsModalRef: BsModalRef = {
          content: { value$ },
          hide: jasmine.createSpy(),
          setClass: jasmine.createSpy()
        };

      component.assignments = assignments;

      bsModalService.show.and.returnValue(bsModalRef);
      spyOn(rawComponent.subscriptions, 'add');
      spyOn(rawComponent, 'deleteAssignments');

      component.removeAssignments();

      expect(bsModalService.show).toHaveBeenCalledWith(
        RemoveAssignmentsComponent,
        jasmine.objectContaining({
          initialState: {
            assignments: expectedRemoveAssignments
          }
        })
      );
      expect(rawComponent.subscriptions.add).toHaveBeenCalledWith(jasmine.any(Subscription));
      expect(rawComponent.deleteAssignments).not.toHaveBeenCalled();

      value$.next(true);
      tick();

      expect(rawComponent.deleteAssignments).toHaveBeenCalledWith(expectedRemoveAssignments);
    }));

  });

  describe('deleteAssignments', () => {

    it('should delete the selected assignments', fakeAsync(() => {
      const delete$ = new Subject<void>(),
        expectedAssignments: Assignment[] = [
          { id: 1, subject: 'cs 370', date: 1234 }
        ],
        expectedPage = 2,
        expectedPageSize: PageSizeOption = 15;

      component.page = expectedPage;
      component.pageSize = expectedPageSize;

      assignmentsService.delete.and.returnValue(delete$.asObservable());
      spyOn(rawComponent.subscriptions, 'add');
      spyOn(component, 'loadAssignments');

      rawComponent.deleteAssignments(expectedAssignments);

      expect(rawComponent.subscriptions.add).toHaveBeenCalledWith(jasmine.any(Subscription));
      expect(component.loadAssignments).not.toHaveBeenCalled();

      delete$.next(undefined);
      tick();

      expect(component.loadAssignments).toHaveBeenCalledWith(expectedPage, expectedPageSize);
    }));

  });

  describe('addNewAssignment', () => {

    it('should show an add assignments modal', fakeAsync(() => {
      const value$ = new Subject<Assignment>(),
        expectedAssignment: Assignment = { subject: 'cs 370', date: 1234 },
        bsModalRef: BsModalRef = {
          content: { value$ },
          hide: jasmine.createSpy(),
          setClass: jasmine.createSpy()
        };

      bsModalService.show.and.returnValue(bsModalRef);
      spyOn(rawComponent.subscriptions, 'add');
      spyOn(rawComponent, 'saveNewAssignment');

      component.addNewAssignment();

      expect(bsModalService.show).toHaveBeenCalledWith(AddNewAssignmentComponent, jasmine.any(Object));
      expect(rawComponent.subscriptions.add).toHaveBeenCalledWith(jasmine.any(Subscription));
      expect(rawComponent.saveNewAssignment).not.toHaveBeenCalled();

      value$.next(expectedAssignment);
      tick();

      expect(rawComponent.saveNewAssignment).toHaveBeenCalledWith(expectedAssignment);
    }));

  });

  describe('saveNewAssignment', () => {

    // xit tells the test runner to skip this test.  xdescribe can be used similarly.
    // Generally, we don't want to commit code with xdescribe and xit in it, to
    // ESLint is set to warn if either is in use.
    xit('should save the new assignment', () => {
      // stuff
    });

  });

  describe('noneSelected', () => {

    it('should return true if no assignments are selected', () => {
      component.assignments = [
        { id: 1, subject: 'cs 370', date: 1234 },
        { id: 1, subject: 'Sall', date: 1234 }
      ];

      const actual = component.noneSelected();

      expect(actual).toBe(true);
    });

    it('should return false if at least one assignment is selected', () => {
      component.assignments = [
        { id: 1, subject: 'cs 370', date: 1234 },
        { id: 1, subject: 'Sall', date: 1234, selected: true }
      ];

      const actual = component.noneSelected();

      expect(actual).toBe(false);
    });

  });

  describe('setPage', () => {

    it('should set the page to the supplied page and reload the assignments', () => {
      const expectedPage = 2,
        expectedPageSize: PageSizeOption = 30;

      component.page = 0;
      component.pageSize = expectedPageSize;

      spyOn(component, 'loadAssignments');

      component.setPage(expectedPage);

      expect(component.page).toBe(expectedPage);
      expect(component.loadAssignments).toHaveBeenCalledWith(expectedPage, expectedPageSize);
    });

  });

  describe('onFirstPage', () => {

    it('should return true if the page is set to page 1', () => {
      component.page = 1;

      const actual = component.onFirstPage();

      expect(actual).toBe(true);
    });

    it('should return false if the page is set to page higher than 1', () => {
      component.page = 5;

      const actual = component.onFirstPage();

      expect(actual).toBe(false);
    });

  });

  describe('setLastPage', () => {

    it('should set to the calculated last page', () => {
      const pageSize: PageSizeOption = 5,
        total = 92,
        expectedPage = Math.ceil(total / pageSize);

      component.page = 1;
      component.pageSize = pageSize;
      component.total = total;

      spyOn(component, 'setPage');

      component.setLastPage();

      expect(component.setPage).toHaveBeenCalledWith(expectedPage);
    });

  });

  describe('onLastPage', () => {

    it('should return true if the page is set to the last page', () => {
      const pageSize: PageSizeOption = 5,
        total = 92,
        expectedLastPage = Math.ceil(total / pageSize);

      component.page = expectedLastPage;
      component.pageSize = pageSize;
      component.total = total;

      const actual = component.onLastPage();

      expect(actual).toBe(true);
    });

    it('should return false if the page is not set to the last page', () => {
      const pageSize: PageSizeOption = 5,
        total = 92;

      component.page = 1;
      component.pageSize = pageSize;
      component.total = total;

      const actual = component.onLastPage();

      expect(actual).toBe(false);
    });

  });

  describe('startAssignment', () => {

    it('should return the overall index of the first assignment on the page', () => {
      const page = 2,
        pageSize = 5,
        expectedStartIndex = 1 + ((page - 1) * pageSize);

      component.page = page;
      component.pageSize = pageSize;

      const actual = component.startAssignment();

      expect(actual).toBe(expectedStartIndex);
    });

  });

  describe('endAssignment', () => {

    it('should return the total as the overall index of the last assignment on the page', () => {
      const total = 12,
        page = 3,
        pageSize = 5,
        expectedIndex = total;

      component.page = page;
      component.pageSize = pageSize;
      component.total = total;

      const actual = component.endAssignment();

      expect(actual).toBe(expectedIndex);
    });

    it('should return the calculated last index as the overall index of the last assignment on the page', () => {
      const total = 12,
        page = 1,
        pageSize = 5,
        expectedIndex = page * pageSize;

      component.page = page;
      component.pageSize = pageSize;
      component.total = total;

      const actual = component.endAssignment();

      expect(actual).toBe(expectedIndex);
    });

  });

  describe('pageSizeChanged', () => {

    it('should set the page to 1 and reload the assignments when the page size is changed', () => {
      const expectedPage = 1,
        expectedPageSize: PageSizeOption = 5,
        target: Partial<HTMLSelectElement> = {
          value: String(expectedPageSize)
        },
        $event: Partial<Event> = {
          target: target as EventTarget
        };

      spyOn(component, 'loadAssignments');

      component.pageSizeChanged($event as Event);

      expect(component.page).toBe(expectedPage);
      expect(component.pageSize).toBe(expectedPageSize);
      expect(component.loadAssignments).toHaveBeenCalledWith(expectedPage, expectedPageSize);
    });

  });

});
