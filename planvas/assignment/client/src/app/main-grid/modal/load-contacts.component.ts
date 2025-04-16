import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';

/**
 * The component that will be used in the modal for loading contacts.
 * It does not need a selector because it is
 * reference by the class name when showing a modal.
 */
@Component({
  templateUrl: './load-contacts.component.html'
})
export class LoadContactsComponent {
  @Input() contacts: string[];
  // This is using a Subject to pass values to be caller of the modal.
  // See https://rxjs.dev/guide/subject.
  private readonly submit$: Subject<boolean> = new Subject();

  constructor( private modalInstance: BsModalRef ) {}

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
