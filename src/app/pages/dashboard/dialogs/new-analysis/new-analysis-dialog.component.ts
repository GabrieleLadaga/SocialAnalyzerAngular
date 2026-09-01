import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

interface SupportedPlatform {
  name: string;
  icon: string;
  domains: string[];
  placeholder: string;
  color: string;
}

@Component({
  selector: 'app-new-analysis-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './new-analysis-dialog.component.html',
  styleUrls: ['./new-analysis-dialog.component.css']
})
export class NewAnalysisDialogComponent {
  profileURL: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  supportedPlatforms: SupportedPlatform[] = [
    {
      name: 'Instagram',
      icon: 'photo_camera',
      domains: ['instagram.com'],
      placeholder: 'https://www.instagram.com/...',
      color: '#E4405F'
    },
    {
      name: 'TikTok',
      icon: 'music_note',
      domains: ['tiktok.com'],
      placeholder: 'https://www.tiktok.com/@...',
      color: '#000000'
    },
    {
      name: 'Facebook',
      icon: 'facebook',
      domains: ['facebook.com', 'fb.com'],
      placeholder: 'https://www.facebook.com/...',
      color: '#1877F2'
    }
  ];

  constructor(
    private dialogRef: MatDialogRef<NewAnalysisDialogComponent>
  ) {}

  confirm(): void {
    if (!this.profileURL || this.profileURL.trim() === '') {
      this.errorMessage = 'Inserisci un URL valido.';
      return;
    }

    if (!this.isValidUrl(this.profileURL)) {
      this.errorMessage = 'Inserisci un URL valido (es. https://www.instagram.com/...)';
      return;
    }

    if (!this.isPlatformSupported(this.profileURL)) {
      const supportedNames = this.supportedPlatforms.map(p => p.name).join(', ');
      this.errorMessage = `⚠️ Piattaforma non supportata. Attualmente supportiamo: ${supportedNames}.`;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.dialogRef.close(this.profileURL);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private isValidUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  private isPlatformSupported(url: string): boolean {
    const urlLower = url.toLowerCase();
    return this.supportedPlatforms.some(platform =>
      platform.domains.some(domain => urlLower.includes(domain))
    );
  }

  detectPlatform(url: string): string | null {
    if (!url || url.trim() === '') return null;
    const urlLower = url.toLowerCase();
    for (const platform of this.supportedPlatforms) {
      if (platform.domains.some(domain => urlLower.includes(domain))) {
        return platform.name;
      }
    }
    return null;
  }

  getPlaceholder(url: string): string {
    if (!url || url.trim() === '') {
      return 'https://www.instagram.com/...';
    }
    const urlLower = url.toLowerCase();
    for (const platform of this.supportedPlatforms) {
      if (platform.domains.some(domain => urlLower.includes(domain))) {
        return platform.placeholder;
      }
    }
    return 'https://www.instagram.com/...';
  }

}
