import { Component, OnInit } from '@angular/core';
import { DataService } from './app-service';
import * as XLSX from 'xlsx';
import { Data } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'my-app';
  value: number = 0;
  lodash: any;
  data: any[];
  groups: any[];
  groupedData: any[];
  testerselected :string="";

  constructor(private dataService: DataService) {
    this.testerselected='';
    this.lodash = _;
    this.data = this.dataService.getData();
    console.log(this.data);
    this.groups = _.uniq(_.map(this.data, 'EngType'));
    console.log(this.groups);
    this.groupedData = _.groupBy(this.data, function (o) {
      return o.EngType;
    });
    console.log(this.groupedData);
    console.log(
      _.filter(this.groupedData['NPT'], function (o) {
        return o.IsEngagementComplete == 'Yes';
      }).length
    );
    console.log(
      _.filter(
        [
          { user: 'barney', age: 36, active: true },
          { user: 'fred', age: 40, active: false },
        ],
        function (o) {
          return !o.active;
        }
      ).length
    );
  }

  getTestingStatusTotal(Group: string, TestingStatus: string): any {
    switch (TestingStatus) {
      case 'EngComplete':
        return this.lodash.filter(this.groupedData[Group], function (o) {
          return o.IsEngagementComplete == 'Yes';
        }).length;
      case 'InProgress':
        return this.lodash.filter(this.groupedData[Group], function (o) {
          return o.IsEngagementComplete == 'No' && o.IsTestingComplete == 'No';
        }).length;

      case 'TestingCompleteEngagementNot':
        return this.lodash.filter(this.groupedData[Group], function (o) {
          return o.IsEngagementComplete == 'No' && o.IsTestingComplete == 'Yes';
        }).length;
      default:
        return 0;
    }
  }

  sortAlphaNum(a, b) {
    return a.localeCompare(b, 'en', { numeric: true });
  }

  GetTestingStatus(tester: string, group: string) {
    console.log(this);
    let testerselct =this.testerselected;
    let list = _.filter(this.data, function (o) {
      return (o.EngType == group && (_.isEmpty(tester) ? (_.isEmpty(testerselct)?true:testerselct==o.Tester): tester == o.Tester));
    });

    console.log('get testing status');
    console.log(this.testerselected);
    

    console.log(_.isEmpty(tester));
    console.log('list for tester: '+ tester + ' group:'+group);
    console.log(list);

    let data = {
      AEngagementComplete: _.filter(list, function (o) {
        return o.IsEngagementComplete=="Yes";
      }).length,
      BTestingInProgress: _.filter(list, function (o) {
        return o.IsTestingComplete=="No";
      }).length,
      CTestingCompleteEngagementIsNot: _.filter(list, function (o) {
        return o.IsTestingComplete=="Yes" && o.IsEngagementComplete=="No";
      }).length,
    };

    

    console.log('Testing Status');
    console.log(data);
    return data;
  }

  clickedTester(tester:string)
  {
    console.log('tester:'+tester);
    console.log('selectedtester:'+this.testerselected);
    if(this.testerselected==tester)
    {
      console.log('same');
      this.testerselected="";
    }
    else{
      this.testerselected=tester;
    }
    
  }

  GetTesters() {
    let data = _.map(_.uniqBy(this.data,'Tester'),'Tester')

    console.log('Testers');
    console.log(data);
    return data;
  }

  GetTesterData() {
    let data = _.chain(this.data)
      .groupBy('Tester')
      .map((value, key) => ({
        Tester: key,
        Data: {
          NPTTotal: _.filter(value, function (o) {
            return o.EngType == 'NPT';
          }).length,    
        },
      }))
      .value();
      
    console.log(data);
    return data;
  }

  GetDaysInTesting()
  {
    let tester = this.testerselected;

    let list = _.filter(this.data, function (o) {
      return (_.isEmpty(tester) ? true: tester == o.Tester);
    });

    return (_.sumBy(list,function(o){return o.DaysInTestingStatus})/list.length).toFixed(2);


  }
  GetDeviation()
  {
    let tester = this.testerselected;

    let list = _.filter(this.data, function (o) {
      return (_.isEmpty(tester) ? true: tester == o.Tester);
    });

    return (_.sumBy(list,function(o){return o['Deviation of D&E']})/list.length).toFixed(2);



    

  
  
  
  
  }


  getColor(tester:string)
  {
    if(this.testerselected==tester)
    {
      return 'grey';
    }
    else{
      return 'white';
    }
  }

  getOpacity(tester:string)
  {
    if(_.isEmpty(this.testerselected) || this.testerselected==tester)
    {
      return 1;
    }
    else{
      return 0.5;
    }
  }
}
