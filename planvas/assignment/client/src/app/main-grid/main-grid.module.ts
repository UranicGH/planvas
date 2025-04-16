import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { MainGridRoutingModule } from './main-grid-routing.module';
import { MainGridComponent } from './main-grid.component';
import { AddNewAssignmentComponent } from './modal/add-new-assignment.component';
import { LoadContactsComponent } from './modal/load-contacts.component';
import { LoadUpcomingAssignmentsComponent } from './modal/load-upcoming-assignments.component';
import { RemoveAssignmentsComponent } from './modal/remove-assignments.component';
import { CompleteAssignmentsComponent } from './modal/complete-assignments.component';
import { CalendarComponent } from './calendar/calendar.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  // List any components, directives, etc. that are created in this module
  // so that Angular will look for them and build them.
  declarations: [
    MainGridComponent,
    AddNewAssignmentComponent,
    LoadContactsComponent,
    LoadUpcomingAssignmentsComponent,
    RemoveAssignmentsComponent,
    CompleteAssignmentsComponent,
    CalendarComponent,
    SidebarComponent
  ],
  // Import any modules that will be used by the components of this module.
  imports: [
    CommonModule,
    FontAwesomeModule,
    MainGridRoutingModule,
    BsDatepickerModule,
    BsDropdownModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MainGridModule { }
