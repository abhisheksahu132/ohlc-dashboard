import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from '../../services/web-socket.service';
import { DataService } from '../../services/data.service';
import { debounce, debounceTime } from 'rxjs/internal/operators';
enum Event {
  SUBSCRIBE = 'sub',
  UNSUBCRIBE = 'unsub'
}

@Component({
  selector: 'app-live-charts',
  templateUrl: './live-charts.component.html',
  styleUrls: ['./live-charts.component.css']
})
export class LiveChartsComponent implements OnInit, OnDestroy {
  chartData={categoryData:[],values:[]}
  chartOption;
  constructor(private websocketService:WebSocketService,private dataService:DataService) {
  }
  ngOnInit(): void {
     this.subScribeToSocket();
     this.subScribeToChartData()
  }

  subScribeToSocket(){
    this.websocketService.send(Event.SUBSCRIBE,{state:true});

  }
  subScribeToChartData(){
    this.dataService.liveChartData.subscribe(data=>{
      this.buildChart(data);
    })
  }

  unsubscribeToSocket(){
    this.websocketService.send(Event.UNSUBCRIBE,{state:false});
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

  ngOnDestroy(){
    this.unsubscribeToSocket();
  }
}
