
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
options  | pass as input for configuration | [options] ="yourOptons"
options.fields  | elastic indexed fields too be serached | options.fields ={firstIndex:{},secondIndex:{} }
options.url  | elastic end point to be used | options.url = 'your elastic URL'
options.index  | elastic index to be used | optons.index = 'your index'
options.type  | elastic index type |  options.type = 'yourIndexType';
options.contextField | field to shown on searh on mouse down  |  options.contextField = 'index field to be shown';
options.formatString  |format for the output  | options.formatString = 'firstindex | secondIndex';
options.theme | Custom color for the search output | options.theme = 'your color'
options.fontSize  | the font size of serch result  | options.fontSize = '20px'
options.width  | the width  of serch result  | options.width = '100%'
options.debounceTime  | Discard serch values that take less than the specified time  | options.debounceTime = '100'
## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
Please make sure to update tests as appropriate.

## stle Change
 for ustom styling change the stye inside app-elastic.component.css

## License