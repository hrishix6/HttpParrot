export interface QueryItem {
    id: string;
    name: string;
    value: string;
    enabled: boolean;
}
export type RequestMethod = "get" | "post" | "put" | "patch" | "delete" | "options" | "head";

export type InsertQueryItem = Pick<QueryItem, "name" | "value">;

export type UpdateQueryItemName = Pick<QueryItem, "id" | "name">;

export type UpdateQueryItemValue = Pick<QueryItem, "id" | "value">;

export type UpdateQueryItemEnabled = Pick<QueryItem, "id">;

export interface HeaderItem {
    id: string;
    name: string;
    value: string;
    enabled: boolean;
};

export interface ResponseHeader {
    name: string;
    value: string;
}

export type InsertHeader = Pick<HeaderItem, "name" | "value">;

export type UpdateHeaderName = Pick<HeaderItem, "id" | "name">;

export type UpdateHeaderValue = Pick<HeaderItem, "id" | "value">;

export type UpdateHeaderEnabled = Pick<HeaderItem, "id">;


export interface RequestModel {
    id: string;
    method: RequestMethod;
    name: string;
    url: string;
    query: QueryItem[];
    headers: HeaderItem[];
    triggered: number;
    created?: number;
}

export type ContentType = "json" | "js" | "text" | "html" | "xml" | "img" | "unknown" | "audio" | "video" | "pdf" | "css" | "zip";

export interface ResponseModel {
    status: number;
    statusText: string;
    size: number;
    time: number;
    body: any;
    contentType: ContentType;
    headers: ResponseHeader[];
    ok: boolean;
}

export interface RequestCollectionModel {
    id: string;
    name: string;
    created: number;
    requests: RequestModel[]
}

export interface Token {
    text: string;
    highlight: boolean;
}
