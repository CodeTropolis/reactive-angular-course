import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, } from 'rxjs';
import { delay, filter, map, tap, concatMap, finalize } from 'rxjs/operators';

@Injectable()
export class LoadingService {

  private loadingSubject = new BehaviorSubject<boolean>(false);

  // This is public as it is used in this componet's template.
  // This seems a bit overly complicated...
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() {console.log("Loading service created...") }

  // May seem compicated but I like this approach - being able to pass in any observable.
  // A method that takes in any type of observable - not just related to courses$
  showLoaderUntilCompleted<T>(obs$: Observable<T>):Observable<T> {
    return of(null) // null because we need something to start with
    .pipe(
      tap(() => this.loadingOn()),
      concatMap(() => obs$),
      finalize(() => this.loadingOff())
    );
  }

  loadingOn(){
    this.loadingSubject.next(true);
  }

  loadingOff(){
    this.loadingSubject.next(false);
  }
  
}
