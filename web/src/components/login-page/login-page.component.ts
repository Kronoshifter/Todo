import {Component, OnDestroy, OnInit} from '@angular/core'
import { CommonModule } from '@angular/common'
import { NetworkAPIService } from '../../services/network-api.service'
import { Router } from '@angular/router'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatButtonModule } from '@angular/material/button'
import { concat, delay, Subscription } from "rxjs";
import { SessionService } from "../../services/session.service";

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
    private session: SessionService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.logout()
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

  logout() {
    const logoutSub = this.api.logout().pipe(
      delay(1000),
    ).subscribe(
      (res) => {
        this.login()
      }
    )

    this.sub.add(logoutSub)
  }
}
