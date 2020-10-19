import { Component } from '@angular/core';
import { WebSocketService } from './services/web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'OHLC-dashboard';
  constructor(private webSocketService:WebSocketService){
    this.webSocketService.initSocket();
  }
}
