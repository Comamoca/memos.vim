import { Denops } from "https://deno.land/x/denops_std@v1.0.0/mod.ts";
import { basename, format, parse } from "../../deps.ts";
import { patchMemo, postNewMemo } from "../@ddu-sources/client.ts";
import { createPluginBuffer } from "../../utils.ts";

const getAllText = async (denops: Denops): Promise<string[]> => {
  const last = await denops.call("line", "$");
  return await denops.call("getline", 1, last);
};

export async function main(denops: Denops): Promise<void> {
  denops.dispatcher = {
    async save(): Promise<void> {
      const content: string[] = await getAllText(denops);

      console.log(content);

      const bufname = parse(await denops.call("bufname", "%"));

      console.log(bufname);
      console.log(bufname.expr);

      const id = Number(basename(bufname.expr));

      await patchMemo(id, content);

      return await Promise.resolve();
    },
    async new(): Promise<void> {
      // create new memo buffer
      // 保存したらバッファを消す

      const bufname = format({
        scheme: "denops",
        expr: `memos/new`,
      });

      await createPluginBuffer(
        denops,
        bufname,
        `call denops#request("memos", "postClose", [])`,
      );

      return await Promise.resolve();
    },
    async post(): Promise<void> {
      const lines = await getAllText(denops);
      const memo = await postNewMemo(lines);

      console.log(memo);

      return await Promise.resolve();
    },
    async postClose(): Promise<void> {
      await denops.cmd(`setlocal nomodified`);
      await denops.cmd(`call denops#request("memos", "post", [])`);
      await denops.cmd(`bd`);
    },
  };
}
