import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'gettingStarted';


//   @HostListener('window:message',['$event'])
// onMessage(e:any)
// {
// console.log(e);
// }
}
window.addEventListener('message', receiveMessage, false);

    function receiveMessage(event:any) {
      if (event.origin === 'http://localhost:4201') {
        console.log('http://localhost:4201/' , event.data);
      }
    }
