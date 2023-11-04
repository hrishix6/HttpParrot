import { RootState } from "@/common/store";
import { FormDataItem, MimeRecord } from "@/common/types";
import { substituteText } from "./text.utils";
import { mimeRepo } from "./db";
import { DEFAULT_FILE_EXTENSION, DEFAULT_MIMETYPE } from "./constants";

export function toSimpleFetchBody(state: RootState): any {
    const { bodyType, formItems, textBody, enableTextBody } = state.requestStore
    switch (bodyType) {
        case "formdata":
            return toFormDataBody(formItems);
        case "url_encoded":
            return toUrlEncodedBody(formItems);
        case "json":
        case "text":
        case "xml":
            return toTextBody(textBody, enableTextBody);
    }
}

export function totSubstitutedFetchBody(state: RootState, variableMap: Record<string, string>): any {
    const { bodyType, formItems, textBody, enableTextBody } = state.requestStore
    switch (bodyType) {
        case "formdata":
            return toSubstitutedFormDataBody(formItems, variableMap);
        case "url_encoded":
            return toSubstitudedUrlEncodedBody(formItems, variableMap);
        case "json":
        case "text":
        case "xml":
            return toTextBody(textBody, enableTextBody);
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

function toSubstitutedFormDataBody(formItems: FormDataItem[], varMap: Record<string, string>): FormData {
    const formData = new FormData();
    let k, v = "";
    for (let item of formItems) {
        if (item.enabled) {
            if (item.name) {
                k = substituteText(item.name, varMap);
                v = substituteText(item.value, varMap);
                formData.append(k, v);
            }
        }
    }
    return formData;
}

function toSubstitudedUrlEncodedBody(formItems: FormDataItem[], varMap: Record<string, string>) {
    const data: Record<string, any> = {};
    let k, v = "";
    for (let item of formItems) {
        if (item.enabled) {
            if (item.name) {
                k = substituteText(item.name, varMap);
                v = substituteText(item.value, varMap);
                data[k] = v;
            }

        }
    }

    return new URLSearchParams(data).toString();
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

function concatChunks(arrays: Uint8Array[]): [number, Uint8Array] {
    let totalLength = arrays.reduce((acc, value) => acc + value.length, 0);

    let result = new Uint8Array(totalLength);

    if (!arrays.length) return [totalLength, result];

    // for each array - copy it over result
    // next array is copied right after the previous one
    let length = 0;
    for (let array of arrays) {
        result.set(array, length);
        length += array.length;
    }

    return [length, result];
}

export function readBody(
    body: ReadableStream<Uint8Array> | null
): Promise<[number, Uint8Array]> {
    return new Promise((resolve, reject) => {
        let responseSize = 0;
        let responseBody: Uint8Array[] = [];
        if (body) {
            const reader = body.getReader();

            reader.read().then(function processText({ done, value }): any {
                if (done) {
                    const result = concatChunks(responseBody);
                    resolve(result);
                    return;
                }

                if (value) {
                    responseSize += value.length;
                    responseBody.push(value);
                }

                return reader.read().then(processText);
            }).catch(err => reject(err));
        } else {
            resolve([responseSize, new Uint8Array(0)]);
        }
    });
}

export async function determineBodytypeAsync(contenTypeHeader: string): Promise<MimeRecord> {
    const parts = contenTypeHeader.split(';').map((part) => part.trim());
    const media = parts[0];

    try {
        const mimeRecord = await mimeRepo.getById(media);
        return mimeRecord;
    } catch (error) {
        return {
            id: DEFAULT_MIMETYPE,
            compressible: true,
            extensions: [DEFAULT_FILE_EXTENSION]
        }
    }
}