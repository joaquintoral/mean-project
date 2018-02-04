import { Routes, RouterModule } from '@angular/router';
import { MessagesComponent } from './messages/messages.component';
import { AuthenticationComponent } from './auth/authentication.component';
import { AUTH_ROUTES } from './auth/auth.routes';

const APP_ROUTES: Routes = [
    // Use / to connect the path to the root URI (localhost/messages). without / will include it like this localhost/user/messages
    // (localhost/<-there's something here->messages). Add pathMatch to make sure it matches 
    // It also makes sure that it will only redirect when you visit '', not any other path/route
    { path: '', redirectTo: '/messages', pathMatch: 'full' },
    { path: 'messages', component: MessagesComponent },
    { path: 'auth', component: AuthenticationComponent, children: AUTH_ROUTES }
];

export const routing = RouterModule.forRoot(APP_ROUTES);