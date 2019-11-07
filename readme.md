
# Elastic search

It's an angular component for generic usage.

## Installation

Download the component and add it into your module.

## Usage

```TypeScript
import { AppElasticComponent } from './app-elastic/app-elastic.component';

@NgModule({
  declarations: [
    AppComponent,
    ....,
    AppElasticComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    FileDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

//** in your html file"
 <app-elastic [options]="options" [placeHolder]=" place holder values"  [clearField]="clearField" [isError]="isError"
    (selectedResult)="selectProposalElasticResult($event)"></app-elastic>

##sample Object

    options.url = 'http://myelasticURL/test/';
    options.index = 'index';
    options.type = 'indextype';
    options.size = 20;
    options.contextField = 'firstIndex';
    options.debounceTime = 500;
    options.theme = 'red';
    options.width = '100%';
    options.fontSize = '12px';
    options.defaultValue = 'My search Text';
    options.formatString = 'firstIndex | secondIndex (thirdIndex)';
    options.errorMessage = 'Please fill the following mandatory field';
    options.fields = {
      firstIndex: {},
      secondIndex: {},
      thirdIndex: {},
      fourthIndex: {},
      fifthIndex: {},
    };
```

## Parameters
Name  | Description | Example | 
------------- | ------------- | -------------
(selectedResult)  | On mouse click function and close button event | (selectedResult)="yourFunction($event)"
Placeholder  | placeholder for search box| [placeHolder]=" place holder values" 
options  | pass as input for configuration | [options] ="yourOptions"
options.fields  | elastic indexed fields too be searched | options.fields ={firstIndex:{},secondIndex:{} }
options.url  | elastic end point to be used | options.url = 'your elastic URL'
options.index  | elastic index to be used | options.index = 'your index'
options.type  | elastic index type |  options.type = 'yourIndexType'
options.size  | maximum size of search return (optional) | options.size = '20'
options.contextField | field to be shown on search field on mousedown event  |  options.contextField = 'index field to be shown'
options.formatString  | format for the output (optional)  | options.formatString = 'firstindex | secondIndex'
options.theme | Custom color for the search output (optional) | options.theme = 'your color'
options.fontSize  | Font size of search result (optional)  | options.fontSize = '20px'
options.width  | Width  of search (optional) | options.width = '100%'
options.debounceTime  | Discard search values that take less than the specified time (optional)  | options.debounceTime = '100'
options.errorMessage	|To dispaly error message on isError condition true	| options.errorMessage = "Please fill the following mandatory field"
options.defaultvalue  | A default value to be shown on search field (optional)  | options.defaultValue = 'Your Default value'
isError | used to show error message | isError = true | false

## Other functionalities

if no 'formatString' is provided then the  default behaviour will be 'firstIndex | secondIndex| thirdIndex | ...'

To clear search field any time, use "clearField". The variable is passed in elasticsearch component intialization. Syntax is, this.clearField = new String('true');

If you need to update the 'defualtValue' after intailization use new refernce for your options

```TypeScript

this.options = Object.assign({}, this.options) 
this.clearField = new String('false');

```


The "(selectedResult)" will emit "null" on close button usage, mouse click on error and no result cases. Handle your functions accordingly.

On elastic error or no results the drop down will be showing "no results".

## Contributing
Pull requests are welcomed. For major changes, please open an issue first to discuss what you would like to change.
Please make sure to update tests as appropriate.

## Style changes
 For custom styling change the style inside app-elastic.component.css.

## License
