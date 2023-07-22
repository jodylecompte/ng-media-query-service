## MediaQueryService for Angular
Angular MediaQueryService is a lightweight Angular service designed to facilitate accessing media queries programatically and being able to subscribe to these
values for responsive props.

This library allows you to leverage the power and flexibility of CSS media queries directly in your TypeScript code. Ir simplifies the process of 
programatic media queries by providing a way to react to changes in media query match status in real-time, directly in your components. It eliminates the need for manual DOM manipulation or window resize event listeners, making your code cleaner and easier to understand.


## How It Works
Under the hood, Angular MediaQueryService uses the window.matchMedia method to evaluate a media query string, and provides a BehaviorSubject that emits the current match status. You can subscribe to this BehaviorSubject in your components and react to changes in the match status as the viewport or media features change.

The MediaQueryService exposes a matchQuery method which accepts a media query string (exactly as it would be written in CSS) and creates a MediaQueryList object. It then sets up an event listener on this object to listen for changes in the match status, updating the BehaviorSubject whenever the match status changes.

## Usage

```
$ npm install ng-media-query-service
```

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

Inside the component you wish to subscribe to a media query match, simply create call `MediaQueryService.matchQuery()` and provide in a valid CSS media query.

Then you can subscribe to `MediaQueryService.getMatchStatus()` to either consume the boolean
value directly or use it to prescribe value to other items;

```typescript
import { Component, OnInit } from '@angular/core';
import { Observable, Subscription} from 'rxjs';

import { MediaQueryService } from './media.service';

@Component({
  selector: 'app-root',
  template: `<div>
    <div *ngIf="isSmallScreen">
      Screen is small (< 600px)
    </div>
    <div *ngIf="!isSmallScreen">
      Screen is not small (> 600px)
    </div>
  </div>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'testapp';
  isSmallScreen = false;
  subscription: Subscription | null = null;

  constructor(private mediaQueryService: MediaQueryService) { }

  ngOnInit(): void {
    this.mediaQueryService.matchQuery('(max-width: 600px)');
    this.subscription = this.mediaQueryService.getMatchStatus().subscribe(
      matches => this.isSmallScreen = matches
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}

```

