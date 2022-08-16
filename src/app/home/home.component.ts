import {Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;


  constructor(
    private coursesService: CoursesService, 
    private loadingService: LoadingService, 
    private messagesService: MessagesService,
    ) {
  }

  ngOnInit() {
   this.reloadCourses();
  }

  reloadCourses() {
    //this.loadingService.loadingOn();
    const courses$ = this.coursesService.loadAllCourses()
    .pipe(
      map(courses => courses.sort(sortCoursesBySeqNo)),
      catchError(err => {
        const message = "Error loading courses";
        this.messagesService.showErrors(message);
        console.log(message, err);
        return throwError(err); // Return a new observable that contains the error.
      }),
      // finalize is a RxJS operator that will be executed after the observable is completed or when an error occurs.
      //finalize(() => this.loadingService.loadingOff()) 
    );

    // Simplified API for loading courses (any observable).
    // This, visually, seems a bit odd but still is intereting. 
    // On the fence about this as the above code is more readable.
    const loadCourses$ = this.loadingService.showLoaderUntilCompleted(courses$);

    this.beginnerCourses$ = loadCourses$
      .pipe(
        map(courses => courses.filter(course => course.category === 'BEGINNER'))
        );

    this.advancedCourses$ = loadCourses$ 
      .pipe(
        map(courses => courses.filter(course => course.category === 'ADVANCED'))
        );
  }

  
}




