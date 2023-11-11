import { ResponseModel } from "@/common/types";
import { toResponseHeaders } from "./header.utils";
import { readBody, determineBodytypeAsync } from "./body.utils";
import { DEFAULT_FILE_EXTENSION, DEFAULT_MIMETYPE, SUPPORTED_TEXT_FORMATS } from "./constants";
import { formatText } from "./text.utils";

export async function toResponseModel(response: Response, timeTaken: number): Promise<[ResponseModel, any]> {
    const headers = toResponseHeaders(response.headers);
    const data: Partial<ResponseModel> = {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers,
        mimeType: DEFAULT_MIMETYPE,
        contentType: DEFAULT_FILE_EXTENSION,
        time: timeTaken
    };
    let error: Error | null = null;

    const contenTypeHeader = response.headers.get("content-type");
    try {
        const [size, chunks] = await readBody(response.body);
        data.size = size;
        if (contenTypeHeader) {
            let mimeRecord = await determineBodytypeAsync(contenTypeHeader);
            let extension = mimeRecord.extensions[0];
            data.mimeType = mimeRecord.id;
            data.contentType = extension;
            if (SUPPORTED_TEXT_FORMATS.includes(extension)) {
                const text = new TextDecoder().decode(chunks);
                const textBody = formatText(text, extension);
                data.body = textBody;
            }
            else {
                data.body = chunks;
            }
        }
    } catch (err) {
        error = err as any;
    }

    return [data as ResponseModel, error];
}


