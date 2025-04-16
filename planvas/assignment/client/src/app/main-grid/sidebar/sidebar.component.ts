import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import { BsModalService } from 'ngx-bootstrap/modal';
import { combineLatestWith, Subscription, take } from 'rxjs';
import * as moment from 'moment';

import { Assignment } from 'src/app/domain/assignment';
import { PageSizeOption, pageSizeOptions } from 'src/app/global/constants';
import { AssignmentsService } from 'src/app/service/assignments.service';

import { ConfigService } from '../../service/config.service';
import { AddNewAssignmentComponent } from '.././modal/add-new-assignment.component';
import { LoadContactsComponent } from '.././modal/load-contacts.component';
import { LoadUpcomingAssignmentsComponent } from '.././modal/load-upcoming-assignments.component';
import { RemoveAssignmentsComponent } from '.././modal/remove-assignments.component';
import { CompleteAssignmentsComponent } from '../modal/complete-assignments.component';

/**
 * This is the component that will display a table of assignments and
 * controls for changing them.
 */
@Component({
  selector: 'planvas-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  // These numbers are being defined here as page numbers, so they are not "magic".
  readonly pageSizeOptions = pageSizeOptions;
  readonly dateFormat: string;

  assignments: Assignment[] = [];
  total: number;
  page = 1;
  // eslint-disable-next-line no-magic-numbers
  pageSize: PageSizeOption = 10;
  totalPages = 1;


  
  private readonly subscriptions: Subscription = new Subscription();

  // Font Awesome icon definitions
  icons: { [key: string]: IconDefinition } = {
    faAngleDoubleLeft,
    faAngleDoubleRight,
    faAngleLeft,
    faAngleRight
  };

  /**
   * In TypeScript, you can conveniently turn the constructor parameters
   * into class properties by prefixing the parameter with of the
   * visibility modifier: public, private, protected, or readonly.
   *
   * In this case, configService is only needed inside the constructor,
   * so it was not given a visibility modifier.  However, bsModalService
   * and assignmentsService are used in other parts of the class, so
   * setting them to private automatically adds them as private class
   * properties.
   *
   * See https://www.typescriptlang.org/docs/handbook/2/classes.html#parameter-properties.
   * @param bsModalService
   * @param configService
   * @param assignmentsService
   */
  constructor (
    private bsModalService: BsModalService,
    configService: ConfigService,
    private assignmentsService: AssignmentsService
  ) {
    this.dateFormat = configService.get('assignment.public.dateFormat');
  }

  ngOnInit (): void {
    // This call loads for the first list of assignmentsfor the page.
    this.loadAssignments(this.page, this.pageSize);
  }

  ngOnDestroy (): void {
    // When the component is being destroyed, it is necessary to unsubscribe from
    // all subscriptions.  Otherwise, they will stay in memory but never again be
    // accessible (a memory leak).  If all the subscriptions have been added to
    // a single parent subscription, that parent will unsubscribe all child
    // subscriptions when it is unsubscribed.
    this.subscriptions.unsubscribe();
  }

  /**
   * Reload a page of assignments.
   * @param page the 1-based page number
   * @param pageSize the number of assignments on a page
   */
  loadAssignments (
    page: number,
    pageSize: PageSizeOption
  ): void {
    // These create observables for the http requests to get the page of
    // assignments and the total.  The requests will not, however, be
    // made until a subscription is made to the observables.
    const assignments$ = this.assignmentsService.assignments(page, pageSize),
      total$ = this.assignmentsService.total();

    // The resulting subscription will be added to the parent subscription.
    this.subscriptions.add(
      assignments$
        // Since the page of assignments and the total are separate requests,
        // the combineLatestWith operator will combine them so that the
        // subscribed observer is not executed until both requests have
        // completed.
        // See https://rxjs.dev/api/operators/combineLatestWith.
        .pipe(combineLatestWith(total$))
        // TypeScript and ES6+ can use destructuring syntax to conveniently
        // assign properties from the right side to the variables on the left.
        // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment.
        .subscribe(([assignments, total]) => this.setAssignments(assignments, total))
    );
  }

  /**
   * Load a list of upcoming assignments for the next 24 hours
   */
  loadUpcomingAssignments (): void {
    const upcomingAssignment$ = this.assignmentsService.getUpcoming();

    // The resulting subscription will be added to the parent subscription.
    this.subscriptions.add(
      upcomingAssignment$.subscribe(( assignment: Assignment[] ) => {
        const bsModalRef = this.bsModalService.show(
          LoadUpcomingAssignmentsComponent, {
            backdrop: 'static',
            initialState: {
              // This will be passed the @Input assignments property of loadUpcomingAssignmentsComponent.
              upcomingAssignments: assignment
            }
          }
        );
        bsModalRef.content.value$
          // The take operator tells the observable to only accept the first n values, then
          // automatically unsubscribe.  In this case, it only wants 1 value.
          // See https://rxjs.dev/api/operators/take.
          .pipe(take(1))
          .subscribe(() => this.loadUpcomingAssignments()
          );
      })
    );

  }

  /**
   * Load a list of contacts, which are unique names from all assignments
   */
  loadContacts (): void {
    const contact$ = this.assignmentsService.getContacts();

    // The resulting subscription will be added to the parent subscription.
    this.subscriptions.add(
      contact$
        .pipe(take(1))
        .subscribe(( contacts: string[] ) => {
          const bsModalRef = this.bsModalService.show(
            LoadContactsComponent, {
              backdrop: 'static',
              initialState: {
              // This will be passed the @Input assignments property of LoadContactsComponent.
                contacts: contacts
              }
            }
          );
          bsModalRef.content.value$
          // The take operator tells the observable to only accept the first n values, then
          // automatically unsubscribe.  In this case, it only wants 1 value.
          // See https://rxjs.dev/api/operators/take.
            .pipe(take(1))
            .subscribe(() => this.loadContacts()
            );
        })
    );

  }

  private setAssignments (
    assignments: Assignment[],
    total: number
  ): void {
    this.assignments = assignments;
    this.total = total;
    this.totalPages = Math.ceil(this.total / this.pageSize);

    if (this.assignments.length === 0) {
      if (this.total === 0) {
        this.total = 1;
        this.page = 1;
        this.totalPages = 1;
      } else if (this.page > 1) {
        this.page--;
      }
      this.setPage(this.page);
    }
  }

  /**
   * Toggles the selection of an assignment.
   * @param assignment the assignment to toggle
   */
  toggleAssignment (assignment: Assignment): void {
    assignment.selected = !assignment.selected;
  }

  completeAssignments (): void {
    const selected: Assignment[] = this.assignments.filter(assignment => assignment.selected),
      bsModalRef = this.bsModalService.show(
        CompleteAssignmentsComponent, {
          backdrop: 'static',
          initialState: {
            // This will be passed the @Input assignments property of RemoveAssignmentsComponent.
            assignments: selected
          }
        }
      );
    selected.forEach(assignment => assignment.completed = true);
    this.subscriptions.add(
      bsModalRef.content.value$
        // The take operator tells the observable to only accept the first n values, then
        // automatically unsubscribe.  In this case, it only wants 1 value.
        // See https://rxjs.dev/api/operators/take.
        .pipe(take(1))
        // Because of short-circuiting, "deleteAssignments" will only be called if
        // "confirmed" is true.
        // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#short-circuit_evaluation.
        .subscribe((confirmed: boolean) => {
          if (confirmed) {
            selected.forEach((completed: Assignment) => this.saveEditedAssignment(completed));
          }
        })
    );
  }

  /**
   * Opens a confirmation modal. If the deletion is confirmed, as opposed to being
   * dismissed, then the AssignmentsService is called to delete the assignments,
   * and then the current page of assignments is reloaded.
   */
  removeAssignments (): void {
    const selected: Assignment[] = this.assignments.filter(assignment => assignment.selected),
      bsModalRef = this.bsModalService.show(
        RemoveAssignmentsComponent, {
          backdrop: 'static',
          initialState: {
            // This will be passed the @Input assignments property of RemoveAssignmentsComponent.
            assignments: selected
          }
        }
      );

    this.subscriptions.add(
      bsModalRef.content.value$
        // The take operator tells the observable to only accept the first n values, then
        // automatically unsubscribe.  In this case, it only wants 1 value.
        // See https://rxjs.dev/api/operators/take.
        .pipe(take(1))
        // Because of short-circuiting, "deleteAssignments" will only be called if
        // "confirmed" is true.
        // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#short-circuit_evaluation.
        .subscribe((confirmed: boolean) => confirmed && this.deleteAssignments(selected))
    );
  }

  private saveEditedAssignment (editedAssignment: Assignment): void {
    this.subscriptions.add(
      this.assignmentsService.edit(editedAssignment)
       .subscribe(() => this.loadAssignments(this.page, this.pageSize))
    );
  }
  private deleteAssignments (selected: Assignment[]): void {
    this.subscriptions.add(
      this.assignmentsService.delete(selected)
      // Need to make sure to subscribe so that the request will be executed.
      // Also, wait until the request is finished to reload the page.
        .subscribe(() => this.loadAssignments(this.page, this.pageSize))
    );
  }

  /**
   * Opens the new assignment modal, subscribing to its close call.
   */
  addNewAssignment (): void {
    const bsModalRef = this.bsModalService.show(
      AddNewAssignmentComponent, {
        backdrop: 'static'
      }
    );

    this.subscriptions.add(
      bsModalRef.content.value$
        // The take operator tells the observable to only accept the first n values, then
        // automatically unsubscribe.  In this case, it only wants 1 value.
        // See https://rxjs.dev/api/operators/take.
        .pipe(take(1))
        .subscribe((newAssignment: Assignment) => this.saveNewAssignment(newAssignment))
    );
  }

  private saveNewAssignment (newAssignment: Assignment): void {
    this.subscriptions.add(
      this.assignmentsService.add(newAssignment)
        // Need to make sure to subscribe so that the request will be executed.
        // Also, wait until the request is finished to reload the page.
        .subscribe(() => this.loadAssignments(this.page, this.pageSize))
    );
  }

  /**
   * Determines if any assignments have been selected on the grid or not.
   * @return True if an assignment has been selected; false, otherwise.
   */
  noneSelected (): boolean {
    // It is good practice to learn how to use Array.some() effectively.
    // It will iterate through the list until it encounters a true expression,
    // then stop iterating and return true.  This is much cleaner than
    // writing a for-loop with a breaking condition.
    return !this.assignments.some(assignment => assignment.selected);
  }

  /**
   * Sets the current page to a new number, and then loads that page of assignments.
   * @param newPage the new page number
   */
  setPage (newPage: number): void {
    this.page = newPage;
    this.loadAssignments(this.page, this.pageSize);
  }

  /**
   * Determines if the current page is the first page or not.
   * @return True if the current page is null, unknown, or less than or equal to 1; false, otherwise.
   */
  onFirstPage (): boolean {
    return !this.page || this.page <= 1;
  }

  /**
   * Sets the page to the last available page of assignments.
   */
  setLastPage (): void {
    this.setPage(Math.ceil(this.total / this.pageSize));
  }

  /**
   * Determines if the current page is the last page or not.
   * @return True if the current page is null, unknown, or the page is equal to the
   *         total assignments divided by the page size rounded up; false, otherwise.
   */
  onLastPage (): boolean {
    return !this.page || this.page === Math.ceil(this.total / this.pageSize);
  }

  /**
   * Gets the index of the first assignment on the current page. Index starts at 1.
   * @return the assignment's index
   */
  startAssignment (): number {
    return 1 + ((this.page - 1) * this.pageSize);
  }

  /**
   * Gets the index of the last assignment on the current page. Index starts at 1.
   * @return the assignment's index
   */
  endAssignment (): number {
    if (this.total === 0) {
      return 1;
    }
    return Math.min(this.total, this.page * this.pageSize);
  }

  /**
   * Resets the current page to 1, and reloads the assignments.
   * @param changeEvent the event object for the change
   */
  pageSizeChanged (changeEvent: Event): void {
    const newPageSize = parseInt((changeEvent.target as HTMLSelectElement).value) as PageSizeOption;
    this.page = 1;
    this.pageSize = newPageSize;
    this.loadAssignments(this.page, this.pageSize);
  }

  isMinimized = false; // Track whether the sidebar is minimized

  toggleMinimize() {
    this.isMinimized = !this.isMinimized; // Toggle the minimized state
  }

  openFileDialog(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click(); // Opens the file dialog
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.name.endsWith('.ics')) {
        this.readICSFile(file);
      } else {
        alert('Please select a valid .ics file');
      }
    }
  }

  readICSFile(file: File): void {
    console.log('Reading ICS file:', file.name);
    const reader = new FileReader();
    reader.onload = (e: any) => {
      console.log('File content loaded');
      const icsContent = e.target.result;
      const events = this.parseICS(icsContent);

      
      events.forEach((event) => {
          console.log('Parsed event:', event);
          const newAssignment: Assignment = {
            date: new Date(event.date).getTime(),
            subject: event.subject,
            details: event.details,
            selected: false,
            completed: false,
          };
          this.saveNewAssignment(newAssignment);
        });
    };
    reader.readAsText(file);
  }

  private parseICS(icsContent: string): Array<{ date: number; subject: string; details: string }> {
    const events: Array<{ date: number; subject: string; details: string }> = [];
    const lines = icsContent.split(/\r?\n/);
    let currentEvent: { date?: number; subject?: string; details?: string } = {};

    lines.forEach((line) => {
      if (line.startsWith('BEGIN:VEVENT')) {
        currentEvent = {};
      } else if (line.startsWith('END:VEVENT')) {
        if (currentEvent.date && currentEvent.subject && currentEvent.details) {
          events.push({
            date: currentEvent.date,
            subject: currentEvent.subject,
            details: currentEvent.details,
          });
        }
      } else if (line.startsWith('DTEND')) {
        const isoDate = line.split(':')[1];
        const unixDate = moment(isoDate, 'YYYYMMDDTHHmmssZ').valueOf();
        currentEvent.date = unixDate;
      } else if (line.startsWith('SUMMARY')) {
        const summaryLine = line.split(':')[1];
        const detailsEndIndex = summaryLine.indexOf('[');
        currentEvent.details = detailsEndIndex !== -1 ? summaryLine.slice(0, detailsEndIndex).trim() : summaryLine.trim();
        const subjectMatch = summaryLine.match(/\[(.*?)\]/);
        currentEvent.subject = subjectMatch ? subjectMatch[1] : 'Unknown Subject';
      }
    });

    return events;
  }
}



