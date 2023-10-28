import { RequestModel } from "@/common/types";

export interface HistoryState {
    loading: boolean
    history: RequestModel[],
    filter: string,
}


