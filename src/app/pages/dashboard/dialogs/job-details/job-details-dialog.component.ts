import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AnalysisJob } from '../../../../core/models/analysis-job.model';

@Component({
  selector: 'app-job-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './job-details-dialog.component.html',
  styleUrls: ['./job-details-dialog.component.css']
})
export class JobDetailsDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<JobDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public job: AnalysisJob
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'PENDING': return 'hourglass_empty';
      case 'PROCESSING': return 'refresh';
      default: return 'schedule';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING': return 'In coda';
      case 'PROCESSING': return 'In corso';
      default: return status;
    }
  }
}
