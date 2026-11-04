"use client";

import { useEffect, useRef, useState } from "react";

export type Day = { date: string; count: number };

// Hand-written WebGL2. One instanced box per day plus a procedural ground plane.
// The contribution data is real, so a tall tower is a day that really happened.

const TOWER_VS = `#version 300 es
layout(location=0) in vec3 aPos;
layout(location=1) in vec3 aNormal;
layout(location=2) in vec2 aOffset;
layout(location=3) in float aHeight;
layout(location=4) in float aId;
uniform mat4 uVP;
uniform float uTime, uGrow, uHot, uSpan;
out vec3 vNormal, vWorld, vLocal;
out float vHeight, vHot, vPulse;
void main() {
  float order = (aOffset.x / uSpan + 0.5) * 0.7;
  float g = smoothstep(order, order + 0.3, uGrow);
  float h = max(0.05, aHeight * g);
  vec3 w = vec3(aPos.x * 0.84 + aOffset.x, aPos.y * h, aPos.z * 0.84 + aOffset.y);
  float head = mod(uTime * 7.0, uSpan * 1.6) - uSpan * 0.8;
  float d = (aOffset.x - head) * 0.55;
  vPulse = exp(-d * d);
  vHot = abs(aId - uHot) < 0.5 ? 1.0 : 0.0;
  vNormal = aNormal; vWorld = w; vLocal = aPos; vHeight = h;
  gl_Position = uVP * vec4(w, 1.0);
}`;

const TOWER_FS = `#version 300 es
precision highp float;
in vec3 vNormal, vWorld, vLocal;
in float vHeight, vHot, vPulse;
uniform vec3 uCamera;
out vec4 o;
void main() {
  vec3 blue = vec3(0.17, 0.42, 1.0), violet = vec3(0.58, 0.42, 1.0);
  float tall = clamp(vHeight / 8.0, 0.0, 1.0);
  vec3 tint = mix(blue, violet, tall);
  float light = 0.32 + 0.68 * max(dot(vNormal, normalize(vec3(0.5, 0.9, 0.35))), 0.0);
  vec3 c;
  if (vNormal.y > 0.5) {
    float e = max(abs(vLocal.x), abs(vLocal.z));
    float rim = smoothstep(0.40, 0.5, e);
    float flat_ = 1.0 - smoothstep(0.05, 0.3, vHeight);
    c = mix(tint * 1.15, vec3(0.8, 0.88, 1.0), rim * 0.8);
    c = mix(c, vec3(0.055, 0.07, 0.11) + vec3(0.1, 0.15, 0.3) * rim, flat_);
  } else {
    float fade = pow(clamp(vWorld.y / max(vHeight, 0.001), 0.0, 1.0), 1.7);
    float bands = step(0.84, fract(vWorld.y * 1.6)) * 0.22;
    c = tint * (0.1 + 0.8 * fade + bands) * light;
  }
  c += blue * vPulse * 0.7;
  c = mix(c, vec3(0.36, 0.95, 0.66), vHot * 0.85);
  float dist = length(uCamera - vWorld);
  float fog = smoothstep(28.0, 78.0, dist);
  o = vec4(mix(c, vec3(0.024, 0.027, 0.043), fog), 1.0);
}`;

const GROUND_VS = `#version 300 es
layout(location=0) in vec2 aPos;
uniform mat4 uVP;
out vec3 vWorld;
void main() { vWorld = vec3(aPos.x, -0.01, aPos.y); gl_Position = uVP * vec4(vWorld, 1.0); }`;

const GROUND_FS = `#version 300 es
precision highp float;
in vec3 vWorld;
uniform vec2 uMouse;
uniform float uSpan;
out vec4 o;
void main() {
  vec2 g = abs(fract(vWorld.xz / 4.0 - 0.5) - 0.5) / fwidth(vWorld.xz / 4.0);
  float line = 1.0 - min(min(g.x, g.y), 1.0);
  float near = smoothstep(uSpan * 1.05, 0.0, length(vWorld.xz));
  float glow = smoothstep(11.0, 0.0, length(vWorld.xz - uMouse));
  vec3 c = vec3(0.024, 0.027, 0.043);
  c += vec3(0.09, 0.13, 0.25) * line * near;
  c += vec3(0.16, 0.29, 0.74) * line * glow;
  c += vec3(0.03, 0.05, 0.14) * glow * 0.6;
  o = vec4(c, 1.0);
}`;

type M = Float32Array;
const perspective = (fov: number, aspect: number, n: number, f: number): M => {
  const t = 1 / Math.tan(fov / 2);
  return new Float32Array([t / aspect, 0, 0, 0, 0, t, 0, 0, 0, 0, (f + n) / (n - f), -1, 0, 0, (2 * f * n) / (n - f), 0]);
};
const lookAt = (e: number[], c: number[], u: number[]): M => {
  const norm = (v: number[]) => { const l = Math.hypot(...v); return v.map((x) => x / l); };
  const cross = (a: number[], b: number[]) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const z = norm([e[0] - c[0], e[1] - c[1], e[2] - c[2]]);
  const x = norm(cross(u, z));
  const y = cross(z, x);
  return new Float32Array([x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, e), -dot(y, e), -dot(z, e), 1]);
};
const mul = (a: M, b: M): M => {
  const o = new Float32Array(16);
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) o[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k];
  return o;
};
const invert = (m: M): M | null => {
  const a = Array.from(m), inv = new Float32Array(16);
  const [a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33] = a;
  const b = [a00 * a11 - a01 * a10, a00 * a12 - a02 * a10, a00 * a13 - a03 * a10, a01 * a12 - a02 * a11, a01 * a13 - a03 * a11, a02 * a13 - a03 * a12, a20 * a31 - a21 * a30, a20 * a32 - a22 * a30, a20 * a33 - a23 * a30, a21 * a32 - a22 * a31, a21 * a33 - a23 * a31, a22 * a33 - a23 * a32];
  let det = b[0] * b[11] - b[1] * b[10] + b[2] * b[9] + b[3] * b[8] - b[4] * b[7] + b[5] * b[6];
  if (!det) return null;
  det = 1 / det;
  inv.set([(a11 * b[11] - a12 * b[10] + a13 * b[9]) * det, (a02 * b[10] - a01 * b[11] - a03 * b[9]) * det, (a31 * b[5] - a32 * b[4] + a33 * b[3]) * det, (a22 * b[4] - a21 * b[5] - a23 * b[3]) * det, (a12 * b[8] - a10 * b[11] - a13 * b[7]) * det, (a00 * b[11] - a02 * b[8] + a03 * b[7]) * det, (a32 * b[2] - a30 * b[5] - a33 * b[1]) * det, (a20 * b[5] - a22 * b[2] + a23 * b[1]) * det, (a10 * b[10] - a11 * b[8] + a13 * b[6]) * det, (a01 * b[8] - a00 * b[10] - a03 * b[6]) * det, (a30 * b[4] - a31 * b[2] + a33 * b[0]) * det, (a21 * b[2] - a20 * b[4] - a23 * b[0]) * det, (a11 * b[7] - a10 * b[9] - a12 * b[6]) * det, (a00 * b[9] - a01 * b[7] + a02 * b[6]) * det, (a31 * b[1] - a30 * b[3] - a32 * b[0]) * det, (a20 * b[3] - a21 * b[1] + a22 * b[0]) * det]);
  return inv;
};

const cubeFaces: [number[], number[][]][] = [
  [[0, 1, 0], [[-.5, 1, -.5], [-.5, 1, .5], [.5, 1, .5], [.5, 1, -.5]]],
  [[0, 0, 1], [[-.5, 0, .5], [.5, 0, .5], [.5, 1, .5], [-.5, 1, .5]]],
  [[0, 0, -1], [[.5, 0, -.5], [-.5, 0, -.5], [-.5, 1, -.5], [.5, 1, -.5]]],
  [[1, 0, 0], [[.5, 0, .5], [.5, 0, -.5], [.5, 1, -.5], [.5, 1, .5]]],
  [[-1, 0, 0], [[-.5, 0, -.5], [-.5, 0, .5], [-.5, 1, .5], [-.5, 1, -.5]]],
];

function program(gl: WebGL2RenderingContext, vs: string, fs: string) {
  const make = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const p = gl.createProgram()!;
  gl.attachShader(p, make(gl.VERTEX_SHADER, vs));
  gl.attachShader(p, make(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null;
}

export default function Skyline({ days, hostRef }: { days: Day[]; hostRef: React.RefObject<HTMLElement | null> }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(null);

  useEffect(() => {
    const el = canvas.current;
    const host = hostRef.current;
    if (!el || !host) return;
    const gl = el.getContext("webgl2", { antialias: true, alpha: false, powerPreference: "low-power" });
    if (!gl) return;

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const towerP = program(gl, TOWER_VS, TOWER_FS);
    const groundP = program(gl, GROUND_VS, GROUND_FS);
    if (!towerP || !groundP) return;

    // Lay days out the way GitHub does: one column per week, one row per weekday.
    const firstWeekday = new Date(days[0].date + "T00:00:00Z").getUTCDay();
    const cols = Math.ceil((days.length + firstWeekday) / 7);
    const rows = 7;
    const CELL = 1.25;
    const span = cols * CELL;
    const max = Math.max(1, ...days.map((d) => d.count));
    const heightOf = (count: number) => (count ? 0.7 + Math.sqrt(count / max) * 11.5 : 0);
    const grid = new Int32Array(cols * rows).fill(-1);
    const inst = new Float32Array(days.length * 4);
    days.forEach((d, i) => {
      const p = i + firstWeekday;
      const c = Math.floor(p / 7), r = p % 7;
      grid[c * rows + r] = i;
      inst.set([(c - cols / 2 + 0.5) * CELL, (r - rows / 2 + 0.5) * CELL, heightOf(d.count), i], i * 4);
    });

    const verts: number[] = [];
    for (const [n, q] of cubeFaces) for (const i of [0, 1, 2, 0, 2, 3]) verts.push(...q[i], ...n);

    const towerVao = gl.createVertexArray();
    gl.bindVertexArray(towerVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, inst, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 16, 0);
    gl.vertexAttribDivisor(2, 1);
    gl.enableVertexAttribArray(3);
    gl.vertexAttribPointer(3, 1, gl.FLOAT, false, 16, 8);
    gl.vertexAttribDivisor(3, 1);
    gl.enableVertexAttribArray(4);
    gl.vertexAttribPointer(4, 1, gl.FLOAT, false, 16, 12);
    gl.vertexAttribDivisor(4, 1);

    const groundVao = gl.createVertexArray();
    gl.bindVertexArray(groundVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    const G = 200;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-G, -G, -G, G, G, G, -G, -G, G, G, G, -G]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const uT = {
      vp: gl.getUniformLocation(towerP, "uVP"), time: gl.getUniformLocation(towerP, "uTime"), grow: gl.getUniformLocation(towerP, "uGrow"),
      hot: gl.getUniformLocation(towerP, "uHot"), span: gl.getUniformLocation(towerP, "uSpan"), cam: gl.getUniformLocation(towerP, "uCamera"),
    };
    const uG = { vp: gl.getUniformLocation(groundP, "uVP"), mouse: gl.getUniformLocation(groundP, "uMouse"), span: gl.getUniformLocation(groundP, "uSpan") };

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clearColor(0.024, 0.027, 0.043, 1);

    let w = 0, h = 0, raf = 0, visible = true, running = false;
    let yaw = 0.62, pitch = 0.2, targetYaw = 0.62, targetPitch = 0.2;
    let vp: M = new Float32Array(16), eye = [0, 0, 0];
    let hot = -1, mouseGround: [number, number] = [999, 999];
    let pointer: { x: number; y: number } | null = null, needsPick = false;
    const start = performance.now();

    const resize = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, r.width < 700 ? 1.5 : 1.75);
      w = Math.round(r.width * dpr);
      h = Math.round(r.height * dpr);
      el.width = w;
      el.height = h;
      gl.viewport(0, 0, w, h);
    };

    const camera = () => {
      const aspect = w / Math.max(1, h);
      const dist = aspect < 1 ? 58 : 46;
      eye = [Math.sin(yaw) * Math.cos(pitch) * dist, Math.sin(pitch) * dist, Math.cos(yaw) * Math.cos(pitch) * dist];
      const look = aspect < 1 ? [2, 8, 0] : [2, 7.5, 0];
      vp = mul(perspective(0.5, aspect, 1, 300), lookAt(eye, look, [0, 1, 0]));
    };

    // March the view ray through the grid and stop at the first tower it enters.
    const pick = () => {
      if (!pointer) return;
      const inv = invert(vp);
      if (!inv) return;
      const rect = el.getBoundingClientRect();
      const nx = ((pointer.x - rect.left) / rect.width) * 2 - 1;
      const ny = 1 - ((pointer.y - rect.top) / rect.height) * 2;
      const un = (x: number, y: number, z: number) => {
        const v = [0, 1, 2, 3].map((i) => inv[i] * x + inv[4 + i] * y + inv[8 + i] * z + inv[12 + i]);
        return [v[0] / v[3], v[1] / v[3], v[2] / v[3]];
      };
      const a = un(nx, ny, -1), b = un(nx, ny, 1);
      const dir = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
      const len = Math.hypot(...dir);
      const d = dir.map((v) => v / len);
      let found = -1;
      for (let t = 10; t < 130; t += 0.14) {
        const px = eye[0] + d[0] * t, py = eye[1] + d[1] * t, pz = eye[2] + d[2] * t;
        if (py < 0) break;
        const c = Math.round(px / CELL + cols / 2 - 0.5), r = Math.round(pz / CELL + rows / 2 - 0.5);
        if (c < 0 || c >= cols || r < 0 || r >= rows) continue;
        const i = grid[c * rows + r];
        if (i >= 0 && py <= heightOf(days[i].count)) { found = i; break; }
      }
      if (d[1] < 0) {
        const t = -eye[1] / d[1];
        mouseGround = [eye[0] + d[0] * t, eye[2] + d[2] * t];
      }
      if (found !== hot) {
        hot = found;
        if (found >= 0) {
          const day = days[found];
          const date = new Date(day.date + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
          setTip({ x: pointer.x - host.getBoundingClientRect().left, y: pointer.y - host.getBoundingClientRect().top, text: `${day.count} contribution${day.count === 1 ? "" : "s"} · ${date}` });
        } else setTip(null);
      } else if (found >= 0) {
        setTip((t) => (t ? { ...t, x: pointer!.x - host.getBoundingClientRect().left, y: pointer!.y - host.getBoundingClientRect().top } : t));
      }
    };

    const draw = (time: number, grow: number) => {
      camera();
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(groundP);
      gl.uniformMatrix4fv(uG.vp, false, vp);
      gl.uniform2f(uG.mouse, mouseGround[0], mouseGround[1]);
      gl.uniform1f(uG.span, span);
      gl.bindVertexArray(groundVao);
      gl.disable(gl.CULL_FACE);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      gl.enable(gl.CULL_FACE);
      gl.useProgram(towerP);
      gl.uniformMatrix4fv(uT.vp, false, vp);
      gl.uniform1f(uT.time, time);
      gl.uniform1f(uT.grow, grow);
      gl.uniform1f(uT.hot, hot);
      gl.uniform1f(uT.span, span);
      gl.uniform3f(uT.cam, eye[0], eye[1], eye[2]);
      gl.bindVertexArray(towerVao);
      gl.drawArraysInstanced(gl.TRIANGLES, 0, verts.length / 6, days.length);
    };

    const frame = (now: number) => {
      if (!visible) { running = false; return; }
      const t = (now - start) / 1000;
      yaw += (targetYaw + Math.sin(t * 0.08) * 0.05 - yaw) * 0.05;
      pitch += (targetPitch - pitch) * 0.05;
      if (needsPick) { camera(); pick(); needsPick = false; }
      draw(t, Math.min(1, t / 2.4));
      raf = requestAnimationFrame(frame);
    };
    const go = () => { if (!running && !reduced) { running = true; raf = requestAnimationFrame(frame); } };
    const still = () => { camera(); if (needsPick) { pick(); needsPick = false; } draw(0, 1); };

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      pointer = { x: e.clientX, y: e.clientY };
      needsPick = true;
      if (e.pointerType === "mouse") {
        targetYaw = 0.62 + ((e.clientX - r.left) / r.width - 0.5) * 0.42;
        targetPitch = 0.2 + ((e.clientY - r.top) / r.height - 0.5) * -0.1;
      }
      if (reduced) still();
    };
    const onLeave = () => { pointer = null; hot = -1; mouseGround = [999, 999]; setTip(null); targetYaw = 0.62; targetPitch = 0.2; if (reduced) still(); };

    const ro = new ResizeObserver(() => { resize(); if (reduced) still(); else if (!running) draw((performance.now() - start) / 1000, 1); });
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting && !document.hidden; if (visible) go(); });
    io.observe(el);
    const onVis = () => { visible = !document.hidden; if (visible) go(); };
    document.addEventListener("visibilitychange", onVis);
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerdown", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);

    resize();
    if (reduced) still(); else go();
    el.dataset.ready = "1";

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onMove);
      host.removeEventListener("pointerleave", onLeave);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [days, hostRef]);

  return (
    <>
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      {tip && (
        <div className="glass mono pointer-events-none absolute z-20 border border-line-2 px-2.5 py-1.5 text-[11px] whitespace-nowrap" style={{ left: tip.x + 14, top: tip.y - 40 }}>
          {tip.text}
        </div>
      )}
    </>
  );
}
