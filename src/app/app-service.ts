import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import testingdata from '../data/testingdata.json';

@Injectable({ providedIn: 'root' })
export class DataService {
  getData(): any[] {
    return testingdata;
  }
}
