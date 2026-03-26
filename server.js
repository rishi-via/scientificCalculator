import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/__via/telemetry", (req, res) => {
  const logDir = "/var/log/via";
  fs.mkdirSync(logDir, { recursive: true });
  const events = Array.isArray(req.body) ? req.body : [req.body];
  for (const event of events) {
    const line = JSON.stringify(event) + "\n";
    fs.appendFileSync(path.join(logDir, "telemetry.jsonl"), line);
    if (event.type === "error" || (event.type === "console" && event.level === "error")) {
      fs.appendFileSync(path.join(logDir, "errors.jsonl"), line);
    }
  }
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Express listening on :${PORT}`));
