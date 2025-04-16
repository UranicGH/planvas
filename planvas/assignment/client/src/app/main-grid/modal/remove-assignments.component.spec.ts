import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MockModule, MockProvider } from 'ng-mocks';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ConfigService } from 'src/app/service/config.service';

import { RemoveAssignmentsComponent } from './remove-assignments.component';

describe('RemoveAssignmentsComponent', () => {
  let fixture: ComponentFixture<RemoveAssignmentsComponent>,
    component: RemoveAssignmentsComponent,
    // This is kind of a hack to be able to access private and protected properties.
    // This will probably not on JavaScript private properties intruduced in
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
        RemoveAssignmentsComponent
      ],
      imports: [
        // satisfies fa-icon component
        MockModule(FontAwesomeModule)
      ],
      providers: [
        MockProvider(ConfigService),
        { provide: BsModalRef, useValue: bsModalRefMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveAssignmentsComponent);
    component = fixture.componentInstance;
    rawComponent = component;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('confirm', () => {

    it('should emit true through submit$, complete, and hide the modal', () => {
      spyOn(rawComponent.submit$, 'next');
      spyOn(rawComponent.submit$, 'complete');

      component.confirm();

      expect(rawComponent.submit$.next).toHaveBeenCalledWith(true);
      expect(rawComponent.submit$.next).toHaveBeenCalledBefore(rawComponent.submit$.complete);
      expect(rawComponent.submit$.complete).toHaveBeenCalledWith();
      expect(bsModalRefMock.hide).toHaveBeenCalledWith();
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
