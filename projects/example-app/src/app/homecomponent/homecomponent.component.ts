import { Component , ViewChild, ElementRef, OnInit} from '@angular/core';
import { of } from "rxjs";
import { debounceTime, map, distinctUntilChanged, filter} from "rxjs/operators";
import { fromEvent } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
import { DomSanitizer } from '@angular/platform-browser';
const APIKEY = "bdd5c75f";

const PARAMS = new HttpParams({
  fromObject: {
    action: "opensearch",
    format: "json",
    origin: "*"
  }
});
@Component({
  selector: 'app-homecomponent',
  templateUrl: './homecomponent.component.html',
  styleUrls: ['./homecomponent.component.css']
})
export class HomecomponentComponent implements OnInit{
  @ViewChild('movieSearchref', { static: true })
  movieSearchref!: ElementRef;
  apiResponse: any ={};
  isSearching: boolean = false;
  movieDetails: any;
  name:string='';
  isShowDiv: boolean = false;
  url:string = 'http://localhost:4201/';
  urlSafe: any;
  searchText:string =''
  public showMe = false;

  constructor(
    private httpClient: HttpClient,public sanitizer: DomSanitizer
  ) {
    this.isSearching = false;
    this.apiResponse = [];
    this.movieDetails = [];
   // console.log(this.movieSearchInput);
  }

  ngOnInit() {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    fromEvent(this.movieSearchref.nativeElement, 'keyup').pipe(

      // get value
      map((event: any) => {
        return event.target.value;
      })
      // if character length greater then 2
      , filter(res => res.length > 2)

      // delay for 1 miliseconds
      , debounceTime(1000)

      // If previous query is diffent from current   
      , distinctUntilChanged()

      // subscription for response
    ).subscribe((text: string) => {
      this.isSearching = true;
      this.showMe = false
      this.searchGetCall(text).subscribe((res) => {
        console.log('res', res);
        this.isSearching = false;
        this.showMe = true;

        this.apiResponse = res;
       // const message = res;
         parent.postMessage(this.apiResponse,'http://localhost:4201/');
       }, (err) => {
        this.isSearching = false;
        console.log('error', err);
      });
    });
  }


  searchGetCall(term: string) {
    if (term === '') {
      return of([]);
    }
    
    return this.httpClient.get('http://www.omdbapi.com/?s=' + term + '&apikey=' + APIKEY, { params: PARAMS.set('search', term) });
  }

}
