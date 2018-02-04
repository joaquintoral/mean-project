import { Component } from "@angular/core";

@Component({
    selector: 'app-messages',
    template: `
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <app-message-input></app-message-input>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <app-message-list></app-message-list>
            </div>
        </div>
    `
})
export class MessagesComponent {

}