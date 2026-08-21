import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";

const port = Number(process.env.PORT ?? 8787);
const outputDir = ".pages-static";
const routes = ["/", "/sign-in", "/sign-up", "/panel"];

function startNext() {
  return spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port)], {
    env: { ...process.env, NODE_ENV: "production" },
    stdio: "inherit",
  });
}

async function waitForNext() {
  const url = "http://127.0.0.1:" + port + "/";
  const deadline = Date.now() + 30_000;

  while (Date.now() < deadline) {
    try {
      await fetch(url);
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  throw new Error("Next.js não iniciou a tempo para gerar os arquivos estáticos.");
}

function outputPath(route) {
  return route === "/" ? outputDir + "/index.html" : outputDir + route + "/index.html";
}

const next = startNext();

try {
  await waitForNext();
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir + "/_next", { recursive: true });
  await cp("public", outputDir, { recursive: true });
  await cp(".next/static", outputDir + "/_next/static", { recursive: true });

  for (const route of routes) {
    const response = await fetch("http://127.0.0.1:" + port + route);
    if (!response.ok && response.status !== 307) {
      throw new Error("Não foi possível gerar " + route + ": HTTP " + response.status);
    }

    const filePath = outputPath(route);
    await mkdir(filePath.slice(0, filePath.lastIndexOf("/")), { recursive: true });
    await writeFile(filePath, await response.text());
  }
} finally {
  next.kill("SIGTERM");
}
