import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private url = 'https://weather-chart-backend.herokuapp.com/';

  constructor(private http: HttpClient) { }

  getWeatherDetails(){
    return this.http.get(this.url);
  }
}
