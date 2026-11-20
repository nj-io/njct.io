"""Generate the four v7 /hi concepts from ../prompts.md with gpt26-sunburst at 1024x1536.

Run from anywhere: python3 v7/src/run.py
The key comes from the vault via generate_image.py, or OPENAI_API_KEY in this process's environment.
Prints only each output path, exit code and the script's own cost line.
"""
import re
import subprocess
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

BRIEF = Path(__file__).resolve().parents[2]
SCRIPT = Path.home() / ".claude/skills/generate-image/scripts/generate_image.py"
TEXT = (BRIEF / "v7/prompts.md").read_text()
PROMPTS = {n: re.search(rf"^## {n}\n\n(.+?)\n", TEXT, re.M | re.S).group(1).strip() for n in "1234"}
INPUTS = {
    "1": ["v3/L-get-in-touch/en.png", "v7/refs/about-390x844.png"],
    "2": ["v3/J-cover/en.png", "v7/refs/about-390x844.png"],
    "3": [],
    "4": [],
}


def run(n):
    cmd = ["python3", str(SCRIPT), "gpt26-sunburst", PROMPTS[n], "--size", "1024x1536",
           "-o", f"v7/{n}.png", "-t", "hi-page-v7"]
    if INPUTS[n]:
        cmd += ["-i", *INPUTS[n]]
    r = subprocess.run(cmd, cwd=BRIEF, capture_output=True, text=True)
    return n, r.returncode, (r.stdout + r.stderr).strip()[-300:].replace("\n", " | ")


with ThreadPoolExecutor(4) as pool:
    for n, rc, out in pool.map(run, "1234"):
        print(f"concept {n}: exit {rc}: {out}")
