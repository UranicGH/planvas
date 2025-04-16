import { Component, OnInit } from '@angular/core';
import { Assignment } from 'src/app/domain/assignment';
import { AssignmentsService } from 'src/app/service/assignments.service';
import { faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { BsModalService } from 'ngx-bootstrap/modal';
import { combineLatestWith, Subscription, take } from 'rxjs';
import * as moment from 'moment';

import { PageSizeOption, pageSizeOptions } from 'src/app/global/constants';

import { ConfigService } from '../../service/config.service';
import { AddNewAssignmentComponent } from '.././modal/add-new-assignment.component';
import { LoadContactsComponent } from '.././modal/load-contacts.component';
import { LoadUpcomingAssignmentsComponent } from '.././modal/load-upcoming-assignments.component';
import { RemoveAssignmentsComponent } from '.././modal/remove-assignments.component';
import { CompleteAssignmentsComponent } from '..//modal/complete-assignments.component';

@Component({
  selector: 'planvas-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent implements OnInit {
  currentDate: Date = new Date();
  calendarTitle: string = '';
  calendarDays: { day: number; isCurrentMonth: boolean, assignments: Assignment[] }[] = [];
  assignments: Assignment[];
  total: number;
  page = 1;
  totalPages = 1;
  pageSize: PageSizeOption = 10;
  private readonly subscriptions: Subscription = new Subscription();

  
  constructor(
    private assignmentsService: AssignmentsService
    ) {}

    ngOnInit(): void {
      this.loadAssignments(this.page, this.pageSize); // Load assignments first
    }
    
    private setAssignments(assignments: Assignment[], total: number): void {
      this.assignments = assignments;
      this.total = total;
      this.totalPages = Math.ceil(this.total / this.pageSize);
      
      this.populateCalendar(this.currentDate); // Populate calendar after assignments are loaded
    }

  // Function to populate the calendar
  populateCalendar(date: Date): void {
    const year = date.getFullYear();
    const month = date.getMonth();
  
    // Set calendar title
    this.calendarTitle = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  
    // Clear previous calendar days
    this.calendarDays = [];
  
    // Days in the current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
  
    // Starting day of the week (0 = Sunday, 1 = Monday, etc.)
    const startDay = new Date(year, month, 1).getDay();
  
    // Days in the previous month
    const daysInPrevMonth = new Date(year, month, 0).getDate();
  
    // Fill in days from the previous month (before the first day of the current month)
    for (let i = startDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      this.calendarDays.push({ day, isCurrentMonth: false, assignments: [] });
    }
  
    // Fill in days for the current month
    for (let day = 1; day <= daysInMonth; day++) {
      this.calendarDays.push({ day, isCurrentMonth: true, assignments: [] });
    }
  
    // Ensure we have exactly 35 cells (5 rows of 7 days)
    const totalCells = this.calendarDays.length;
    const remainingCells = 7 - (totalCells % 7);
    
    if (remainingCells < 7 && remainingCells > 0) {
      // Fill the remaining cells from the next month to complete the last row
      for (let i = 1; i <= remainingCells; i++) {
        this.calendarDays.push({ day: i, isCurrentMonth: false, assignments: [] });
      }
    }
  
    // Ensure there are no more than 35 cells in the calendar (5 rows of 7)
    if (this.calendarDays.length > 35) {
      this.calendarDays = this.calendarDays.slice(0, 35); // Truncate if needed
    }
  
    // Now, we place the events on the correct days
    this.assignments.forEach(assignment => {
      const dueDate = new Date(assignment.date);
      if (dueDate.getMonth() === month && dueDate.getFullYear() === year) {
        const dayIndex = this.calendarDays.findIndex(
          day => day.day === dueDate.getDate() && day.isCurrentMonth
        );
        if (dayIndex >= 0) {
          this.calendarDays[dayIndex].assignments.push(assignment);
        }
      }
    });
  }
  

  loadAssignments(page: number, pageSize: PageSizeOption): void {
    const assignments$ = this.assignmentsService.assignments(page, pageSize),
      total$ = this.assignmentsService.total();

    this.subscriptions.add(
      assignments$
        .pipe(combineLatestWith(total$))
        .subscribe(([assignments, total]) => this.setAssignments(assignments, total))
    );
  }


  setPage(newPage: number): void {
    this.page = newPage;
    this.loadAssignments(this.page, this.pageSize);
  }

  // Event handler for previous month button
  prevMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.populateCalendar(this.currentDate);
  }

  // Event handler for next month button
  nextMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.populateCalendar(this.currentDate);
  }
}

