import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AnalysisJob } from '../models/analysis-job.model';
import { AnalysisRequest } from '../models/analysis-request.model';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  startAnalysis(profileURL: string): Observable<{ jobId: string }> {
    const request: AnalysisRequest = { profileURL };
    return this.http.post<{ jobId: string }>(
      `${this.baseUrl}/analysis/start`,
      request
    );
  }

  getJobStatus(jobId: string): Observable<AnalysisJob> {
    return this.http.get<AnalysisJob>(
      `${this.baseUrl}/analysis/${jobId}`
    );
  }

  getJobs(): Observable<AnalysisJob[]> {
    return this.http.get<AnalysisJob[]>(`${this.baseUrl}/analysis/get/all`);
  }

}
