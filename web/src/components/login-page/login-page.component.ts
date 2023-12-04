import {Component, OnDestroy, OnInit} from '@angular/core'
import { CommonModule } from '@angular/common'
import { NetworkAPIService } from '../../services/network-api.service'
import { Router } from '@angular/router'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatButtonModule } from '@angular/material/button'
import {Subscription} from "rxjs";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatButtonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent implements OnInit, OnDestroy {

  private sub = new Subscription()

  constructor(
    private api: NetworkAPIService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.login()
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

  login() {
    const loginSub = this.api.login().subscribe((res) => {
      this.router.navigate(['/todo-list'])
    })

    this.sub.add(loginSub)
  }
}
