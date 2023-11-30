import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common';
import { NetworkAPIService } from '../../services/network-api.service'
import { Router } from '@angular/router'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit {

  constructor(
    private api: NetworkAPIService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.api.login('admin', 'admin').subscribe((res) => {
      this.router.navigate(['/todo-list'])
    })

  }
}
