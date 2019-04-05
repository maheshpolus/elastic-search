
/**authour : Mahesh Sreenath V M
 * a common elastic search componet  currently only supports or condition for the Index feilds
 */
import { Component, Input, Output, EventEmitter, OnChanges, OnInit,  ChangeDetectorRef } from '@angular/core';
import { AppElasticService } from './app-elastic.service';

@Component({
  selector: 'app-elastic',
  templateUrl: './app-elastic.component.html',
  styleUrls: ['./app-elastic.component.css'],
  providers: [AppElasticService]
})
export class AppElasticComponent implements OnChanges, OnInit {

  @Input()  options: any = {};
  @Input()  placeHolder;
  @Input()  clearField;
  @Input()  defaultValue;
  @Output() selectedResult: EventEmitter<any> = new EventEmitter<any>();
  searchText = '';
  timer: any;
  results = [];
  counter = -1;
  active  = false;
  query   = { query: { bool: { should: [] }},
    sort: [{ _score: { order: 'desc'}}],
    highlight: { pre_tags: ['<b>'], post_tags: ['</b>']}
  };
 
  constructor(private _appElasticService: AppElasticService, private _ref: ChangeDetectorRef ) { }

  ngOnInit() {
    this.searchText = this.options.defaultValue || '';
  }
  
  ngOnChanges() {
    this.clearField = '' + this.clearField;
    if (this.clearField === 'true') {
      this.searchText = '';
      this.results = [];
    }
    this.searchText = this.options.defaultValue || '';
  }
  /**makes a elastic host connection and the result is formmatted in string of label with bold tags for matching fields
   */
  getElasticResult() {
    this.results = [];
    clearTimeout(this.timer);
     this.timer = setTimeout(() => {
      this.searchText.trim();
      this.querybuilder();
      const url = this.options.url + this.options.index + '/' + this.options.type + '/' + '_search?size=' + this.options.size;
      this._appElasticService.search(url, this.query).then((rst: any) => {
        this._ref.markForCheck();
        this.active = true;
        this.counter = -1;
        (document.getElementById('overlay-elastic') as HTMLInputElement).style.display = 'block';
        const src = ((rst.hits || {}).hits || []).map((hit) => hit._source );
        const hgt = ((rst.hits || {}).hits || []).map((hit) => hit.highlight );
        if(this.options.formatString) {
          src.forEach((el, i) => {
            let lbl = this.options.formatString;
            Object.keys(this.options.fields).forEach(k => { lbl = lbl.replace(k, (hgt[i][k] || src[i][k])); });
          lbl = lbl.replace(/null/g, '');
          this.results.push({'label': lbl, 'value': el});
        });
        } else {
          src.forEach((el, i) => {
            let lbl = '';
            Object.keys(this.options.fields).forEach(k => {
              lbl =  ((hgt[i][k] || src[i][k]) != null) ? lbl + (hgt[i][k] || src[i][k]) + '|' : lbl + '';
            });
          this.results.push({'label': lbl.slice(0, -1), 'value': el});
          });
        }
        if (!this.results.length) {
          this.results.push({'label': 'No results'});
        }
      }, error => {this.results.push({'label': 'No results'});
      });
    }, this.options.debounceTime || 500);
  }
  /**
   * dynamically build the query for elastic search
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
  /**
   * @param  {} value emit results on key enter mouse click to parent components
   */
  emitSelectedObject(value) {
    (document.getElementById('overlay-elastic') as HTMLInputElement).style.display = 'none';
    this.active = false;
    this.counter = -1;
    if (value) {
      this.selectedResult.emit(value);
      this.searchText = value[this.options.contextField] || this.searchText;
    } else {
      this.searchText = '';
      this.selectedResult.emit(null);
    }
    this.results = [];
  }
  /**
   * @param  {} event used to update counter value for keyboard event listner
   */
  upArrowEvent(event) {
    event.preventDefault();
    if (this.counter > 0) {
      this.counter--;
      (document.getElementsByClassName('search-result-item')[this.counter] as HTMLInputElement).focus();
    } else {
      this.counter = -1;
      (document.getElementById('searchBox') as HTMLInputElement).focus();
    }
  }
  /**
   * @param  {} event  used to update counter value for keyboard event listner
   */
  downArrowEvent(event) {
    event.preventDefault();
    if (this.counter < document.getElementsByClassName('search-result-item').length - 1) {
      this.counter++;
      (document.getElementsByClassName('search-result-item')[this.counter] as HTMLInputElement).focus();
    }
  }
  /** handles the click outside the result box updates counter and slear results
   */
  hideSearchResults(event) {
    event.preventDefault();
    (document.getElementById('overlay-elastic') as HTMLInputElement).style.display = 'none';
    this.active = false;
    this.results = [];
    this.counter = -1;
  }
}
