import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
import { Assignment } from 'src/app/domain/assignment';
import { ConfigService } from 'src/app/service/config.service';

/**
 * The component that will be used in the modal for confirming
 * the deletion of assignments.  It does not need a selector
 * because it is reference by the class name when showing a modal.
 */
@Component({
  templateUrl: './complete-assignments.component.html',
  styleUrls: ['./complete-assignments.component.scss']
})
export class CompleteAssignmentsComponent {

  // The list of selected assignments passed in from the caller.
  @Input() assignments: Assignment[];

  readonly dateTimeFormat: string;
  // This is using a Subject to pass values to be caller of the modal.
  // See https://rxjs.dev/guide/subject.
  private readonly submit$: Subject<boolean> = new Subject();

  /**
   * In TypeScript, you can conveniently turn the constructor parameters
   * into class properties by prefixing the parameter with of the
   * visibility modifier: public, private, protected, or readonly.
   *
   * In this case, configService is only needed inside the constructor,
   * so it was not given a visibility modifier.  However, modalInstance
   * is used in other parts of the class, so setting it to private
   * automatically adds it as a private class property.
   *
   * See https://www.typescriptlang.org/docs/handbook/2/classes.html#parameter-properties.
   * @param configService
   * @param modalInstance
   */
  constructor(
    configService: ConfigService,
    private modalInstance: BsModalRef
  ) {
    this.dateTimeFormat = configService.get('assignment.public.dateTimeFormat');
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
  confirm (): void {
    this.submit$.next(true); // Emit the value.
    this.submit$.complete(); // Close the subject so that subscriptions are unsubscribed.
    this.modalInstance.hide();
  }

  /**
   * Dismisses the modal and does not emit anything.
   */
  cancel (): void {
    this.submit$.complete(); // Close the subject so that subscriptions are unsubscribed.
    this.modalInstance.hide();
  }

}
