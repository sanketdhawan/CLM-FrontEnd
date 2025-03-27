import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalAlertService {
  private messageSubject = new BehaviorSubject<{ message: string; type: 'success' | 'danger' }>({
    message: '',
    type: 'success',
  });

  getMessage(): Observable<{ message: string; type: 'success' | 'danger' }> {
    return this.messageSubject.asObservable();
  }

  setMessage(message: string, type: 'success' | 'danger'): void {
    this.messageSubject.next({ message, type });
  }

  clearMessage(): void {
    this.messageSubject.next({ message: '', type: 'success' });
  }
}
