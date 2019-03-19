
/**authour : Mahesh Sreenath V M
 * a common elastic search componet  currently only supports or condition for the feilds
 * options - input
 * selectedResult- output emits the selected output as event listen for this event in the component which use
 * app-elastic-component
 * options => index - index to be searched
 * fields => all the index fileds you want to search for the value
 * debouncetime => delay btn the user event triggers search call
 * url => url for the elastic host with ip and port
 * type => index type for the given search
 * contextFIeld => the field that should be used as serchText value once user selects the reuslt
 * size => the size of the search result,
 * theme => color theme of the es output(default fibi)
 * fontSize => li fontsize
 * defaultValue => Which can be used to show a default value on the serch field
 */
import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { AppElasticService } from './app-elastic.service';

@Component({
  selector: 'app-elastic',
  templateUrl: './app-elastic.component.html',
  styleUrls: ['./app-elastic.component.css'],
  providers: [AppElasticService]
})
export class AppElasticComponent implements OnChanges, OnInit {

  @Input() options: any = {};
  @Input() placeHolder;
  @Input() clearField;
  @Input() defaultValue;
  @Output() selectedResult: EventEmitter<any> = new EventEmitter<any>();
  searchText = '';
  results = [];
  timer: any;
  active = false;
  query =  {
    query: {
        bool: {
            should: []
        }
    },
    sort: [{
        _score: {
            order: 'desc'
        }
    }],
    highlight: {
        pre_tags: ['<b>'],
        post_tags: ['</b>'],
    }
  };
  constructor(private _appElasticService: AppElasticService) { }
  ngOnInit() {
    this.searchText = this.options.defaultValue;
  }
  ngOnChanges() {
    this.clearField = '' + this.clearField;
    if (this.clearField === 'true') {
      this.searchText = '';
      this.results = [];
    }
  }

  /**makes a elastic host connection and the result is formmatted in string of label with bold tags for matching
   * fields. use label for showing as it outputs html tag.injected it as innerhtml on html
   * a timer is used to avoid multiple calls to server the call only occurs if the user doesn't trigger the event for
   * 500 millisecods
   */
  getElasticResult() {
    this.results = [];
    clearTimeout(this.timer);
     this.timer = setTimeout(() => {
      this.searchText.trim();
      this.querybuilder();
      const url = this.options.url + this.options.index + '/' + this.options.type + '/' + '_search?size=' + this.options.size;
      this._appElasticService.search(url, this.query).then((result: any) => {
        const source    = ((result.hits || {}).hits || []).map((hit) => hit._source );
        const highlight = ((result.hits || {}).hits || []).map((hit) => hit.highlight );
        source.forEach((element, index) => {
          let label = this.options.formatString;
          Object.keys(this.options.fields).forEach(key => {
            label =  label.replace(key, (highlight[index][key] || source[index][key]));
          });
        label = label.replace(/null/g, '');
        this.results.push({'label': label, 'value': element});
        });
        if (!this.results.length) {
          this.results.push({'label': 'No results'});
        }
      }, error => {
        this.results.push({'label': 'No results'});
      });
    }, this.options.debounceTime || 500);
  }

  /**
   * dynamically build the query for elastic search uses the feilds from the option input and returns a
   * newly generated query for given index and  fields with new updated input value
   */
  querybuilder() {
    this.query.highlight['fields'] = this.options.fields;
    let condition: any = {};
    this.query.query.bool.should = [];
    Object.keys(this.options.fields).forEach(field => {
      condition = Object.assign({} , condition);
      condition.match = {};
      condition.match[field] = { query: this.searchText, operator: 'or'};
      this.query.query.bool.should.push(condition);
    });
  }
  emitSelectedObject(value) {
    this.active = false;
    if (value) {
      this.selectedResult.emit(value);
      this.searchText = value[this.options.contextField] || this.searchText;
    } else {
      this.searchText = '';
      this.selectedResult.emit(null);
    }
    this.results = [];
  }
}
