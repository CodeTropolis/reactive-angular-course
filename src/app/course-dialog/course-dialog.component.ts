import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../loading/loading.service';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css'],
    // Because this component is opened by the Material framework, it exists in a
    // completely different component tree than the home component.
    // Therefore, to use the loading service, we need to inject it into the component.
    //providers: [LoadingService] // This service will be available to this component and its children.],
    // We now have two instances of the LoginService running. 
    // This is a problem because we want to use the same instance across the app.
    // Solved by adding <loading> to the course-dialog.component.html file.
    // I don't think this is the best solution, but it is per the Udemy tutorial.
    // Why not make it @Injectable({providedIn: 'root'}) ?
    // Still using <loading> in the course-dialog.component.html file.
})
export class CourseDialogComponent implements AfterViewInit {

    form: FormGroup;

    course:Course;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course:Course,
        private coursesService: CoursesService,
        private loadingService: LoadingService
        ) {

        this.course = course;

        this.form = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription,Validators.required]
        });

    }

    ngAfterViewInit() {

    }

    save() {
      const changes = this.form.value;
      const saveCourse$ = this.coursesService.saveCourse(this.course.id, changes)
      this.loadingService.showLoaderUntilCompleted(saveCourse$)
        .subscribe(
            (val) => this.dialogRef.close(val),
        );
    }

    close() {
        this.dialogRef.close();
    }

}
