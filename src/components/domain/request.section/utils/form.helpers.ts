import { BodyConfig, FormDataItem, QueryItem, SupportedBodyType } from "@/common/types";
import { v4 as uuidv4 } from "uuid";

//URL===================================================================================

export const getQueryString = (query: QueryItem[]) => {

    const enabledItems = query.filter(x => x.enabled);

    if (enabledItems.length) {
        const paramObj: Record<string, string> = {};
        for (let param of enabledItems) {
            if (param.name) {
                paramObj[param.name] = param.value;
            }
        }

        const q = `${new URLSearchParams(paramObj).toString()}`

        return q;
    }

    return "";
}

export const getQueryItems = (queryString: string): QueryItem[] => {

    const queryItems: QueryItem[] = [];
    if (queryString) {
        const params = new URLSearchParams(queryString);
        for (let p of params) {
            const [key, value] = p;
            queryItems.push({
                id: uuidv4(),
                name: key,
                value,
                enabled: true
            })
        }
    }

    return queryItems;
};

export const getUpdatedUrl = (url: string, queryStr: string) => {
    const baeUrl = url?.split("?")[0] || "";
    if (queryStr) {
        return `${baeUrl}?${queryStr}`;
    }
    return baeUrl;
}

//Body===================================================================================

export const getBody = (bodyConfig: BodyConfig): any => {
    const { bodyType, bodyTextEnabled, bodyText, formItems } = bodyConfig;
    switch (bodyType) {
        case "formdata":
            return toFormDataBody(formItems || []);
        case "url_encoded":
            return toUrlEncodedBody(formItems || []);
        case "json":
        case "text":
        case "xml":
            return toTextBody(bodyText, bodyTextEnabled);
    }
}

function toFormDataBody(formItems: FormDataItem[]): FormData {
    const formData = new FormData();
    for (let item of formItems) {
        if (item.enabled) {
            if (item.name) {
                formData.append(item.name, item.value);
            }
        }
    }
    return formData;
}

function toUrlEncodedBody(formItems: FormDataItem[]): string {
    const data: Record<string, any> = {};
    for (let item of formItems) {
        if (item.enabled) {
            if (item.name) {
                data[item.name] = item.value;
            }

        }
    }

    return new URLSearchParams(data).toString();
}

function toTextBody(bodyText: string = "", enabled: boolean = true): string {
    if (enabled) {
        return bodyText;
    }
    return "";
}

export const getContentType = (bodyType: SupportedBodyType): string => {
    switch (bodyType) {
        case "formdata":
            return "multipart/form-data";
        case "json":
            return "application/json";
        case "text":
            return "text/plain";
        case "xml":
            return "application/xml";
        case "url_encoded":
            return "application/x-www-form-urlencoded"
        default:
            return "text/plain";
    }
}

//=======================================================================================