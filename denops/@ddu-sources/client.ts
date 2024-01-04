import { join } from "https://deno.land/std@0.208.0/url/join.ts";
import ky from "https://esm.sh/ky";

interface Memo {
  id: number;
  rowStatus: "NORMAL";
  creatorId: number;
  createdTs: number;
  updatedTs: number;
  displayTs: number;
  content: string;
  visibility: "PRIVATE" | "PUBLIC";
  pinned: boolean;
  creatorName: string;
  creatorUsername: string;
  resourceList: [];
  relationList: [];
}

// TODO: sourceParamsで取得するように書き換える
// openId
const openId = "81908e62-c799-4d3b-a56a-ad18e7057697";

// host
const host = "http://localhost:5230";

// endpoint
const endpoint = "/api/v1/memo";

export async function getAllMemos(): Promise<Memo[]> {
  const url = new URL(endpoint, host);
  url.searchParams.set("openId", openId);

  const resp = await fetch(url);
  const memos: Memo[] = await resp.json();

  return memos;
}

export async function getMemo(id: number): Promise<Memo> {
  const url = join(host, endpoint, String(id));
  url.searchParams.set("openId", openId);

  const resp = await fetch(url);
  const memo: Memo = await resp.json();

  return memo;
}

export async function patchMemo(id: number, content: string[]): Promise<Memo> {
  const url = join(host, endpoint, String(id));
  url.searchParams.set("openId", openId);

  const resp = await ky.patch(url, { json: { content: content.join("\n") } });
  const memo: Memo = await resp.json();

  return memo;
}

export async function postMemo(content: string[]) {
  const successMsg = async (resp: Response): Promise<string> => {
    const memo: Memo = await resp.json();

    if (resp.status == 200) {
      return `Memo post is done. Post id is ${memo.id}.`;
    } else {
      return `Oops! something wrong!`;
    }
  };

  console.log(content);

  const url = new URL(endpoint, host);
  url.searchParams.set("openId", openId);

  console.log(url);

  const resp = await ky.post(url, { json: { content: content.join("\n") } });
  console.log(await successMsg(resp));
}

export async function postNewMemo(content: string[]): Promise<Memo> {
  const url = new URL(endpoint, host);
  url.searchParams.set("openId", openId);

  console.log(url);

  const memo: Memo = await ky.post(url, {
    json: { content: content.join("\n") },
  })
    .json();

  return memo;
}

export async function deleteMemo(id: number) {}

// const memos = await getAllMemos();
// console.log(memos.map((m) => m.content.slice(0, 10)));
