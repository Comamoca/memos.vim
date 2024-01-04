import {
  ActionArguments,
  ActionFlags,
  BaseKind,
  DduItem,
  PreviewContext,
} from "https://deno.land/x/ddu_vim@v2.2.0/types.ts";
import { Denops, fn } from "https://deno.land/x/ddu_vim@v2.2.0/deps.ts";
import { open } from "https://deno.land/x/denops_std@v5.1.0/buffer/mod.ts";
import { getMemo } from "../@ddu-sources/client.ts";
// import { is } from "https://deno.land/x/unknownutil@v3.11.0/mod.ts";
// import { ensure } from "https://deno.land/x/unknownutil@v3.11.0/mod.ts";
import { batch, execute, format } from "../../deps.ts";
import { createPluginBuffer } from "../../utils.ts";

// TODO: プレビューの実装をする

export type ActionData = {
  id: number;
};

type Params = Record<never, never>;

export class Kind extends BaseKind<Params> {
  override actions: Record<
    string,
    (args: ActionArguments<Params>) => Promise<ActionFlags>
  > = {
    open: async (args: { denops: Denops; items: DduItem[] }) => {
      const denops = args.denops;

      for (const item of args.items) {
        const id: number = item.action.id;
        const memo = await (getMemo(Number(id)));
        const bufname = format({
          scheme: "denops",
          expr: `memos/${id}`,
        });

        await createPluginBuffer(
          denops,
          bufname,
          "call denops#request('memos', 'save', [])",
        );

        for await (
          const [idx, line] of Object.entries(memo.content.split(/\n/))
        ) {
          await denops.call("append", idx, line);
        }
      }

      return Promise.resolve(ActionFlags.None);
    },
    delete: async (args: { denops: Denops; items: DduItem[] }) => {
      const denops = args.denops;

      for (const item of args.items) {
        const id: number = item.action.id;

        const memo = await (getMemo(Number(id)));
        const bufname = format({
          scheme: "denops",
          expr: `memos/${id}`,
        });

        await createPluginBuffer(
          denops,
          bufname,
          "call denops#request('memos', 'save', [])",
        );

        for await (
          const [idx, line] of Object.entries(memo.content.split(/\n/))
        ) {
          await denops.call("append", idx, line);
        }
      }

      return Promise.resolve(ActionFlags.None);
    },
  };

  override params(): Params {
    return {};
  }
}
