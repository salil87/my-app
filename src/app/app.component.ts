import { Component, OnInit } from '@angular/core';
import { DataService } from './app-service';
import * as _ from 'lodash';
import * as color from 'color';

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
  testerselected: string = '';
  max: number;

  constructor(private dataService: DataService) {
    this.testerselected = '';
    this.lodash = _;
    this.data = this.dataService.getData();
    this.groups = _.uniq(_.map(this.data, 'EngType')).sort();
    this.max = 0;
    this.GetTesters().forEach((element) => {
      this.groups.forEach((grp) => {
        var data = this.GetTestingStatistics(element, grp);
        this.max = Math.max(
          data.AEngagementComplete,
          data.BTestingInProgress,
          data.CTestingCompleteEngagementIsNot,
          this.max
        );
      });
    });


    this.groupedData = _.groupBy(this.data, function (o) {
      return o.EngType;
    });
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

  GetTestingStatistics(tester: string, group: string) {
    let testerselct = this.testerselected;
    let list = _.filter(this.data, function (o) {
      return (
        (_.isEmpty(group) ? true : o.EngType == group) &&
        (_.isEmpty(tester)
          ? _.isEmpty(testerselct)
            ? true
            : testerselct == o.Tester
          : tester == o.Tester)
      );
    });

    let data = {
      AEngagementComplete: _.filter(list, function (o) {
        return o.IsEngagementComplete == 'Yes';
      }).length,
      BTestingInProgress: _.filter(list, function (o) {
        return o.IsTestingComplete == 'No';
      }).length,
      CTestingCompleteEngagementIsNot: _.filter(list, function (o) {
        return o.IsTestingComplete == 'Yes' && o.IsEngagementComplete == 'No';
      }).length,
      DTotal: list.length,
    };

    return data;
  }

  clickedTester(tester: string) {
    if (this.testerselected == tester) {
      this.testerselected = '';
    } else {
      this.testerselected = tester;
    }
  }

  GetTesters() {
    let data = _.map(_.uniqBy(this.data, 'Tester'), 'Tester').sort(this.sortAlphaNum);

    return data;
  }

  GetDaysInTesting() {
    let tester = this.testerselected;

    let list = _.filter(this.data, function (o) {
      return _.isEmpty(tester) ? true : tester == o.Tester;
    });

    return (
      _.sumBy(list, function (o) {
        return o.DaysInTestingStatus;
      }) / list.length
    ).toFixed(2);
  }
  GetDeviation() {
    let tester = this.testerselected;

    let list = _.filter(this.data, function (o) {
      return _.isEmpty(tester) ? true : tester == o.Tester;
    });

    return (
      _.sumBy(list, function (o) {
        return o['Deviation of D&E'];
      }) / list.length
    ).toFixed(2);
  }

  getColor(tester: string) {
    if (this.testerselected == tester) {
      return 'grey';
    } else {
      return 'white';
    }
  }

  getShadeofBlue(ratio: number) {

    return color('rgb(200, 220, 255)')
      .darken(ratio / this.max)
      .hex();
  }

  getOpacity(tester: string) {
    if (_.isEmpty(this.testerselected) || this.testerselected == tester) {
      return 1;
    } else {
      return 0.5;
    }
  }

  getTotalColor(key: string) {
    switch (key) {
      case 'AEngagementComplete':
        return 'green';
      case 'BTestingInProgress':
        return 'red';
      case 'CTestingCompleteEngagementIsNot':
        return 'orange';
      default:
        return '';
    }
  }

  setMyStyle() {
    let styles = {
      'background-image': ' linear-gradient(to right,'+this.getShadeofBlue(0)+','+this.getShadeofBlue(this.max)+')',

    };
    return styles;
  }
}
