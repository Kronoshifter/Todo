import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { NetworkAPIService } from '../../services/network-api.service'
import { Router } from '@angular/router'

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  title = 'Kronos Todo'

  constructor(private api: NetworkAPIService, private router: Router) {

  }

  logout() {
    this.api.logout().subscribe((res) => {
      console.log(res)
      this.router.navigate(['/login'])
    })
  }
}
