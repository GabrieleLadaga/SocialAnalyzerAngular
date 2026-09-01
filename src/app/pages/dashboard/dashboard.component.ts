import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { JwtService } from '../../core/services/jwt.service';
import { AnalysisService } from '../../core/services/analysis.service';
import { AnalysisJob } from '../../core/models/analysis-job.model';

import { NewAnalysisDialogComponent } from './dialogs/new-analysis/new-analysis-dialog.component';
import { JobDetailsDialogComponent } from './dialogs/job-details/job-details-dialog.component';
import { ReportDialogComponent } from './dialogs/report/report-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  pendingJobs: AnalysisJob[] = [];
  completedJobs: AnalysisJob[] = [];
  username: string = '';
  private refreshInterval: any;

  constructor(
    private analysisService: AnalysisService,
    private jwtService: JwtService,
    private router: Router,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const decoded = this.jwtService.getDecodedToken();
    this.username = decoded?.sub || 'Utente';
    this.loadJobs();
    this.refreshInterval = setInterval(() => {
      this.loadJobs();
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadJobs(): void {
    this.analysisService.getJobs().subscribe({
      next: (jobs) => {
        this.pendingJobs = jobs
          .filter(job => job.status === 'PENDING' || job.status === 'PROCESSING')
          .sort((a, b) => this.sortByDateDesc(a, b));

        this.completedJobs = jobs
          .filter(job => job.status === 'COMPLETED' || job.status === 'FAILED')
          .sort((a, b) => this.sortByDateDesc(a, b));

        this.cdRef.detectChanges();
      },
      error: (error) => {
        console.error('Errore caricamento job:', error);
      }
    });
  }

  private sortByDateDesc(a: AnalysisJob, b: AnalysisJob): number {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  }

  openNewAnalysis(): void {
    const dialogRef = this.dialog.open(NewAnalysisDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        this.analysisService.startAnalysis(result).subscribe({
          next: (response) => {
            console.log('Analisi avviata con ID:', response.jobId);
            this.loadJobs();
          },
          error: (error) => {
            console.error('Errore avvio analisi:', error);
          }
        });
      }
    });
  }

  viewPendingJob(job: AnalysisJob): void {
    this.dialog.open(JobDetailsDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      panelClass: 'custom-dialog-container',
      data: job
    });
  }

  viewCompletedJob(job: AnalysisJob): void {
    this.dialog.open(ReportDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      data: job
    });
  }

  logout(): void {
    this.jwtService.destroyToken();
    this.router.navigate(['/login']);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING': return 'accent';
      case 'PROCESSING': return 'primary';
      case 'COMPLETED': return 'primary';
      case 'FAILED': return 'warn';
      default: return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'PENDING': return 'schedule';
      case 'PROCESSING': return 'refresh';
      case 'COMPLETED': return 'check_circle';
      case 'FAILED': return 'error';
      default: return 'help';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING': return 'In coda';
      case 'PROCESSING': return 'In corso';
      case 'COMPLETED': return 'Completato';
      case 'FAILED': return 'Fallito';
      default: return status;
    }
  }

  getRiskColor(riskLevel: string): string {
    switch (riskLevel) {
      case 'BASSO': return 'primary';
      case 'MEDIO': return 'accent';
      case 'ALTO': return 'warn';
      default: return 'primary';
    }
  }
}
