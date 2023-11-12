interface EditableItem {
  id: string;
  name: string;
  value: string;
  enabled: boolean;
}

export type InsertEditableItem = Pick<EditableItem, 'name' | 'value'>;

export type UpdateEditableItemName = Pick<EditableItem, 'id' | 'name'>;

export type UpdateEditableItemValue = Pick<EditableItem, 'id' | 'value'>;

export type UpdateEditableItemEnabled = Pick<EditableItem, 'id'>;

export type ExportedItem = Pick<EditableItem, "name" | "value">;

export type QueryItem = EditableItem;

export type RequestMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'
  | 'options'
  | 'head';

export type HeaderItem = EditableItem;
export interface ResponseHeader {
  name: string;
  value: string;
}

export interface RequestAuthConfig {
  authType: SupportedAuthType;
  basicUsername?: string;
  basicPassword?: string;
  tokenPrefix?: string;
  tokenVal?: string;
}

export type FormDataItem = EditableItem;

export type SupportedBodyType =
  | 'formdata'
  | 'json'
  | 'xml'
  | 'url_encoded'
  | 'text';

export type SupportedAuthType = "none" | "basic" | "token";

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
  auth: RequestAuthConfig
}

export interface ExportedRequestModel {
  method: RequestMethod;
  name: string;
  url: string;
  query?: ExportedItem[];
  headers?: ExportedItem[];
  bodytype?: SupportedBodyType;
  formItems?: ExportedItem[];
  enableTextBody?: boolean;
  textBody?: string;
  auth?: RequestAuthConfig
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

export type CollectionVariable = EditableItem;

export interface RequestCollectionModel {
  id: string;
  name: string;
  created: number;
  variables: CollectionVariable[];
}

export interface ExportedCollectionModel {
  name: string;
  variables?: ExportedItem[];
  requests?: ExportedRequestModel[]
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

export type RequestFormMode = "update" | "insert";



export type TabAuthConfigKey = keyof RequestAuthConfig;

export interface TabData {
  id: string;
  name: string;
  collectionId: string;
  collectionName?: string;
  method: RequestMethod,
  url: string,
  query: QueryItem[],
  headers: HeaderItem[],
  mode: RequestFormMode,
  bodyType: SupportedBodyType,
  formItems: FormDataItem[],
  enableTextBody: boolean,
  textBody: string,
  loading: boolean,
  aborter?: AbortController
  lock: boolean;
  responseStatus: string,
  responseSize: string,
  responseTime: string,
  responseBody: any,
  responseBodyType: string
  responseHeaders: ResponseHeader[],
  responseOk: boolean;
  responseMimetype: string;
  error: boolean;
  errorMessage: string;
  authConfig: RequestAuthConfig
}

export type TabDataKey = keyof TabData;

export interface TabDataHolder {
  [key: string]: TabData
}

export interface RequestTab {
  id: string;
  name: string;
}

export class RequestFailedError extends Error {
  public tabId: string;
  public innerError: Error;
  constructor(msg: string, tabId: string, cause: any) {
    super(msg);
    this.tabId = tabId;
    this.innerError = cause;
  }
};