import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Course } from '../model/course';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private http: HttpClient) { }

  loadAllCourses(): Observable<Course[]> {
    //return this.http.get('/api/courses') //Compilation error: Expected type is not defined here
    return this.http.get<Course[]>('/api/courses') // get<Course[]> fixes the compilation error.
      .pipe(
        map(data => data['payload']),
        shareReplay()
        );
  }
}
