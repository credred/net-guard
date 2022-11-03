import {
  NetworkModifyInfo,
  shouldContinueRequest,
} from "../../../network-rule";
import { InterceptorConfig, ResponseInfo } from "../../types";
import {
  applyModifyInfoToRequestInfo,
  applyModifyInfoToResponseInfo,
} from "../utils";
import {
  generateRequestInfoByFetchRequest,
  generateResponseInfoByFetchResponse,
  generateResponseInfoByModifyInfo,
} from "./utils";

const generateRequestByModifyInfo = (
  requestModifyInfo: NetworkModifyInfo["request"],
  oldRequest: Request
): Request => {
  if (requestModifyInfo) {
    const { requestBody, requestHeaders } = requestModifyInfo;
    const newRequest = new Request(oldRequest, {
      body: requestBody ?? oldRequest.body,
      headers: requestHeaders ?? oldRequest.headers,
    });

    return newRequest;
  }

  return oldRequest;
};

const generateFetchResponseByModifyInfo = (
  responseModifyInfo: NetworkModifyInfo["response"],
  oldResponse?: Response
) => {
  let response = oldResponse;
  if (responseModifyInfo) {
    const { status, statusText, responseBody, responseHeaders } =
      responseModifyInfo;
    response = new Response(responseBody ?? oldResponse?.body, {
      headers: responseHeaders || oldResponse?.headers,
      status,
      statusText,
    });
  }

  return response;
};

export const createInterceptedFetch = (
  originFetch: typeof fetch,
  config: InterceptorConfig
) => {
  async function interceptedFetch(
    input: Request | string | URL,
    init?: RequestInit
  ): Promise<Response> {
    const request = new Request(input, init);

    const originRequestInfo = await generateRequestInfoByFetchRequest(request);
    const requestId = originRequestInfo.id;
    const rule = await config.matchRule(originRequestInfo);
    const networkModifyInfo = rule?.modifyInfo;
    const requestInfo = applyModifyInfoToRequestInfo(
      originRequestInfo,
      networkModifyInfo?.request,
      rule?.id
    );
    config.requestWillBeSent(requestInfo);

    let response: Response | undefined = undefined;
    let responseInfo: ResponseInfo;
    if (shouldContinueRequest(networkModifyInfo)) {
      const newRequest = generateRequestByModifyInfo(
        networkModifyInfo?.request,
        request
      );

      response = await originFetch(newRequest);
      const originResponseInfo = await generateResponseInfoByFetchResponse(
        response,
        requestId
      );
      responseInfo = applyModifyInfoToResponseInfo(
        originResponseInfo,
        networkModifyInfo?.response
      );
    } else {
      // networkModifyInfo must not be undefined
      responseInfo = generateResponseInfoByModifyInfo(
        networkModifyInfo!.response,
        requestId
      );
    }
    config.responseReceived(responseInfo);
    // one of response or networkModifyInfo must not be undefined
    response = generateFetchResponseByModifyInfo(
      networkModifyInfo?.response,
      response
    )!;

    return response;
  }

  return interceptedFetch;
};
