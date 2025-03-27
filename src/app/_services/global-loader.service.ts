import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalLoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  isLoading(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  showLoader(): void {
    this.loadingSubject.next(true);
  }

  hideLoader(): void {
    this.loadingSubject.next(false);
  }
}
