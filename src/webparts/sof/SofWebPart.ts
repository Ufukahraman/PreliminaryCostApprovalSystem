import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
 
} from '@microsoft/sp-webpart-base';
import { IPropertyPaneConfiguration ,PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'SofWebPartStrings';
import Sof from './components/Sof';
import { ISofProps } from './components/ISofProps';

export interface ISofWebPartProps {
  description: string;
}

export default class SofWebPart extends BaseClientSideWebPart<ISofWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ISofProps> = React.createElement(
      Sof,
      {
        description: this.properties.description,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
