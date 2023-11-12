import { ExportedCollectionModel, ExportedItem, ExportedRequestModel, FormDataItem, RequestCollectionModel, RequestModel } from "@/common/types";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// #region validation-types

const FormItemValidationSchema = z.object({
    name: z.string().min(1),
    value: z.string().optional()
});

type FormItemValidationType = z.infer<typeof FormItemValidationSchema>;

const RequestValidationSchema = z.object({
    name: z.string().min(1),
    method: z.enum(["get", "post", "delete", "put", "patch", "options", "head"]),
    url: z.string().min(1),
    query: z.array(FormItemValidationSchema).optional(),
    headers: z.array(FormItemValidationSchema).optional(),
    bodytype: z.enum(["formdata", "json", "xml", "url_encoded", "text"]).optional(),
    formItems: z.array(FormItemValidationSchema).optional(),
    enableTextBody: z.boolean().optional(),
    textBody: z.string().optional(),
    auth: z.object({
        authType: z.enum(["none", "basic", "token"]),
        basicUsername: z.string().optional(),
        basicPassword: z.string().optional(),
        tokenPrefix: z.string().optional(),
        tokenVal: z.string().optional(),
    }).optional()
});

type RequestValidationType = z.infer<typeof RequestValidationSchema>;

export interface ImportedCollectionPayload {
    collection: RequestCollectionModel,
    requests: RequestModel[]
}

const CollectionValidationSchema = z.object({
    name: z.string().min(1),
    variables: z.array(FormItemValidationSchema).optional(),
    requests: z.array(RequestValidationSchema).optional()
}).transform((v) => {
    const collectionId = uuidv4();
    const parsed: ImportedCollectionPayload = {
        collection: {
            id: collectionId,
            name: v.name,
            variables: toImportedItem(v.variables),
            created: new Date().getTime(),
        },
        requests: toImportedRequests(collectionId, v.requests)
    };
    return parsed;
});

// #endregion validation-types

// #region export-utils

export function exportToFile(data: any, name: string, mimeType: string, extension: string) {
    const blob = new Blob([data], {
        type: mimeType
    });
    const blobUrl = window.URL.createObjectURL(blob);
    const dlink = document.createElement('a');
    dlink.href = blobUrl;
    dlink.download = `${name}.${extension}`;
    dlink.style.display = 'none';
    document.body.appendChild(dlink);
    dlink.click();
    window.URL.revokeObjectURL(blobUrl);
    document.body.removeChild(dlink);
}

export function toExportedItem(variables: FormDataItem[]): ExportedItem[] | null {
    if (variables && Array.isArray(variables) && variables.length) {
        return variables.map(x => ({
            name: x.name,
            value: x.value
        }));
    }
    return null;
}

export function toExportedRequests(requests: RequestModel[]): ExportedRequestModel[] | null {
    if (requests && Array.isArray(requests) && requests.length) {
        return requests.map(x => {
            const query = toExportedItem(x.query);
            const headers = toExportedItem(x.headers);
            const formdata = toExportedItem(x.formItems || []);
            return {
                name: x.name,
                method: x.method,
                ...(query ? { query } : {}),
                ...(headers ? { headers } : {}),
                url: x.url,
                bodytype: x.bodytype,
                enableTextBody: x.enableTextBody,
                textBody: x.textBody,
                ...(formdata ? { formItems: formdata } : {}),
                auth: x.auth
            }
        });
    }
    return null;
}

export function toExportedCollectionModel(collection: RequestCollectionModel, requests: RequestModel[]): ExportedCollectionModel {

    const vars = toExportedItem(collection.variables);
    const reqs = toExportedRequests(requests);

    const model: ExportedCollectionModel = {
        name: collection.name,
        ...(vars ? { variables: vars } : {}),
        ...(reqs ? { requests: reqs } : {}),
    }

    return model;
}

// #endregion export-utils

// #region import-utils

function toImportedItem(items?: FormItemValidationType[]): FormDataItem[] {
    if (items && Array.isArray(items) && items.length) {
        return items.map(x => ({
            id: uuidv4(),
            name: x.name,
            value: x.value ? x.value : "",
            enabled: true
        }));
    }

    return [];
}

function toImportedRequests(collectionId: string, items?: RequestValidationType[]): RequestModel[] {
    if (items && Array.isArray(items) && items.length) {
        return items.map(x => ({
            id: uuidv4(),
            collectionId,
            headers: toImportedItem(x.headers),
            method: x.method,
            name: x.name,
            query: toImportedItem(x.query),
            triggered: new Date().getTime(),
            url: x.url,
            textBody: x.textBody,
            enableTextBody: x.enableTextBody ? x.enableTextBody : false,
            bodytype: x.bodytype ? x.bodytype : "formdata",
            created: new Date().getTime(),
            formItems: toImportedItem(x.formItems),
            auth: {
                authType: x.auth?.authType || "none",
                basicPassword: x.auth?.basicPassword || "",
                basicUsername: x.auth?.basicUsername || "",
                tokenPrefix: x.auth?.tokenPrefix || "",
                tokenVal: x.auth?.tokenVal || ""
            }
        }));
    }
    return [];
}

export async function importCollection(json: string): Promise<ImportedCollectionPayload | null> {
    try {
        const parsed = JSON.parse(json);
        const validated = await CollectionValidationSchema.safeParseAsync(parsed);

        if (!validated.success) {
            return null;
        }
        return validated.data;
    } catch (error) {
        return null;
    }
}

// #endregion import-utils
