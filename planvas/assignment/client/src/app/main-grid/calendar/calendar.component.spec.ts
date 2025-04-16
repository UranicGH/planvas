import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { AssignmentsService } from 'src/app/service/assignments.service';
import { CalendarComponent } from './calendar.component'; // Adjust the path as needed

describe('CalendarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule], // Import HttpClientModule
      declarations: [CalendarComponent],
      providers: [AssignmentsService],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CalendarComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
