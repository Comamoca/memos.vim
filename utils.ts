import { Denops } from "./deps.ts";
import { open } from "https://deno.land/x/denops_std@v5.1.0/buffer/mod.ts";

export async function createPluginBuffer(
  denops: Denops,
  bufname: string,
  onSaveHook: string,
) {
  await denops.cmd(
    `autocmd BufWriteCmd,FileWriteCmd ${bufname} ${onSaveHook}`,
  );

  await denops.cmd(
    `autocmd TextChanged ${bufname} setlocal nomodified`,
  );

  await open(denops, bufname);

  await denops.cmd("setlocal buftype=acwrite");
  await denops.cmd("setlocal noswapfile nobuflisted");
  await denops.cmd("setlocal bufhidden=hide");
  await denops.cmd("setlocal filetype=markdown");
}
