import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // These services will be available to this component and its children.
  // But will not be available to global singletons such as coursesStore. 
  //providers: [LoadingService, MessagesService] 
  // So instead we pass them to the providers array in the app.module.ts file.
})
export class AppComponent implements  OnInit {

    constructor() {

    }

    ngOnInit() {


    }

  logout() {

  }

}
