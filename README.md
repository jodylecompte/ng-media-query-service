## MediaQueryService for Angular
Angular MediaQueryService is a lightweight Angular service designed to facilitate accessing media queries programatically and being able to subscribe to these
values for responsive props.

This library allows you to leverage the power and flexibility of CSS media queries directly in your TypeScript code. Ir simplifies the process of 
programatic media queries by providing a way to react to changes in media query match status in real-time, directly in your components. It eliminates the need for manual DOM manipulation or window resize event listeners, making your code cleaner and easier to understand.

I'll be honest. I'm working in an Angular shop after many years of React and I found myself missing the useMediaQuery hook and this was my effort to angularize it.
## Installation

```
$ npm install ng-midia-query-service
$ yarn add ng-midia-query-service
$ pnpm install ng-midia-query-service
```
## Usage

First, add `MediaQueryService` to the `providers` array of the module in which you want to consume it.

```typescript
import {MediaQueryService} from 'ng-media-query-service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [MediaQueryService],
  bootstrap: [AppComponent]
})

export class AppModule { }
```

## API Option #1 - Async Pipe
The cleaner option, in my opinion, is to make use of the async pipe in order to avoid manual subscription 
management in the component file. 

Component:

```typescript
import { Component, OnInit } from '@angular/core';
import { MediaQueryService } from 'ng-media-query-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  matchMobile$: Observable<boolean>;
  matchDesktop$: Observable<boolean>;
  matchTablet$: Observable<boolean>;

  constructor(private mediaQueryService: MediaQueryService) {}

  ngOnInit(): void {
    this.matchMobile$ = this.mediaQueryService.match('(max-width: 767px)');
    this.matchTablet$ = this.mediaQueryService.match('(min-width: 768px) and (max-width: 991px)');
    this.matchDesktop$ = this.mediaQueryService.match('(min-width: 992px)');
  }
}
```

Template:

```typescript 
<div>
  <p *ngIf="matchMobile$ | async">This is a mobile viewport</p>
  <p *ngIf="matchTablet$ | async">This is a tablet viewport</p>
  <p *ngIf="matchDesktop$ | async">This is a desktop viewport</p>
</div>
```

### API Approach 2: Managed Subscriptions
Alternatively, you can also manually subscribe in your component instead of using the async pipe.

Component:
```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MediaQueryService } from './path-to-your-media-query-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-viewport-status',
  templateUrl: './viewport-status.component.html'
})
export class ViewportStatusComponent implements OnInit, OnDestroy {
  matchMobile: boolean;
  matchDesktop: boolean;
  matchTablet: boolean;
  private subs: Subscription[] = [];

  constructor(private mediaQueryService: MediaQueryService) {}

  ngOnInit(): void {
    this.subs.push(
      this.mediaQueryService.match('(max-width: 767px)').subscribe(isMatched => {
        this.matchMobile = isMatched;
      })
    );

    this.subs.push(
      this.mediaQueryService.match('(min-width: 768px) and (max-width: 991px)').subscribe(isMatched => {
        this.matchTablet = isMatched;
      })
    );

    this.subs.push(
      this.mediaQueryService.match('(min-width: 992px)').subscribe(isMatched => {
        this.matchDesktop = isMatched;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
```

Template:
```typescript
<div>
  <p *ngIf="matchMobile">This is a mobile viewport</p>
  <p *ngIf="matchTablet">This is a tablet viewport</p>
  <p *ngIf="matchDesktop">This is a desktop viewport</p>
</div>
```