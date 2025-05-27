import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; // Import DomSanitizer and SafeHtml

@Injectable({
  providedIn: 'root',
})
export class GlobalAlertService {
  // Change the message type to SafeHtml | string
  private messageSubject = new BehaviorSubject<{ message: SafeHtml | string; type: 'success' | 'danger' }>({
    message: '',
    type: 'success',
  });

  // Inject DomSanitizer
  private sanitizer = inject(DomSanitizer);

  // Update the return type to include SafeHtml
  getMessage(): Observable<{ message: SafeHtml | string; type: 'success' | 'danger' }> {
    return this.messageSubject.asObservable();
  }

  setMessage(message: string, type: 'success' | 'danger'): void {
    // Sanitize the message to allow HTML rendering
    const safeMessage = this.sanitizer.bypassSecurityTrustHtml(message);
    this.messageSubject.next({ message: safeMessage, type });
  }

  clearMessage(): void {
    this.messageSubject.next({ message: '', type: 'success' });
  }
}