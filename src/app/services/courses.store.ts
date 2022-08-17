import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { Course, sortCoursesBySeqNo } from "../model/course";

@Injectable({
    providedIn: "root"
})
export class CoursesStore {

    // Vasco likes to define custom observables. 
    private subject = new BehaviorSubject<Course[]>([]);
    courses$: Observable<Course[]> = this.subject.asObservable();
    // "The ability to emit new values is encapsulated and kept private inside this CoursesStore."
    // So we can only 'next()' to the subject and only do that within this class.
    // We only want consumers of courses$ to be able to subscribe to it.
    // 'Nexting' to courses$ is not possible.

    constructor(
        private http: HttpClient,
        private loading: LoadingService,
        private messages: MessagesService
    ) { 
        console.log('CoursesStore created');
        this.loadAllCourses(); // This will only happen once during the app lifecycle.
    }

    private loadAllCourses() {
       const loadCourses$ = this.http.get<Course[]>('/api/courses')
        .pipe(
            map(repsonse => repsonse['payload']),
            catchError(err => {
                const message = "Could not load courses";
                this.messages.showErrors(message,err);
                console.log(message,err);
                return throwError(err);
            }),
            tap(courses => this.subject.next(courses))
        )
        this.loading.showLoaderUntilCompleted(loadCourses$)
            .subscribe();
    }

    filterByCategory(category:string): Observable<Course[]>{
        return this.courses$.pipe(
            map(courses => courses.filter(course => course.category === category)
            // According to Vasco, we pass a ref to the function, not the function itself 
            // "The libraries will then call the functions with the multiple arguments, but not us.""
                .sort(sortCoursesBySeqNo)) 
        );
    }

}