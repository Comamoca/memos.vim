import { BaseSource, DduOptions, Item, SourceOptions } from "../../deps.ts";
import { Denops, fn } from "../../deps.ts";
import { ActionData } from "../@ddu-kinds/memos.ts";
import { getAllMemos } from "./client.ts";
import { slice } from "../../deps.ts";

type Params = Record<never, never>;

export class Source extends BaseSource<Params> {
  // override kind = "file";
  override kind = "memos";

  override gather(args: {
    denops: Denops;
    options: DduOptions;
    sourceOptions: SourceOptions;
    sourceParams: Params;
    input: string;
  }): ReadableStream<Item<ActionData>[]> {
    return new ReadableStream({
      async start(controller) {
        const dir = await fn.getcwd(args.denops) as string;
        let items: Item<ActionData>[];

        const tree = async (root: string) => {
          try {
            const memos = await getAllMemos();
            items = memos.map((memo) => {
              return {
                word: slice(memo.content, 0, 30).replaceAll("\n", " "),
                action: {
                  id: memo.id,
                },
              };
            });
          } catch (e: unknown) {
            console.error(e);
          }

          return items;
        };

        controller.enqueue(
          await tree(dir),
        );

        controller.close();
      },
    });
  }

  override params(): Params {
    return {};
  }
}
