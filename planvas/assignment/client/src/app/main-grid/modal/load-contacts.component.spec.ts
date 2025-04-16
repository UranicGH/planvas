import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ConfigService } from 'src/app/service/config.service';

import { LoadContactsComponent } from './load-contacts.component';

//Describe block for grouping related tests for the LoadContactsComponent
describe('LoadContactsComponent', () => {
  let fixture: ComponentFixture<LoadContactsComponent>,
    component: LoadContactsComponent,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rawComponent: any, //Raw component used to directly access observable properties for testing
    bsModalRefMock: BsModalRef; // Mock for the BsModalRef to simulate modal behaviors

  beforeEach(async () => {
    bsModalRefMock = jasmine.createSpyObj('BsModalRef', {
      hide: undefined
    });

    await TestBed.configureTestingModule({
      declarations: [
        LoadContactsComponent
      ],
      providers: [
        MockProvider(ConfigService),
        { provide: BsModalRef, useValue: bsModalRefMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadContactsComponent);
    component = fixture.componentInstance;
    rawComponent = component;
    fixture.detectChanges();
  });
  //Test case to verify that the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
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
