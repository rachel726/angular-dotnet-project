import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.scss']
})
export class CountdownTimerComponent {

  @Input() targetTime?: Date;
  @Output() timerComplete = new EventEmitter<void>();
 
  remainingTime: string = '';
  private intervalId?: number;
 
  ngOnInit(): void {
    this.startTimer();
  }
 
  ngOnDestroy(): void {
    this.stopTimer();
  }
 
  private startTimer(): void {
    if (!this.targetTime) return;
    
    this.updateTimer();
    
    this.intervalId = window.setInterval(() => {
      this.updateTimer();
    }, 1000);
  }
  
  private updateTimer(): void {
    if (!this.targetTime) return;
    
    const now = new Date().getTime();
    const target = this.targetTime.getTime();
    const distance = target - now;
    
    if (distance <= 0) {
      this.stopTimer();
      this.remainingTime = '00:00';
      this.timerComplete.emit();
      return;
    }
    
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    this.remainingTime = `${this.padNumber(minutes)}:${this.padNumber(seconds)}`;
  }
 
  private stopTimer(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
 
  private padNumber(num: number): string {
    return num.toString().padStart(2, '0');
  }
}