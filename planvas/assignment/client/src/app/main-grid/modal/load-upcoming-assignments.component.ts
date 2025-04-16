import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
import { Assignment } from 'src/app/domain/assignment';
import { ConfigService } from 'src/app/service/config.service';

/**
 * The component that will be used in the modal for loading upcoming assignments.
 * It does not need a selector because it is
 * reference by the class name when showing a modal.
 */
@Component({
  templateUrl: './load-upcoming-assignments.component.html'
})
export class LoadUpcomingAssignmentsComponent {
  @Input() upcomingAssignments: Assignment[];

  readonly dateTimeFormat: string;
  // This is using a Subject to pass values to be caller of the modal.
  // See https://rxjs.dev/guide/subject.
  private readonly submit$: Subject<boolean> = new Subject();

  /**
   * @param configService
   * @param modalInstance
   */
  constructor(
    configService: ConfigService,
    private modalInstance: BsModalRef
  ) {
    this.dateTimeFormat = configService.get('assignment.public.momentDateFormat');
  }

  /**
   * This exposes our submit subject as an observable to
   * which the caller can subscribe.
   */
  get value$ (): Observable<boolean> {
    return this.submit$.asObservable();
  }

  /**
   * Dismisses the modal and emits a value.
   */
  cancel (): void {
    this.submit$.complete(); // Close the subject so that subscriptions are unsubscribed.
    this.modalInstance.hide();
  }

}
