import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaQueryService implements OnDestroy {
  private matchMediaRef: MediaQueryList | null = null;
  private matchMediaSubject = new BehaviorSubject<boolean>(false);

  matchQuery(query: string): void {
    this.matchMediaRef = window.matchMedia(query);
    this.matchMediaSubject.next(this.matchMediaRef.matches);

    this.matchMediaRef.addEventListener('change', this.handleChange);
  }

  getMatchStatus(): Observable<boolean> {
    return this.matchMediaSubject.asObservable();
  }

  private handleChange = (e: MediaQueryListEvent) => {
    this.matchMediaSubject.next(e.matches);
  }

  ngOnDestroy(): void {
    this.matchMediaRef?.removeEventListener('change', this.handleChange);
  }
}
