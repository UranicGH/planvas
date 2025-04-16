import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';  // Ensure Router is imported

@Component({
  selector: 'planvas-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
  }

  onSignup(): void {
    // Navigate to the calendar page when the Sign Up button is pressed
    this.router.navigate(['/main-grid']);
  }

}
