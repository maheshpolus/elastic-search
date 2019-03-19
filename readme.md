
# Elastic serach

It's an angular component for generic use

## Installation

download the component and add it into your module.

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
 <app-elastic [options]="options" [placeHolder]=" place holder values"  [clearField]="clearField"
    (selectedResult)="selectProposalElasticResult($event)"></app-elastic>

##sample Object

    options.url = 'http://myelasticURL/test/';
    options.index = 'index';
    options.type = 'indextype';
    options.size = 20;
    options.contextField = 'firstIndex';
    options.debounceTime = 500;
    opyions
    options.formatString = 'firstIndex | secondIndex (thirdIndex)';
    options.fields = {
      firstIndex: {},
      secondIndex: {},
      thirdIndex: {},
      fourthIndex: {},
      fifthIndex: {},
      status: {},
      sponsor: {}
    };
```

## Parameters
Name  | Description | Example | 
------------- | ------------- | -------------
(selectedResult)  | On mouse down function | (selectedResult)="yourFunction($event)"
Placeholder  | placeholder for serch box| [placeHolder]=" place holder values" 
options  | pass as input for configuration | [options] ="yourOptons"
options.fields  | elastic indexed fields too be serached | options.fields ={firstIndex:{},secondIndex:{} }
options.url  | elastic end point to be used | options.url = 'your elastic URL'
options.index  | elastic index to be used | optons.index = 'your index'
options.type  | elastic index type |  options.type = 'yourIndexType'
options.contextField | field to shown on mouse down event  |  options.contextField = 'index field to be shown'
options.formatString  |format for the output  | options.formatString = 'firstindex | secondIndex'
options.theme | Custom color for the search output | options.theme = 'your color'
options.fontSize  | Font size of search result  | options.fontSize = '20px'
options.width  | Width  of search result  | options.width = '100%'
options.debounceTime  | Discard search values that take less than the specified time  | options.debounceTime = '100'
options.defaultvalue  | A default value to shown on search field  | options.defaultValue = 'Your Default value'

## Other functionalities

To Clear search field any time use - clearField the variable passed in elastic component intialization

this.clearField = new String('true');


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
Please make sure to update tests as appropriate.

## style Change
 for custom styling change the stye inside app-elastic.component.css

## License