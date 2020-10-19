import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/index';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public liveChartData = new BehaviorSubject({categoryData:[],values:[]});
  constructor(private http:HttpClient) { }
  loadHistoricalData = async (interval) =>{
    const url = `http://kaboom.rksv.net/api/historical?interval=${interval}`
    return await this.http.get(url).toPromise();
  }

  pushLiveData(rawData){
    const chartData = this.liveChartData.getValue();
    rawData = rawData.split(',')
    rawData.splice(6,1)
    const date = moment(new Date(Number(rawData[0]))).format("DD-MM-YYYY");
    chartData.categoryData.push(date);
    rawData[0] = chartData.categoryData.length++;
    chartData.values.push(rawData);
    this.liveChartData.next(chartData);
  }
}
