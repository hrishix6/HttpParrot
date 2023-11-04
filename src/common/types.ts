interface FormItem {
  id: string;
  name: string;
  value: string;
  enabled: boolean;
}

export type QueryItem = FormItem;

export type RequestMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'
  | 'options'
  | 'head';

export type InsertQueryItem = Pick<QueryItem, 'name' | 'value'>;

export type UpdateQueryItemName = Pick<QueryItem, 'id' | 'name'>;

export type UpdateQueryItemValue = Pick<QueryItem, 'id' | 'value'>;

export type UpdateQueryItemEnabled = Pick<QueryItem, 'id'>;

export interface HeaderItem extends FormItem { }
export interface ResponseHeader {
  name: string;
  value: string;
}

export type InsertHeader = Pick<HeaderItem, 'name' | 'value'>;

export type UpdateHeaderName = Pick<HeaderItem, 'id' | 'name'>;

export type UpdateHeaderValue = Pick<HeaderItem, 'id' | 'value'>;

export type UpdateHeaderEnabled = Pick<HeaderItem, 'id'>;

export interface FormDataItem extends FormItem { }

export type InsertFormDataItem = Pick<FormDataItem, 'name' | 'value'>;

export type UpdateFormDataItemName = Pick<FormDataItem, 'id' | 'name'>;

export type UpdateFormDataItemValue = Pick<FormDataItem, 'id' | 'value'>;

export type UpdateFormDataItemEnabled = Pick<FormDataItem, 'id'>;

export type SupportedBodyType =
  | 'formdata'
  | 'json'
  | 'xml'
  | 'url_encoded'
  | 'text';

export interface RequestModel {
  id: string;
  method: RequestMethod;
  name: string;
  url: string;
  query: QueryItem[];
  headers: HeaderItem[];
  triggered: number;
  created?: number;
  bodytype?: SupportedBodyType;
  formItems?: FormDataItem[];
  enableTextBody?: boolean;
  textBody?: string;
  collectionId: string;
}


export interface ResponseModel {
  mimeType: string;
  status: number;
  statusText: string;
  size: number;
  time: number;
  body: any;
  contentType: string;
  headers: ResponseHeader[];
  ok: boolean;
}

export interface CollectionVariable extends FormItem { }

export type InsertCollectionVariable = Pick<FormDataItem, 'name' | 'value'>;

export type UpdateCollectionVariableName = Pick<FormDataItem, 'id' | 'name'>;

export type UpdateCollectionVariableValue = Pick<FormDataItem, 'id' | 'value'>;

export interface RequestCollectionModel {
  id: string;
  name: string;
  created: number;
  variables: CollectionVariable[];
}

export interface Token {
  text: string;
  highlight: boolean;
}

export type SupportedSnippetLang = 'js' | 'curl';


export interface BodyConfig {
  bodyType: SupportedBodyType;
  bodyText?: string;
  bodyTextEnabled?: boolean;
  formItems?: FormDataItem[];
}

export interface MimeMetadata {
  extensions: string[]
  compressible: boolean
}

export interface MimeDb {
  [key: string]: MimeMetadata
}

export interface MimeRecord extends MimeMetadata {
  id: string;
}