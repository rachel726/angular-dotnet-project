import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NumberResponse } from 'src/app/models/number-response.model';
import { NumberService } from 'src/app/services/number-service.service';


@Component({
  selector: 'app-number-checker',
  templateUrl: './number-checker.component.html',
  styleUrls: ['./number-checker.component.scss']
})
export class NumberCheckerComponent {

  numberForm: FormGroup;
  result?: NumberResponse;
  isLoading = false;
  error?: string;
  isRateLimited = false;
  targetTime?: Date;
  
  constructor(
    private fb: FormBuilder,
    private numberService: NumberService
  ) {
    this.numberForm = this.fb.group({
      numberValue: ['', [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
        Validators.min(0),
        Validators.max(10000)
      ]]
    });
  }
  
  onSubmit(): void {
    this.result = undefined;
    this.error = undefined;
    
    if (this.validateFormLocally()) {
      return;
    }
    
    const numberValue = this.numberForm.get('numberValue')?.value;
    
    this.isLoading = true;
    
    this.numberService.checkNumber(numberValue).subscribe({
      next: (response) => {
        this.result = response;
        this.isLoading = false;
        
        if (response.IsRateLimited && response.NextAvailableTime) {
          this.isRateLimited = true;
          this.targetTime = new Date(response.NextAvailableTime);
        } else {
          this.isRateLimited = false;
        }
      },
      error: (error) => {
        this.isLoading = false;
        
        if (error.status === 429) {
          this.isRateLimited = true;
          const errorResponse = error.error as NumberResponse;
          if (errorResponse && errorResponse.NextAvailableTime) {
            this.targetTime = new Date(errorResponse.NextAvailableTime);
            this.error = errorResponse.Message;
          } else {
            this.targetTime = new Date(Date.now() + 60000); // Default 1 minute
            this.error = 'Rate limit exceeded. Please try again later.';
          }
        } else if (error.status === 400) {
          this.error = error.error?.Message || 'Invalid input.';
        } else {
          this.error = 'An error occurred while processing your request.';
          console.error('API error:', error);
        }
      }
    });
  }
  
  onTimerComplete(): void {
    this.isRateLimited = false;
    this.error = undefined;
  }
  
  private validateFormLocally(): boolean {
    if (this.numberForm.invalid) {
      if (this.numberForm.get('numberValue')?.hasError('required')) {
        this.error = 'Please enter a number.';
      } else if (this.numberForm.get('numberValue')?.hasError('pattern')) {
        this.error = 'Please enter a valid integer.';
      } else if (this.numberForm.get('numberValue')?.hasError('min') ||
                this.numberForm.get('numberValue')?.hasError('max')) {
        this.error = 'Number must be between 0 and 10000.';
      } else {
        this.error = 'Invalid input.';
      }
      return true;
    }
    return false;
  }
}