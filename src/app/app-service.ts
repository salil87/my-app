import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import testingdata from '../data/testingdata.json'




@Injectable({ providedIn: 'root' })
export class DataService {


 


  /** GET heroes from the server */
  getData():any[] {

    console.log(testingdata);
    return testingdata;
    
     
  }

}