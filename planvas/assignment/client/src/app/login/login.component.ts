import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';  // Ensure Router is imported

@Component({
  selector: 'planvas-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
//Export the LoginComponent class, which handles the login logic
export class LoginComponent implements OnInit {

  constructor(private router: Router) {}

  //Method called when the login action occurs (e.g., button click)
  onLogin(): void {
    //Navigate to the calendar page when the Login button is pressed
    this.router.navigate(['/main-grid']);
  }

  //ngOnInit lifecycle hook, executed when the component is initialized
  ngOnInit(): void {
  }

}
