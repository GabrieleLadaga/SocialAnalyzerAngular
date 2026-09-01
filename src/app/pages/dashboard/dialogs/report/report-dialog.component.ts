import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { AnalysisJob } from '../../../../core/models/analysis-job.model';

interface ParsedReport {
  summary: string;
  patterns: string;
  social_engineering_risk: string;
  risk_level: 'BASSO' | 'MEDIO' | 'ALTO';
  recommendations: string;
}

@Component({
  selector: 'app-report-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './report-dialog.component.html',
  styleUrls: ['./report-dialog.component.css']
})
export class ReportDialogComponent {

  parsedReport: ParsedReport | null = null;

  constructor(
    public dialogRef: MatDialogRef<ReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public job: AnalysisJob
  ) {
    this.parseReport();
  }

  close(): void {
    this.dialogRef.close();
  }

  private parseReport(): void {
    if (!this.job.reportSummary) {
      this.parsedReport = null;
      return;
    }

    try {
      const parsed = JSON.parse(this.job.reportSummary);

      const reportData = parsed.report;

      if (reportData && reportData.risk_level) {
        this.parsedReport = {
          summary: reportData.summary || 'Nessun riepilogo disponibile.',
          patterns: reportData.patterns || 'Nessun pattern identificato.',
          social_engineering_risk: reportData.social_engineering_risk || 'Nessuna valutazione disponibile.',
          risk_level: reportData.risk_level || 'MEDIO',
          recommendations: reportData.recommendations || 'Nessuna raccomandazione disponibile.'
        };
        console.log('Report parsato correttamente:', this.parsedReport);
      } else {
        console.warn('JSON senza campo "report" o "risk_level":', parsed);
        this.parsedReport = null;
      }
    } catch (error) {
      console.error('Errore nel parsing del JSON:', error);
      this.parsedReport = null;
    }
  }

  getRiskIcon(riskLevel: string): string {
    switch (riskLevel) {
      case 'BASSO': return 'check_circle';
      case 'MEDIO': return 'warning';
      case 'ALTO': return 'error';
      default: return 'help';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'COMPLETED': return 'Completato';
      case 'FAILED': return 'Fallito';
      default: return status;
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'COMPLETED': return 'check_circle';
      case 'FAILED': return 'error';
      default: return 'help';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'COMPLETED': return 'primary';
      case 'FAILED': return 'warn';
      default: return '';
    }
  }

  getFormattedReport(reportSummary: string | undefined): string {
    if (!reportSummary) {
      return 'Report non disponibile.';
    }
    return reportSummary;
  }
}
