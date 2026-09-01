/**
 * Modello per un job di analisi (corrisponde al DTO Java AnalysisJobDTO)
 * Ricevuto dal backend per rappresentare lo stato di un'analisi.
 */
export interface AnalysisJob {
  jobID: string;
  profileURL: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: Date;
  updatedAt?: Date;
  reportSummary?: string;
  riskLevel?: string;
  errorMessage?: string;
}
