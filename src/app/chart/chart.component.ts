import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { ChartConfiguration, ChartEvent, ChartType, ChartDataset, ChartOptions, Color } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DatePipe } from '@angular/common'
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnDestroy {
  myForm!: FormGroup;

  time: any = [];
  temp: any = [];
  result: any;
  interval: any;
  sub: any;
  refreshTime: any = this.datepipe.transform(new Date(), 'medium')?.toString();

  public data: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Temperature(F)',
        backgroundColor: '#ffb2b28c'
      }
    ],
    labels: []
  };

  public options: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5
      }
    },
    scales: {
      x: {},
      'y-axis-0':
      {
        position: 'left'
      }
    }
  };

  public lineChartType: ChartType = 'line';

  constructor(private service: WeatherService,
    public datepipe: DatePipe) { }
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  ngOnInit() {
    this.myForm = new FormGroup({
      'currentDate': new FormControl((new Date()).toISOString().substring(0, 10)),
    });
    this.getData(500);
  }

  //Fetching data from API
  getData(duration: number) {
    setTimeout(() => {
      this.sub = this.service.getWeatherDetails()
        .subscribe(response => {
          this.result = response;
        });
      this.createData();
    }, duration);
  }

  toggleGraph(event: any) {
    if (event.target.dataset.graph == 'bar') this.lineChartType = 'bar';
    if (event.target.dataset.graph == 'line') this.lineChartType = 'line';
    this.createData();
  }

  //Creating data for displaying on line chart
  createData() {
    this.interval = setInterval(() => {
    this.getData(0);
    this.time = [];
    this.temp = [];
    this.temp.push(this.result.current.temp_f);
    this.time.push('Current');
    for (let prop of this.result.forecast) {
      if (new Date() < new Date(prop.time)) {
        this.temp.push(prop.temp_f);
        this.time.push(prop.time.slice(-5));
      }
    }
    this.data.datasets[0].data = this.temp;
    this.data.labels = this.time;
    this.refreshTime = this.datepipe.transform(new Date(), 'medium')?.toString()
    this.chart?.update();
    }, 5000);
  }

  //Clearing time interval and cancelling the observables
  ngOnDestroy() {
    clearInterval(this.interval);
    this.sub.unsubscribe();
  }
}
