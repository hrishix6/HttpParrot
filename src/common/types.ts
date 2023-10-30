interface FormItem {
    id: string;
    name: string;
    value: string;
    enabled: boolean;
}

export interface QueryItem extends FormItem { };

export type RequestMethod = "get" | "post" | "put" | "patch" | "delete" | "options" | "head";

export type InsertQueryItem = Pick<QueryItem, "name" | "value">;

export type UpdateQueryItemName = Pick<QueryItem, "id" | "name">;

export type UpdateQueryItemValue = Pick<QueryItem, "id" | "value">;

export type UpdateQueryItemEnabled = Pick<QueryItem, "id">;

export interface HeaderItem extends FormItem { };
export interface ResponseHeader {
    name: string;
    value: string;
}

export type InsertHeader = Pick<HeaderItem, "name" | "value">;

export type UpdateHeaderName = Pick<HeaderItem, "id" | "name">;

export type UpdateHeaderValue = Pick<HeaderItem, "id" | "value">;

export type UpdateHeaderEnabled = Pick<HeaderItem, "id">;


export interface FormDataItem extends FormItem { }

export type InsertFormDataItem = Pick<FormDataItem, "name" | "value">;

export type UpdateFormDataItemName = Pick<FormDataItem, "id" | "name">;

export type UpdateFormDataItemValue = Pick<FormDataItem, "id" | "value">;

export type UpdateFormDataItemEnabled = Pick<FormDataItem, "id">;


export type SupportedBodyType = "formdata" | "json" | "xml" | "url_encoded" | "text";

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
    enableTextBody?: boolean,
    textBody?: string
}

export type ContentType = "ogg" | "mp4" | "wav" | "mpeg" | "gif" | "png" | "jpeg" | "json" | "js" | "text" | "html" | "xml" | "img" | "unknown" | "audio" | "video" | "pdf" | "css" | "zip";

export interface ResponseModel {
    mimeType: string;
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


export type SupportedSnippetLang = "js" | "curl";

export const immutableHeaders: HeaderItem[] = [
    {
        id: '-1',
        enabled: true,
        name: 'Content-Type',
        value: "included at runtime",
    },
    {
        id: '-2',
        enabled: true,
        name: 'Content-Length',
        value: "included at runtime",
    },
    {
        id: '-3',
        enabled: true,
        name: 'Accept',
        value: "*/*",
    },
    {
        id: '-4',
        enabled: true,
        name: 'User-Agent',
        value: "hrishix6/HttpClient",
    },
]

export interface BodyConfig {
    bodyType: SupportedBodyType,
    bodyText?: string,
    bodyTextEnabled?: boolean,
    formItems?: FormDataItem[]
}
