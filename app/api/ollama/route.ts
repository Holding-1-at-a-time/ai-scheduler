// pages/api/ollama.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { spawn } from "child_process";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { prompt, model } = req.body;

  const ollama = spawn("ollama", ["run", model, prompt]);

  let output = "";
  ollama.stdout.on("data", (data) => {
    output += data.toString();
  });

  ollama.stderr.on("data", (data) => {
    console.error(`Ollama Error: ${data}`);
  });

  ollama.on("close", (code) => {
    if (code === 0) {
      res.status(200).json({ output: output.trim() });
    } else {
      res
        .status(500)
        .json({ error: `Ollama process exited with code ${code}` });
    }
  });
}
