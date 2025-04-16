
//Import testing modules from Angular core and router testing
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

// Import the component to be tested
import { AppComponent } from './app.component';

//Describes block for grouping related tests for app component
describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ]
    }).compileComponents();
  });
 //Test case checks if the app component is created successfully
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent),
      app = fixture.componentInstance;

    expect(app).toBeTruthy();
  });
});
