import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
@Injectable()
export class MessagesService {
// Video 19:
// According to Vasco, subject will emit new values but we don't want errors$ to emit new values?? 
// Yet errors$ is public - needed for template.
// Vasco only wants to be able to subscribe to errors$.  Why?

  // I'm not used to seeing this pattern:
  private subject = new BehaviorSubject<string[]>([]);

  errors$: Observable<string[]> = this.subject.asObservable()
    .pipe(
      filter(messages => messages && messages.length > 0)
    );

  showErrors(...errors: string[]) {
    this.subject.next(errors);
  }

   // Why not just use erros$ as a new BehaviorSubject<string[]>([]) and 
   // then errors$.next(...) the new values in showErrors?
}
