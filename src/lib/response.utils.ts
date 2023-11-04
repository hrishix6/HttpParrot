import { ResponseModel } from "@/common/types";
import { toResponseHeaders } from "./header.utils";
import { readBody, determineBodytypeAsync } from "./body.utils";
import { DEFAULT_FILE_EXTENSION, DEFAULT_MIMETYPE, SUPPORTED_TEXT_FORMATS } from "./constants";
import { formatText } from "./text.utils";

type PartialResponseMetadata = Omit<ResponseModel, "time">;

export async function toResponseModel(response: Response): Promise<PartialResponseMetadata> {
    const headers = toResponseHeaders(response.headers);
    const contenTypeHeader = response.headers.get("content-type");
    const [size, chunks] = await readBody(response.body);

    const data: Partial<PartialResponseMetadata> = {
        size,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers,
        mimeType: DEFAULT_MIMETYPE,
        contentType: DEFAULT_FILE_EXTENSION,
        body: chunks
    };

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

    return data as PartialResponseMetadata;
}


