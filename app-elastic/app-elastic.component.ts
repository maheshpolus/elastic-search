
/**authour : Mahesh Sreenath V M
 * a common elastic search componet  currently only supports or condition for the Index feilds
 * visit https://github.com/maheshpolus/elastic-search for updates and documents
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
  tempSearchText = '';
  timer: any;
  results = [];
  counter = -1;
  isActive  = false;
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
      const url = this.options.url + this.options.index + '/' + this.options.type + '/' + '_search?size=' + (this.options.size || 20);
      this._appElasticService.search(url, this.query).then((rst: any) => {
        this._ref.markForCheck();
        this.isActive = true;
        this.counter = -1;
        const src = ((rst.hits || {}).hits || []).map((hit) => hit._source );
        const hgt = ((rst.hits || {}).hits || []).map((hit) => hit.highlight );
        if (this.options.formatString) {
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
    this.isActive = false;
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
    this.removeHighlight();
    this.counter >= 0 ? this.counter-- :  this.counter = document.getElementsByClassName('search-result-item').length - 1;
    this.addHighlight();
    this.updateSearchFeild();
  }
  /**
   * @param  {} event  used to update counter value for keyboard event listner and adds a highlight class
   */
  downArrowEvent(event) {
    event.preventDefault();
    this.removeHighlight();
    this.counter < document.getElementsByClassName('search-result-item').length - 1 ?  this.counter++ : this.counter = -1;
    this.addHighlight();
    this.updateSearchFeild();
  }
  /**
   * @param  {} event
   *  handles the click outside the result box updates counter and slear results
   */
  hideSearchResults() {
    this.isActive = false;
    this.results = [];
    this.counter = -1;
  }
  /** listens for enter key event . triggers the click on selected li
   */
  enterKeyEvent() {
    (document.getElementsByClassName('search-result-item')[this.counter] as HTMLInputElement).click();
    (document.activeElement as HTMLInputElement).blur();
    this.hideSearchResults();
  }
  /**
   * removes the highlight from the previous li node if true
   * updates the tempsearch value with user tped value for future refernce
   */
  removeHighlight() {
    const el = (document.getElementsByClassName('search-result-item')[this.counter] as HTMLInputElement);
    if (el) {
      el.classList.remove('highlight');
    } else {
      this.tempSearchText = this.searchText;
    }
  }
  /**
   * updates the li with 'highlight' class
   */
  addHighlight() {
    const el = (document.getElementsByClassName('search-result-item')[this.counter] as HTMLInputElement);
    if (el) {
      el.classList.add('highlight');
    }
  }
  /**
   * updates the search feild with temp value once user reaches the bootom or top of the list
   */
  updateSearchFeild() {
    this.counter === -1 || this.counter === document.getElementsByClassName('search-result-item').length ?
              this.searchText = this.tempSearchText :
              this.searchText = this.results[this.counter].value[this.options.contextField];
  }
}
