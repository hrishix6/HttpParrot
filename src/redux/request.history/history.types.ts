import { RequestModel } from "../../types";

export interface HistoryState {
    history: RequestModel[],
    filteredHistory: RequestModel[],
    filter: string,
}


