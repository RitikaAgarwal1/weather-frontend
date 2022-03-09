import { Component, ElementRef, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';  
import { WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}
