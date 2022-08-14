import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Message} from '../model/message';
import {tap} from 'rxjs/operators';
import { MessagesService } from './messages.service';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  showMessages = false;
  errors$: Observable<string[]>;

  constructor(public messagesService: MessagesService) {
    console.log('Created MessagesComponent');
   }


  ngOnInit() {
    this.errors$ = this.messagesService.errors$
      .pipe(
        tap(() => {
          // Remember, we have an initial value of an empty array.
          // We want to show the messages if there is only an empty array.
          this.showMessages = true;
        })
      );

  }


  onClose() {
    this.showMessages = false;
  }

}
