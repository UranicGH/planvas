//Import necessary testing utilities and dependencies from Angular and other libraries
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ConfigService } from 'src/app/service/config.service';

import { LoadUpcomingAssignmentsComponent } from './load-upcoming-assignments.component';

//Describe block to group related tests for the LoadUpcomingAssignmentsComponent
describe('LoadUpcomingAssignmentsComponent', () => {
  let fixture: ComponentFixture<LoadUpcomingAssignmentsComponent>,
    component: LoadUpcomingAssignmentsComponent,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rawComponent: any, // Reference to the component instance for direct access to observables and properties
    bsModalRefMock: BsModalRef; // Mocked modal reference to simulate modal behavior in the tests

  beforeEach(async () => {
  // Create a mock instance of BsModalRef with a spy for the 'hide' method to simulate closing the modal
    bsModalRefMock = jasmine.createSpyObj('BsModalRef', {
      hide: undefined
    });

    await TestBed.configureTestingModule({
      declarations: [
        LoadUpcomingAssignmentsComponent
      ],
      providers: [
        MockProvider(ConfigService), // Mock the ConfigService to avoid actual HTTP calls or logic
        { provide: BsModalRef, useValue: bsModalRefMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    // Create a fixture for the LoadUpcomingAssignmentsComponent and access its instance
    fixture = TestBed.createComponent(LoadUpcomingAssignmentsComponent);
    component = fixture.componentInstance;
    rawComponent = component;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('cancel', () => {
    // Test case to verify that the 'cancel' method behaves correctly
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
