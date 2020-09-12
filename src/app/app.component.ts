import { Component, OnInit } from '@angular/core';
import {DataService} from './app-service'
import * as XLSX from 'xlsx'
import { Data } from '@angular/router';
import * as _ from 'lodash'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  title = 'my-app';
  value:number =0;
  lodash:any
  data:any[]
  groups:any[]
  groupedData:any[]

  constructor(private dataService:DataService) {
    this.lodash=_;
    this.data = this.dataService.getData();
    console.log(this.data); 
    this.groups = _.uniq(_.map(this.data, 'EngType'))
    console.log(this.groups);
    this.groupedData = _.groupBy(this.data,function(o){return o.EngType});
    console.log(this.groupedData);
    console.log(_.filter(this.groupedData["NPT"],function(o){return o.IsEngagementComplete=="Yes";}).length )
    console.log(_.filter([{ 'user': 'barney', 'age': 36, 'active': true }, { 'user': 'fred',   'age': 40, 'active': false }], function(o) { return !o.active; }).length);
    

  }

 
}