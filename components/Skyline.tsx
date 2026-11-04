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
  vec3 blue = vec3(0.20, 0.45, 1.0), violet = vec3(0.56, 0.40, 1.0);
  float tall = clamp(vHeight / 10.0, 0.0, 1.0);
  vec3 tint = mix(blue, violet, tall);
  float light = 0.45 + 0.55 * max(dot(vNormal, normalize(vec3(0.55, 0.9, 0.3))), 0.0);
  vec3 c;
  if (vNormal.y > 0.5) {
    // Roof: emissive, with a bright lit rim. Empty days stay as dark floor tiles.
    float e = max(abs(vLocal.x), abs(vLocal.z));
    float rim = smoothstep(0.42, 0.5, e);
    float flat_ = 1.0 - smoothstep(0.05, 0.3, vHeight);
    c = mix(tint * (0.9 + 0.7 * tall), vec3(0.85, 0.9, 1.0), rim * 0.85);
    c = mix(c, vec3(0.04, 0.05, 0.08) + vec3(0.05, 0.08, 0.18) * rim, flat_);
  } else {
    // Walls: dark glass that brightens toward the roof, thin floor bands, lit vertical edges.
    float y = clamp(vWorld.y / max(vHeight, 0.001), 0.0, 1.0);
    float fade = pow(y, 2.2);
    float bands = step(0.9, fract(vWorld.y * 1.4)) * 0.18 * y;
    float across = abs(vNormal.x) > 0.5 ? vLocal.z : vLocal.x;
    float edge = smoothstep(0.43, 0.5, abs(across));
    c = vec3(0.02, 0.025, 0.05) + tint * (0.05 + 0.75 * fade + bands + edge * (0.15 + 0.6 * fade)) * light;
  }
  c += blue * vPulse * 0.55;
  c = mix(c, vec3(0.36, 0.95, 0.66), vHot * 0.85);
  // Distance haze: towers melt into a faint blue horizon rather than straight to black.
  float dist = length(uCamera - vWorld);
  float fog = smoothstep(30.0, 82.0, dist);
  vec3 haze = vec3(0.035, 0.045, 0.09);
  o = vec4(mix(c, haze, fog), 1.0);
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
  // Same haze as the towers, so the floor dissolves into a soft horizon line.
  c = mix(c, vec3(0.035, 0.045, 0.09), smoothstep(34.0, 150.0, length(vWorld.xz)));
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

const YAW = 0.58, PITCH = 0.17;

export default function Skyline({ days, hostRef }: { days: Day[]; hostRef: React.RefObject<HTMLElement | null> }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(null);

  useEffect(() => {
    const el = canvas.current;
    const host = hostRef.current;
    if (!el || !host) return;
    const gl = el.getContext("webgl2", { antialias: true, alpha: false, powerPreference: "low-power" });
    // A lost context renders nothing and leaves the canvas blank (white). Never draw into one.
    if (!gl || gl.isContextLost()) return;

    // Without a GPU (blocklisted drivers, VMs, some low-end devices) WebGL is rasterised on the CPU and a
    // 60fps loop would pin the main thread. Those visitors, and reduced-motion ones, get still frames
    // that redraw only on interaction.
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(gl.getParameter(dbg ? dbg.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
    const software = /swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
    const reduced = software || matchMedia("(prefers-reduced-motion: reduce)").matches;
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
    const heightOf = (count: number) => (count ? 0.6 + Math.sqrt(count / max) * 14 : 0);
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

    const buffers: WebGLBuffer[] = [];
    const buf = (data: Float32Array) => {
      const b = gl.createBuffer()!;
      buffers.push(b);
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    };

    const towerVao = gl.createVertexArray();
    gl.bindVertexArray(towerVao);
    buf(new Float32Array(verts));
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);
    buf(inst);
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
    const G = 200;
    buf(new Float32Array([-G, -G, -G, G, G, G, -G, -G, G, G, G, -G]));
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const uT = {
      vp: gl.getUniformLocation(towerP, "uVP"), time: gl.getUniformLocation(towerP, "uTime"), grow: gl.getUniformLocation(towerP, "uGrow"),
      hot: gl.getUniformLocation(towerP, "uHot"), span: gl.getUniformLocation(towerP, "uSpan"), cam: gl.getUniformLocation(towerP, "uCamera"),
    };
    const uG = { vp: gl.getUniformLocation(groundP, "uVP"), mouse: gl.getUniformLocation(groundP, "uMouse"), span: gl.getUniformLocation(groundP, "uSpan") };

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clearColor(0.035, 0.045, 0.09, 1);

    let w = 0, h = 0, raf = 0, visible = true, running = false;
    let yaw = YAW, pitch = PITCH, targetYaw = YAW, targetPitch = PITCH;
    let vp: M = new Float32Array(16), eye = [0, 0, 0];
    let hot = -1, mouseGround: [number, number] = [999, 999];
    let pointer: { x: number; y: number } | null = null, needsPick = false;
    let start = performance.now();

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
      // Portrait screens see a narrow slice, so swing round to look down the length of the year:
      // all 53 weeks then stack into depth instead of running off both edges.
      const portrait = aspect < 1;
      const y = yaw + (portrait ? 0.72 : 0);
      const dist = portrait ? 50 : 44;
      eye = [Math.sin(y) * Math.cos(pitch) * dist, Math.sin(pitch) * dist, Math.cos(y) * Math.cos(pitch) * dist];
      const look = portrait ? [0, 6.5, 0] : [0, 4.6, 0];
      vp = mul(perspective(portrait ? 0.62 : 0.5, aspect, 1, 300), lookAt(eye, look, [0, 1, 0]));
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
    let armed = false;
    const go = () => { if (armed && !running && !reduced) { running = true; raf = requestAnimationFrame(frame); } };
    const paint = () => { camera(); if (needsPick) { pick(); needsPick = false; } draw(0, 1); };
    // Coalesce interaction redraws to one per frame in still mode.
    let queued = 0;
    const still = () => { if (!queued) queued = requestAnimationFrame(() => { queued = 0; paint(); }); };

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      pointer = { x: e.clientX, y: e.clientY };
      needsPick = true;
      if (e.pointerType === "mouse") {
        targetYaw = YAW + ((e.clientX - r.left) / r.width - 0.5) * 0.42;
        targetPitch = PITCH + ((e.clientY - r.top) / r.height - 0.5) * -0.1;
      }
      if (reduced) still();
    };
    const onLeave = () => { pointer = null; hot = -1; mouseGround = [999, 999]; setTip(null); targetYaw = YAW; targetPitch = PITCH; if (reduced) still(); };

    const ro = new ResizeObserver(() => { resize(); if (reduced) still(); else if (armed && !running) draw((performance.now() - start) / 1000, 1); });
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting && !document.hidden; if (visible) go(); });
    io.observe(el);
    const onVis = () => { visible = !document.hidden; if (visible) go(); };
    document.addEventListener("visibilitychange", onVis);
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerdown", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);

    resize();
    // Start the animated loop once the page is idle so it never competes with hydration.
    const idle = (cb: () => void) => ("requestIdleCallback" in window ? requestIdleCallback(cb, { timeout: 1500 }) : setTimeout(cb, 300));
    let idleId = 0;
    if (reduced) paint();
    else idleId = idle(() => { armed = true; start = performance.now(); go(); }) as number;
    el.dataset.ready = software ? "still" : "1";

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(queued);
      if ("cancelIdleCallback" in window) cancelIdleCallback(idleId); else clearTimeout(idleId);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onMove);
      host.removeEventListener("pointerleave", onLeave);
      // Free resources but keep the context alive: StrictMode re-runs this effect on the same canvas,
      // and getContext() would hand back a context we had just killed.
      delete el.dataset.ready;
      buffers.forEach((b) => gl.deleteBuffer(b));
      gl.deleteVertexArray(towerVao);
      gl.deleteVertexArray(groundVao);
      gl.deleteProgram(towerP);
      gl.deleteProgram(groundP);
    };
  }, [days, hostRef]);

  return (
    <>
      <canvas ref={canvas} className="absolute inset-0 h-full w-full bg-bg" aria-hidden="true" />
      {tip && (
        <div className="glass mono pointer-events-none absolute z-20 border border-line-2 px-2.5 py-1.5 text-[11px] whitespace-nowrap" style={{ left: tip.x + 14, top: tip.y - 40 }}>
          {tip.text}
        </div>
      )}
    </>
  );
}
