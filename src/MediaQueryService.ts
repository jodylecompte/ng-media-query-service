import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaQueryService implements OnDestroy {
  private matchMediaRefs: Record<string, MediaQueryList> = {};
  private matchMediaSubjects: Record<string, BehaviorSubject<boolean>> = {};

  match(query: string): Observable<boolean> {
    if (!this.matchMediaRefs[query]) {
      const matchMediaRef = window.matchMedia(query);
      const matchMediaSubject = new BehaviorSubject<boolean>(matchMediaRef.matches);

      matchMediaRef.addEventListener('change', (e: MediaQueryListEvent) => {
        matchMediaSubject.next(e.matches);
      });

      this.matchMediaRefs[query] = matchMediaRef;
      this.matchMediaSubjects[query] = matchMediaSubject;
    }

    return this.matchMediaSubjects[query].asObservable();
  }

  ngOnDestroy(): void {
    for (const query in this.matchMediaRefs) {
      if (this.matchMediaRefs.hasOwnProperty(query)) {
        this.matchMediaRefs[query].removeEventListener('change', this.handleChange);
      }
    }
  }

  private handleChange = (e: MediaQueryListEvent) => {
    const query = e.media;
    this.matchMediaSubjects[query].next(e.matches);
  }
}
