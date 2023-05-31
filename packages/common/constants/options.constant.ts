import { last } from "lodash";
import { METHOD } from "../models/rule.model";

interface Option<ValueType = any> {
  label: string;
  value: ValueType;
}

/**
 * thanks for https://github.com/mockoon/mockoon
 * https://github.com/mockoon/mockoon/blob/61a7cf7211c235f9a77858f2a5eea6068f9095fe/packages/desktop/src/renderer/app/constants/routes.constants.ts#L3
 */
const RAW_STATUS_CODE_OPTIONS: (
  | { category: true; label: string }
  | Option<number>
)[] = [
  { category: true, label: "frequently-used responses" },
  { value: 200, label: "200 - OK" },
  { value: 400, label: "400 - Bad Request" },
  { value: 500, label: "500 - Internal Server Error" },

  { category: true, label: "1xx - Information responses" },
  { value: 100, label: "100 - Continue" },
  { value: 101, label: "101 - Switching Protocols" },
  { value: 102, label: "102 - Processing" },
  {
    value: 103,
    label: "103 - Early Hints",
  },
  { category: true, label: "2xx - Successful responses" },
  { value: 200, label: "200 - OK" },
  { value: 201, label: "201 - Created" },
  { value: 202, label: "202 - Accepted" },
  { value: 203, label: "203 - Non-Authoritative Information" },
  { value: 204, label: "204 - No Content" },
  { value: 205, label: "205 - Reset Content" },
  { value: 206, label: "206 - Partial Content" },
  { value: 207, label: "207 - Multi-Status" },
  { value: 208, label: "208 - Already Reported" },
  { value: 218, label: "218 - This is fine (Apache Web Server)" },
  { value: 226, label: "226 - IM Used" },
  { category: true, label: "3xx - Redirection messages" },
  { value: 300, label: "300 - Multiple Choices" },
  { value: 301, label: "301 - Moved Permanently" },
  { value: 302, label: "302 - Found" },
  { value: 303, label: "303 - See Other" },
  { value: 304, label: "304 - Not Modified" },
  { value: 305, label: "305 - Use Proxy" },
  { value: 306, label: "306 - Switch Proxy" },
  { value: 307, label: "307 - Temporary Redirect" },
  { value: 308, label: "308 - Permanent Redirect" },
  { category: true, label: "4xx - Client error responses" },
  { value: 400, label: "400 - Bad Request" },
  { value: 401, label: "401 - Unauthorized" },
  { value: 402, label: "402 - Payment Required" },
  { value: 403, label: "403 - Forbidden" },
  { value: 404, label: "404 - Not Found" },
  { value: 405, label: "405 - Method Not Allowed" },
  { value: 406, label: "406 - Not Acceptable" },
  { value: 407, label: "407 - Proxy Authentication Required" },
  { value: 408, label: "408 - Request Timeout" },
  { value: 409, label: "409 - Conflict" },
  { value: 410, label: "410 - Gone" },
  { value: 411, label: "411 - Length Required" },
  { value: 412, label: "412 - Precondition Failed" },
  { value: 413, label: "413 - Payload Too Large" },
  { value: 414, label: "414 - URI Too Long" },
  { value: 415, label: "415 - Unsupported Media Type" },
  { value: 416, label: "416 - Range Not Satisfiable" },
  { value: 417, label: "417 - Expectation Failed" },
  { value: 418, label: "418 - I'm A Teapot" },
  { value: 419, label: "419 - Page Expired (Laravel Framework)" },
  { value: 420, label: "420 - Method Failure (Spring Framework)" },
  { value: 421, label: "421 - Misdirected Request" },
  { value: 422, label: "422 - Unprocessable Entity" },
  { value: 423, label: "423 - Locked" },
  { value: 424, label: "424 - Failed Dependency" },
  { value: 425, label: "425 - Too Early" },
  { value: 426, label: "426 - Upgrade Required" },
  { value: 428, label: "428 - Precondition Required" },
  { value: 429, label: "429 - Too Many Requests" },
  {
    value: 430,
    label: "430 - Request Header Fields Too Large (Shopify)",
  },
  { value: 431, label: "431 - Request Header Fields Too Large" },
  { value: 440, label: "440 - Login Time-out (IIS)" },
  { value: 444, label: "444 - No Response (nginx)" },
  { value: 449, label: "449 - Retry With (IIS)" },
  {
    value: 450,
    label: "450 - Blocked by Windows Parental Controls (Microsoft)",
  },
  { value: 451, label: "451 - Unavailable For Legal Reasons" },
  {
    value: 460,
    label: "460 - Client closed connection (AWS ELB)",
  },
  { value: 494, label: "494 - Request Header Too Large (nginx)" },
  { value: 495, label: "495 - SSL Certificate Error (nginx)" },
  { value: 496, label: "496 - SSL Certificate Required (nginx)" },
  {
    value: 497,
    label: "497 - HTTP Request Sent to HTTPS Port (nginx)",
  },
  { value: 499, label: "499 - Client Closed Request (nginx)" },
  { category: true, label: "5xx - Server error responses" },
  { value: 500, label: "500 - Internal Server Error" },
  { value: 501, label: "501 - Not Implemented" },
  { value: 502, label: "502 - Bad Gateway" },
  { value: 503, label: "503 - Service Unavailable" },
  { value: 504, label: "504 - Gateway Timeout" },
  { value: 505, label: "505 - HTTP Version Not Supported" },
  { value: 506, label: "506 - Variant Also Negotiates" },
  { value: 507, label: "507 - Insufficient Storage" },
  { value: 508, label: "508 - Loop Detected" },
  {
    value: 509,
    label: "509 - Bandwidth Limit Exceeded (Apache Web Server)",
  },
  { value: 510, label: "510 - Not Extended" },
  { value: 511, label: "511 - Network Authentication Required" },
  {
    value: 520,
    label: "520 - Web Server Returned An Unknown Error (Cloudflare)",
  },
  { value: 521, label: "521 - Web Server Is Down (Cloudflare)" },
  { value: 522, label: "522 - Connection Timed Out (Cloudflare)" },
  {
    value: 523,
    label: "523 - Origin Is Unreachable (Cloudflare)",
  },
  { value: 524, label: "524 - A Timeout Occurred (Cloudflare)" },
  { value: 525, label: "525 - SSL Handshake Failed (Cloudflare)" },
  {
    value: 526,
    label: "526 - Invalid SSL Certificate (Cloudflare)",
  },
  { value: 527, label: "527 - Railgun Error (Cloudflare)" },
  { value: 561, label: "561 - Unauthorized (AWS ELB)" },
];

interface Group {
  label: string;
  children: Option<number>[];
}
export const STATUS_CODE_OPTIONS = RAW_STATUS_CODE_OPTIONS.reduce<Group[]>(
  (groups, items) => {
    const currentGroup = last(groups);
    if ("category" in items) {
      groups.push({ label: items.label, children: [] });
    } else if (currentGroup) {
      currentGroup.children.push({ label: items.label, value: items.value });
    } else {
      throw new Error("first option must be category");
    }
    return groups;
  },
  []
);

export const METHOD_OPTIONS = [
  {
    value: METHOD.ALL,
    label: METHOD.ALL,
  },
  {
    value: METHOD.GET,
    label: METHOD.GET,
  },
  {
    value: METHOD.POST,
    label: METHOD.POST,
  },
  {
    value: METHOD.PUT,
    label: METHOD.PUT,
  },
  {
    value: METHOD.DELETE,
    label: METHOD.DELETE,
  },
  {
    value: METHOD.PATCH,
    label: METHOD.PATCH,
  },
  {
    value: METHOD.HEAD,
    label: METHOD.HEAD,
  },
  {
    value: METHOD.OPTIONS,
    label: METHOD.OPTIONS,
  },
];
