import { RequestModel } from "../../types";

export interface HistoryState {
    loading: boolean
    history: RequestModel[],
    filter: string,
}


