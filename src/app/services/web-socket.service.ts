import { Injectable } from "@angular/core";
import io from 'socket.io-client';
import { DataService } from './data.service';

const SERVER_URL = 'ws://kaboom.rksv.net/watch';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  public socket;
  constructor(private dataService:DataService) {}
  public initSocket(): void {
    this.socket = io.connect(SERVER_URL);

    this.socket.on('connect_error', (error) => {
      setTimeout(() => {
        console.log('connected_error',error);
        this.socket.connect();
      }, 2000);
    });

    this.socket.on('disconnect', () => {
      setTimeout(() => {
        console.log('disconnected');
        this.socket.connect();
      }, 500);
    });

    this.socket.on('data',(data,ack)=>{
      ack(1);
      this.dataService.pushLiveData(data);
    })
  }

  public send(message: any,payload): void {
    this.socket.emit(message, payload);
  }

}
