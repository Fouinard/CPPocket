import { NodeType } from "@/features/tree/types";
import { ADESessionParams } from "./session.types";

export interface TreeRequestParams extends ADESessionParams {
  nodeId: number | string;
}

export interface TreeExpandParams extends TreeRequestParams {
  nodeType: Extract<NodeType, "category" | "branch">;
}

export interface TreeRequestResponse {
  currentUrl: string;
  htmlResponseBuffer: ArrayBuffer;
}