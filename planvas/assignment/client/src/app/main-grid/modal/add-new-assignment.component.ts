import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { faWarning, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
import { Assignment } from 'src/app/domain/assignment';
import { ConfigService } from 'src/app/service/config.service';

/**
 * The component that will be used in the modal for adding new
 * assignments.  It does not need a selector because it is
 * reference by the class name when showing a modal.
 */
@Component({
  templateUrl: './add-new-assignment.component.html',
  styleUrls: ['./add-new-assignment.component.scss']
})
export class AddNewAssignmentComponent {

  // The optional configuration for the date picker.  For some
  // unknown reason, all the config properties are set as
  // required even though it is not necessary to set all
  // of them when passing the config to the picker.  So,
  // wrap the class in Partial to define an object where
  // all properties are optional.
  readonly dateConfig: Partial<BsDatepickerConfig> = {};
  readonly addFormGroup: FormGroup;

  // This is using a Subject to pass values to be caller of the modal.
  // See https://rxjs.dev/guide/subject.
  private readonly submit$: Subject<Assignment> = new Subject();
  timeOptions: { label: string; val: number; }[] = [];
  errorModal = false;
  errMsg = '';

  constructor(
    configService: ConfigService,
    formBuilder: FormBuilder,
    private modalInstance: BsModalRef
  ) {
    // Define the date format of the date picker.
    this.dateConfig.dateInputFormat = "DD-MMM-YYYY";

    const timeInterval: number = configService.get('assignment.public.meetingIntervalMinutes');
    const subjectMaxLength: number = configService.get('assignment.public.subjectMaxLength');
    const detailsMaxLength: number = configService.get('assignment.public.detailsMaxLength');

    this.timeOptions = this.generateTimeList(timeInterval);

    // Use the form builder service to generate form controls in a
    // more convenient and less repetitive manner.
    // See https://angular.io/guide/reactive-forms#using-the-formbuilder-service-to-generate-controls.
    this.addFormGroup = formBuilder.group({
      date: ['', [
        Validators.required
      ]],
      time: [this.timeOptions[0].val, [
        Validators.required
      ]],
      subject: ['', [
        Validators.required,
        this.subjectLengthValidator(subjectMaxLength),
        this.doubleSpaceValidator(),
      ]],
      details: ['', [
        this.detailsLengthValidator(detailsMaxLength)
      ]]
    });
  }

  /**
   * This exposes our submit subject as an observable to
   * which the caller can subscribe.
   */
  get value$ (): Observable<Assignment> {
    return this.submit$.asObservable();
  }

  onBlur(): void {
    if (this.addFormGroup.invalid) {
      this.errorModal = true; // Show modal if invalid
    } else {
      this.errorModal = false; // Ensure it closes if valid
    }
  }

  icons: { [key: string]: IconDefinition } = {
    faWarning
  };

  /**
   * Determine if the assignment can be saved.
   * @returns True if the form is dirty and valid and can thus be saved; false, otherwise.
   */
  saveEnabled (): boolean {
    return this.addFormGroup.dirty && this.addFormGroup.valid;
  }

  /**
   * Dismisses the modal and emits a value.
   */
  save (): void {
    const newAssignment: Assignment = {
      // Use the date and time values to create a date
      // in milliseconds format.
      date: moment(this.addFormGroup.value.date)
        .startOf('day')
        .add(this.addFormGroup.value.time, 'hours')
        .valueOf(),
      subject: this.addFormGroup.value.subject,
      details: this.addFormGroup.value.details
    };

    this.submit$.next(newAssignment); // Emit the value.
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

  /**
   * Dismisses the error modal.
   */
  closeErrMod(){
    this.errorModal = false;
  }

  /**
   * subject length validation method
   * @param maxLength
   * @returns whether if input field's length is within config value
   */
  subjectLengthValidator(maxLength):ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null =>{
      const input = control.value;
      if (input.length > maxLength) {
        this.errMsg = 'subject exceeded max length of ' + maxLength + ' characters';
        return { invalidSubject:true };
      }
      return null;
    };
  }

  /**
   * Name double space validation method
   * @returns whether if input name contains double spaces or not
   */
  doubleSpaceValidator():ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null =>{
      const input = control.value;
      const doubleSpaceExist = /\s\s/.test(input);
      if (doubleSpaceExist) {
        this.errMsg = 'Double spaces are not allowed in subjects';
        return { invalidSubject:true };
      }
      return null;
    };
  }

  /**
   * Name regular character usage validation method
   * @returns whether if name contains restricted characters
   
  restrictedCharactersValidator():ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null =>{
      const input = control.value;
      const allowedPatterns = /^[A-Za-z0-9\s.']+$/;
      const usingRestrictedCharsetPattern = allowedPatterns.test(input);
      if (!usingRestrictedCharsetPattern) {
        this.errMsg = 'subjects must only contain letters, numbers, spaces, hyphens, apostrophes, and periods';
        return { invalidSubject:true };
      }
      return null;
    };
  }
  */

  /**
   * DATE validation method
   * @returns whether if selected date is in the future or not
   
  futureValidator(): ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
      const input = new Date(control.value);
      const today = new Date();

      if (input < today){
        this.errMsg = 'Date is not in the future';
        return { invalidDate:true };
      }
      return null;
    };
  }
    */

  /**
   * details length validation method
   * @param maxLength
   * @returns whether if details character amount exceedes config amount
   */
  detailsLengthValidator(maxLength):ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null =>{
      const input = control.value;
      if (input.length > maxLength) {
        this.errMsg = 'details exceeded max length of ' + maxLength + ' characters';
        return { invalidSubject:true };
      }
      return null;
    };
  }

  /**
   * Generates list of time options based on time interval from config file.
   * @param interval
   * @returns list of time options that contain a set of the label (time) with val (index)
   */
  generateTimeList (interval: number): { label: string; val: number; }[] {
    const minutesPerDay = 1440;
    const minutesPerHour = 60;
    const timeList: { label: string; val: number; }[] = [];

    let index = 0;

    if (interval > minutesPerDay || interval < 1) {
      interval = minutesPerHour;
    }

    for (let minute = 0; minute < minutesPerDay; minute += interval) {
      const time = moment().startOf('day').add(minute, 'minutes');
      const timeFormat = time.format('HH:mm');
      timeList.push({ label: timeFormat, val: index++ });
    }

    return timeList;
  }

}
