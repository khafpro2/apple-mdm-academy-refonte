import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "node:child_process";
import {
  appleDeviceSupportAudioLessons,
  getSpokenScriptBySlug,
} from "@/lib/data/audio/apple-device-support";
import { audioDownloadName } from "@/lib/data/audio/types";

const ROOT = join(process.cwd());
const PUBLIC_DIR = join(ROOT, "public/audio/apple-device-support");
const SCRIPT_DIR = join(ROOT, "content/audio/apple-device-support");
const VOICE = process.env.ADS_AUDIO_VOICE ?? "fr-FR-DeniseNeural";
const RATE = process.env.ADS_AUDIO_RATE ?? "-8%";

function run(command: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited with ${code}`));
    });
  });
}

async function main() {
  await mkdir(PUBLIC_DIR, { recursive: true });
  await mkdir(SCRIPT_DIR, { recursive: true });

  for (const lesson of appleDeviceSupportAudioLessons) {
    const script = getSpokenScriptBySlug(lesson.slug);
    if (!script) throw new Error(`Script manquant pour ${lesson.slug}`);

    const txtPath = join(SCRIPT_DIR, `${lesson.slug}.txt`);
    const rawMp3 = join(PUBLIC_DIR, `${lesson.slug}.raw.mp3`);
    const finalMp3 = join(PUBLIC_DIR, `${lesson.slug}.mp3`);
    const downloadName = audioDownloadName(lesson.trackNumber, lesson.slug);

    await writeFile(txtPath, script, "utf8");
    console.log(`Voix ${VOICE} · piste ${lesson.trackNumber} · ${downloadName}`);

    await run("python3", [
      "-m",
      "edge_tts",
      "--voice",
      VOICE,
      `--rate=${RATE}`,
      "--file",
      txtPath,
      "--write-media",
      rawMp3,
    ]);

    await run("ffmpeg", [
      "-y",
      "-loglevel",
      "error",
      "-i",
      rawMp3,
      "-ac",
      "1",
      "-ar",
      "22050",
      "-b:a",
      "48k",
      "-metadata",
      `title=${lesson.title}`,
      "-metadata",
      `track=${lesson.trackNumber}`,
      "-metadata",
      "album=Apple Device Support — Recertification",
      "-metadata",
      "artist=Apple MDM Academy",
      finalMp3,
    ]);

    await run("rm", ["-f", rawMp3]);
  }

  const zipPath = join(PUBLIC_DIR, "apple-device-support-recertification.zip");
  await run("bash", [
    "-lc",
    `cd ${JSON.stringify(PUBLIC_DIR)} && rm -f apple-device-support-recertification.zip && zip -q apple-device-support-recertification.zip *.mp3`,
  ]);

  console.log(`Pack ZIP : ${zipPath}`);
  console.log(`Pistes générées : ${appleDeviceSupportAudioLessons.length}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
