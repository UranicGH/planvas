import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import * as moment from 'moment';
import { MockModule, MockProvider } from 'ng-mocks';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ConfigService } from 'src/app/service/config.service';

import { Assignment } from '../../domain/assignment';
import { AddNewAssignmentComponent } from './add-new-assignment.component';

describe('AddNewAssignmentComponent', () => {
  let fixture: ComponentFixture<AddNewAssignmentComponent>,
    component: AddNewAssignmentComponent,
    // This is kind of a hack to be able to access private and protected properties.
    // This will probably not on JavaScript private properties introduced in
    // ES2022.
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rawComponent: any,
    bsModalRefMock: BsModalRef;

  beforeEach(async () => {
    bsModalRefMock = jasmine.createSpyObj('BsModalRef', {
      hide: undefined
    });

    await TestBed.configureTestingModule({
      declarations: [
        AddNewAssignmentComponent
      ],
      imports: [
        // satisfies bsConfig attribute on input
        MockModule(BsDatepickerModule),
        // for instance of FormBuilder
        ReactiveFormsModule
      ],
      providers: [
        MockProvider(ConfigService),
        { provide: BsModalRef, useValue: bsModalRefMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewAssignmentComponent);
    component = fixture.componentInstance;
    rawComponent = component;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('saveEnabled', () => {

    it('should return true if the form is dirty and valid', () => {
      const expected = true;

      spyOnProperty(component.addFormGroup, 'dirty', 'get').and.returnValue(true);
      spyOnProperty(component.addFormGroup, 'valid', 'get').and.returnValue(true);

      const actual = component.saveEnabled();

      expect(actual).toBe(expected);
    });

    it('should return false if the form is valid but not dirty', () => {
      const expected = false;

      spyOnProperty(component.addFormGroup, 'dirty', 'get').and.returnValue(false);
      spyOnProperty(component.addFormGroup, 'valid', 'get').and.returnValue(true);

      const actual = component.saveEnabled();

      expect(actual).toBe(expected);
    });

    it('should return false if the form is dirty but not valid', () => {
      const expected = false;

      spyOnProperty(component.addFormGroup, 'dirty', 'get').and.returnValue(true);
      spyOnProperty(component.addFormGroup, 'valid', 'get').and.returnValue(false);

      const actual = component.saveEnabled();

      expect(actual).toBe(expected);
    });

    it('should return false if the form is neither dirty nor valid', () => {
      const expected = false;

      spyOnProperty(component.addFormGroup, 'dirty', 'get').and.returnValue(false);
      spyOnProperty(component.addFormGroup, 'valid', 'get').and.returnValue(false);

      const actual = component.saveEnabled();

      expect(actual).toBe(expected);
    });

  });

  describe('save', () => {

    it('should emit true through submit$, complete submit$, and hide the modal', () => {
      const expectedDate = 1653391642135,
        expectedTime = 3,
        expectedDateTime = moment(expectedDate)
          .startOf('day')
          .add(expectedTime, 'hours')
          .valueOf(),
        expectedSubject = 'cs 370',
        expectedDetails = 'some details',
        expectedAssignment: Assignment = {
          date: expectedDateTime,
          subject: expectedSubject,
          details: expectedDetails
        };

      component.addFormGroup.setValue({
        date: expectedDate,
        time: expectedTime,
        subject: expectedSubject,
        details: expectedDetails
      });

      spyOn(rawComponent.submit$, 'next');
      spyOn(rawComponent.submit$, 'complete');

      component.save();

      expect(rawComponent.submit$.next).toHaveBeenCalledWith(expectedAssignment);
      expect(rawComponent.submit$.next).toHaveBeenCalledBefore(rawComponent.submit$.complete);
      expect(rawComponent.submit$.complete).toHaveBeenCalledWith();
      expect(bsModalRefMock.hide).toHaveBeenCalledWith();
    });

  });

  describe('generateTimeOptions', () => {

    it('should emit correct values for time options', () => {
      const expectedTimeOptions: { label: string; val: number; }[] = [
        { label: '00:00', val: 0 },
        { label: '00:15', val: 1 },
        { label: '00:30', val: 2 },
        { label: '00:45', val: 3 },
        { label: '01:00', val: 4 },
        { label: '01:15', val: 5 },
        { label: '01:30', val: 6 },
        { label: '01:45', val: 7 },
        { label: '02:00', val: 8 },
        { label: '02:15', val: 9 },
        { label: '02:30', val: 10 },
        { label: '02:45', val: 11 },
        { label: '03:00', val: 12 },
        { label: '03:15', val: 13 },
        { label: '03:30', val: 14 },
        { label: '03:45', val: 15 },
        { label: '04:00', val: 16 },
        { label: '04:15', val: 17 },
        { label: '04:30', val: 18 },
        { label: '04:45', val: 19 },
        { label: '05:00', val: 20 },
        { label: '05:15', val: 21 },
        { label: '05:30', val: 22 },
        { label: '05:45', val: 23 },
        { label: '06:00', val: 24 },
        { label: '06:15', val: 25 },
        { label: '06:30', val: 26 },
        { label: '06:45', val: 27 },
        { label: '07:00', val: 28 },
        { label: '07:15', val: 29 },
        { label: '07:30', val: 30 },
        { label: '07:45', val: 31 },
        { label: '08:00', val: 32 },
        { label: '08:15', val: 33 },
        { label: '08:30', val: 34 },
        { label: '08:45', val: 35 },
        { label: '09:00', val: 36 },
        { label: '09:15', val: 37 },
        { label: '09:30', val: 38 },
        { label: '09:45', val: 39 },
        { label: '10:00', val: 40 },
        { label: '10:15', val: 41 },
        { label: '10:30', val: 42 },
        { label: '10:45', val: 43 },
        { label: '11:00', val: 44 },
        { label: '11:15', val: 45 },
        { label: '11:30', val: 46 },
        { label: '11:45', val: 47 },
        { label: '12:00', val: 48 },
        { label: '12:15', val: 49 },
        { label: '12:30', val: 50 },
        { label: '12:45', val: 51 },
        { label: '13:00', val: 52 },
        { label: '13:15', val: 53 },
        { label: '13:30', val: 54 },
        { label: '13:45', val: 55 },
        { label: '14:00', val: 56 },
        { label: '14:15', val: 57 },
        { label: '14:30', val: 58 },
        { label: '14:45', val: 59 },
        { label: '15:00', val: 60 },
        { label: '15:15', val: 61 },
        { label: '15:30', val: 62 },
        { label: '15:45', val: 63 },
        { label: '16:00', val: 64 },
        { label: '16:15', val: 65 },
        { label: '16:30', val: 66 },
        { label: '16:45', val: 67 },
        { label: '17:00', val: 68 },
        { label: '17:15', val: 69 },
        { label: '17:30', val: 70 },
        { label: '17:45', val: 71 },
        { label: '18:00', val: 72 },
        { label: '18:15', val: 73 },
        { label: '18:30', val: 74 },
        { label: '18:45', val: 75 },
        { label: '19:00', val: 76 },
        { label: '19:15', val: 77 },
        { label: '19:30', val: 78 },
        { label: '19:45', val: 79 },
        { label: '20:00', val: 80 },
        { label: '20:15', val: 81 },
        { label: '20:30', val: 82 },
        { label: '20:45', val: 83 },
        { label: '21:00', val: 84 },
        { label: '21:15', val: 85 },
        { label: '21:30', val: 86 },
        { label: '21:45', val: 87 },
        { label: '22:00', val: 88 },
        { label: '22:15', val: 89 },
        { label: '22:30', val: 90 },
        { label: '22:45', val: 91 },
        { label: '23:00', val: 92 },
        { label: '23:15', val: 93 },
        { label: '23:30', val: 94 },
        { label: '23:45', val: 95 }
      ];

      // eslint-disable-next-line no-magic-numbers
      component.timeOptions = component.generateTimeList(15);

      expect(component.timeOptions).toEqual(expectedTimeOptions);
    });

    it('should return hour-interval if passed time interval is invalid', () => {
      // eslint-disable-next-line no-magic-numbers
      const expectedTimeOptions: { label: string; val: number; }[] = component.generateTimeList(60);
      component.timeOptions = component.generateTimeList(-1);

      expect(component.timeOptions).toEqual(expectedTimeOptions);
    });

  });

  describe('cancel', () => {

    it('should complete submit$ without emitting anything and hide the modal', () => {
      spyOn(rawComponent.submit$, 'next');
      spyOn(rawComponent.submit$, 'complete');

      component.cancel();

      expect(rawComponent.submit$.next).not.toHaveBeenCalled();
      expect(rawComponent.submit$.complete).toHaveBeenCalledWith();
      expect(bsModalRefMock.hide).toHaveBeenCalledWith();
    });

  });

});
