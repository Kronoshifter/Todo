import {Routes} from '@angular/router'
import {HomePageComponent} from '../components/home-page/home-page.component'
import {SessionService} from '../services/session.service'
import {LoginPageComponent} from '../components/login-page/login-page.component'

export const routes: Routes = [
  { path: 'login', title: 'Login', component: LoginPageComponent },
  {
    path: '',
    canActivate: [SessionService],
    children: [
      {path: 'todo-list', title: 'Todo List', component: HomePageComponent},
      {path: '**', redirectTo: '/todo-list'},
    ]
  },
  {path: '**', redirectTo: ''},
]
