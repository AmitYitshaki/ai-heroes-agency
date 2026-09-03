import ffmpegPath from 'ffmpeg-static';
import { execFile } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);
const musicSource = join(process.cwd(), 'incoming', 'audio', 'music');
const sfxSource = join(process.cwd(), 'incoming', 'audio', 'sound');
const musicTarget = join(process.cwd(), 'public', 'audio', 'music');
const sfxTarget = join(process.cwd(), 'public', 'audio', 'sfx');

// Background loops: trim only leading silence (trailing silence on a loop
// can hide an intentional tail) and re-encode at a web-friendly bitrate.
// Filenames map to the MusicCue ids in src/services/audio.ts.
const musicFiles = [
  ['Welcome to the Future.mp3', 'onboarding.mp3'],
  ['Friendly Robot Adventure.mp3', 'headquarters.mp3'],
  ['Playful Adventure.mp3', 'zone-fog.mp3'],
  ['Caketown 1.mp3', 'zone-factory.mp3'],
  ['Buggy Robot Quest.mp3', 'zone-maze.mp3'],
  ['djartmusic-best-game-console-301284.mp3', 'zone-tower-finale.mp3'],
  ['the_mountain-children-522447.mp3', 'certification.mp3'],
];

// One-shot stingers: trim both ends, loudness-normalize so the four differ
// only intentionally (not because of mismatched source levels), and cap the
// two long source clips to a short sting with a fade-out instead of shipping
// their full 4-8s runtime. Only cues actually wired in audio.ts are built —
// the villain-chuckle and "failing" clips stay in incoming/ unused, per
// docs/AUDIO_TECH_DECISION.md, so no dead weight ships in the bundle.
const sfxFiles = [
  { in: 'mixkit-winning-a-coin-video-game-2069.wav', out: 'success.mp3', maxSeconds: null },
  { in: 'mixkit-game-level-completed-2059.wav', out: 'stars.mp3', maxSeconds: null },
  { in: 'mixkit-medieval-show-fanfare-announcement-226.wav', out: 'ceremony.mp3', maxSeconds: 4 },
  { in: 'mixkit-ominous-drums-227.wav', out: 'boss.mp3', maxSeconds: 2 },
];

async function encodeMusic(inputName, outputName) {
  const input = join(musicSource, inputName);
  const output = join(musicTarget, outputName);
  const filters = 'silenceremove=start_periods=1:start_duration=0.05:start_threshold=-45dB';
  await run(ffmpegPath, ['-y', '-i', input, '-af', filters, '-b:a', '128k', '-ar', '44100', '-ac', '2', output]);
}

async function encodeSfx({ in: inputName, out: outputName, maxSeconds }) {
  const input = join(sfxSource, inputName);
  const output = join(sfxTarget, outputName);
  const filters = [
    'silenceremove=start_periods=1:start_duration=0.02:start_threshold=-40dB:stop_periods=1:stop_duration=0.05:stop_threshold=-40dB',
    'loudnorm=I=-14:TP=-1:LRA=6',
  ];
  if (maxSeconds) filters.push(`afade=t=out:st=${Math.max(0, maxSeconds - 0.3)}:d=0.3`);
  const args = ['-y', '-i', input, '-af', filters.join(',')];
  if (maxSeconds) args.push('-t', String(maxSeconds));
  args.push('-b:a', '128k', '-ar', '44100', output);
  await run(ffmpegPath, args);
}

await mkdir(musicTarget, { recursive: true });
await mkdir(sfxTarget, { recursive: true });

await Promise.all(musicFiles.map(([inputName, outputName]) => encodeMusic(inputName, outputName)));
await Promise.all(sfxFiles.map((entry) => encodeSfx(entry)));

console.log(`Optimized ${musicFiles.length} music tracks and ${sfxFiles.length} sound effects.`);
