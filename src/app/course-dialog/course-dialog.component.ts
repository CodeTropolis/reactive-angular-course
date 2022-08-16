import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css'],
    // Because this component is opened by the Material framework, it exists in a
    // completely different component tree than the home component.
    // Therefore, to use the loading service, we need to provide it here. Well, this would allow us to 
    providers: [LoadingService, MessagesService] // This service will be available to this component and its children.
    // We now have two instances of the LoginService and MessagesService running. 

    // Accoring to Vasco (answered my question) in Q&A, Lecture 16:
    // This is because the global loading indicator will overlap the whole screen and 
    // block any clicks while it's on, and that indicator is quite big and is in the 
    // center of the screen. For loading a small table, or for loading multiple tables separately, 
    // you might want several separate loading indicators that show up aligned at the center of each table, and 
    // that don't block clicks on the screen.
})
export class CourseDialogComponent implements AfterViewInit {

    form: FormGroup;
    course:Course;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course:Course,
        private coursesService: CoursesService,
        private loadingService: LoadingService,
        private messageService: MessagesService
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
        .pipe(
            catchError(err => {
                const message = "Could not save course. Please try again later.";
                console.log(message, err);
                this.messageService.showErrors(message);
                return throwError(err); // Replaces observable at line 53.
            })
        );
      this.loadingService.showLoaderUntilCompleted(saveCourse$)
        .subscribe(
            (val) => this.dialogRef.close(val),
        );
    }

    close() {
        this.dialogRef.close();
    }

}
