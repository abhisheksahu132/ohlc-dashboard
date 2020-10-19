import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import * as moment from 'moment';
@Component({
  selector: 'app-home',
  templateUrl: './historical.component.html',
  styleUrls: ['./historical.component.css']
})
export class HistoricalComponent implements OnInit {

  public chartOption;
  public intervalOptions = [1,2,3,4,5,6,7,8,9];
  public selectedInterval = 1;
  constructor(private dataService: DataService) {
  }
  ngOnInit(): void {
    this.loadHistoricalData()
  }
  loadHistoricalData = async ()=>{
    const rawData = await this.dataService.loadHistoricalData(this.selectedInterval);
    const data = this.splitData(rawData)
    this.buildChart(data);
  }
  selectInterval(interval){
    this.selectedInterval=interval;
    this.loadHistoricalData();
  }

  buildChart(data){
    this.chartOption = {
      backgroundColor: '#eee',
      animation: true,
      legend: {
        bottom: 10,
        left: 'center',
        data: ['Stock Index']
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        backgroundColor: 'rgba(245, 245, 245, 0.8)',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        textStyle: {
          color: '#000'
        },
        extraCssText: 'width: 170px'
      },
      axisPointer: {
        link: {xAxisIndex: 'all'},
        label: {
          backgroundColor: '#777'
        }
      },
      grid: [
        {
          left: '10%',
          right: '8%',
          bottom: 150
        }
      ],
      xAxis: [
        {
          type: 'category',
          data: data.categoryData,
          scale: true,
          boundaryGap: false,
          axisLine: {onZero: false},
          splitLine: {show: false},
          splitNumber: 20,
          min: 'dataMin',
          max: 'dataMax',
          axisPointer: {
            z: 100
          }
        }
      ],
      yAxis: [
        {
          scale: true,
          splitArea: {
            show: true
          }
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          start: 98,
          end: 100,
          minValueSpan: 10
        },
        {
          show: true,
          type: 'slider',
          bottom: 60,
          start: 98,
          end: 100,
          minValueSpan: 10
        }
      ],
      series: [
        {
          name: 'Stock Index',
          type: 'custom',
          renderItem: this.renderItem,
          dimensions: [null, 'open', 'high', 'low', 'close','trade'],
          encode: {
            x: 0,
            y: [1, 2, 3, 4],
            tooltip: [1, 2, 3, 4, 5]
          },
          data: data.values
        }
      ]
    }
  }
  renderItem(params, api) {
    var xValue = api.value(0);
    var openPoint = api.coord([xValue, api.value(1)]);
    var highPoint = api.coord([xValue, api.value(2)]);
    var lowPoint = api.coord([xValue, api.value(3)]);
    var closePoint = api.coord([xValue, api.value(4)]);
    var halfWidth = api.size([1, 0])[0] * 0.35;
    var style = api.style({
      stroke: api.visual('color')
    });

    return {
      type: 'group',
      children: [{
        type: 'line',
        shape: {
          x1: lowPoint[0], y1: lowPoint[1],
          x2: highPoint[0], y2: highPoint[1]
        },
        style: style
      }, {
        type: 'line',
        shape: {
          x1: openPoint[0], y1: openPoint[1],
          x2: openPoint[0] - halfWidth, y2: openPoint[1]
        },
        style: style
      }, {
        type: 'line',
        shape: {
          x1: closePoint[0], y1: closePoint[1],
          x2: closePoint[0] + halfWidth, y2: closePoint[1]
        },
        style: style
      }]
    };
  }
  splitData(rawData) {
    var categoryData = [];
    var values = [];
    for (var i = 0; i < rawData.length; i++) {
      rawData[i] = rawData[i].split(',')
      rawData[i].splice(6,1)
      const date = moment(new Date(Number(rawData[i][0]))).format("DD-MM-YYYY");
      categoryData.push(date);
      rawData[i][0] = i;
      values.push(rawData[i]);
    }
    return {
      categoryData: categoryData,
      values: values
    };
  }
}
