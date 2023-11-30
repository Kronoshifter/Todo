import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  title = 'Kronos Todo';
}
