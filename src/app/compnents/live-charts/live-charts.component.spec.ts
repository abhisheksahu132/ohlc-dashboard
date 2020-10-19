import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveChartsComponent } from './live-charts.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WebSocketService } from '../../services/web-socket.service';

describe('LiveChartsComponent', () => {
  let component: LiveChartsComponent;
  let fixture: ComponentFixture<LiveChartsComponent>;
  let mockedSocket = {
    send:()=>{}
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      declarations: [ LiveChartsComponent ],
      providers:[{
        provide:WebSocketService,
        useValue:mockedSocket
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
