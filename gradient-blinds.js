(() => {
  "use strict";

  const MAX_COLORS = 8;

  const hexToRGB = (hex) => {
    const c = String(hex || "#000000")
      .replace("#", "")
      .padEnd(6, "0");

    return [
      parseInt(c.slice(0, 2), 16) / 255,
      parseInt(c.slice(2, 4), 16) / 255,
      parseInt(c.slice(4, 6), 16) / 255,
    ];
  };

  const prepStops = (stops) => {
    const source =
      Array.isArray(stops) && stops.length ? stops : ["#FF9FFC", "#5227FF"];

    const base = source.slice(0, MAX_COLORS);

    if (base.length === 1) {
      base.push(base[0]);
    }

    while (base.length < MAX_COLORS) {
      base.push(base[base.length - 1]);
    }

    const arr = [];

    for (let i = 0; i < MAX_COLORS; i++) {
      arr.push(hexToRGB(base[i]));
    }

    const count = Math.max(2, Math.min(MAX_COLORS, source.length));

    return {
      arr,
      count,
    };
  };

  const vertexShaderSource = `
attribute vec2 position;
attribute vec2 uv;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

  const fragmentShaderSource = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 iResolution;
uniform vec2 iMouse;
uniform float iTime;

uniform float uAngle;
uniform float uNoise;
uniform float uBlindCount;
uniform float uSpotlightRadius;
uniform float uSpotlightSoftness;
uniform float uSpotlightOpacity;
uniform float uMirror;
uniform float uDistort;
uniform float uShineFlip;

uniform vec3 uColor0;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform vec3 uColor5;
uniform vec3 uColor6;
uniform vec3 uColor7;

uniform int uColorCount;
uniform float uLightMode;

varying vec2 vUv;

float rand(vec2 co){
  return fract(
    sin(
      dot(
        co,
        vec2(
          12.9898,
          78.233
        )
      )
    ) *
    43758.5453
  );
}

vec2 rotate2D(vec2 p, float a){
  float c = cos(a);
  float s = sin(a);

  return mat2(
    c,
    -s,
    s,
    c
  ) * p;
}

vec3 getGradientColor(float t){

  float tt =
    clamp(
      t,
      0.0,
      1.0
    );

  int count =
    uColorCount;

  if (count < 2)
    count = 2;

  float scaled =
    tt *
    float(count - 1);

  float seg =
    floor(scaled);

  float f =
    fract(scaled);

  if (seg < 1.0)
    return mix(
      uColor0,
      uColor1,
      f
    );

  if (
    seg < 2.0 &&
    count > 2
  )
    return mix(
      uColor1,
      uColor2,
      f
    );

  if (
    seg < 3.0 &&
    count > 3
  )
    return mix(
      uColor2,
      uColor3,
      f
    );

  if (
    seg < 4.0 &&
    count > 4
  )
    return mix(
      uColor3,
      uColor4,
      f
    );

  if (
    seg < 5.0 &&
    count > 5
  )
    return mix(
      uColor4,
      uColor5,
      f
    );

  if (
    seg < 6.0 &&
    count > 6
  )
    return mix(
      uColor5,
      uColor6,
      f
    );

  if (
    seg < 7.0 &&
    count > 7
  )
    return mix(
      uColor6,
      uColor7,
      f
    );

  if (count > 7)
    return uColor7;

  if (count > 6)
    return uColor6;

  if (count > 5)
    return uColor5;

  if (count > 4)
    return uColor4;

  if (count > 3)
    return uColor3;

  if (count > 2)
    return uColor2;

  return uColor1;
}

void mainImage(
  out vec4 fragColor,
  in vec2 fragCoord
){

  vec2 uv0 =
    fragCoord.xy /
    iResolution.xy;

  float aspect =
    iResolution.x /
    iResolution.y;

  vec2 p =
    uv0 * 2.0 -
    1.0;

  p.x *= aspect;

  vec2 pr =
    rotate2D(
      p,
      uAngle
    );

  pr.x /=
    aspect;

  vec2 uv =
    pr * 0.5 +
    0.5;

  vec2 uvMod =
    uv;

  if (uDistort > 0.0) {

    float a =
      uvMod.y * 6.0;

    float b =
      uvMod.x * 6.0;

    float w =
      0.01 *
      uDistort;

    uvMod.x +=
      sin(a) * w;

    uvMod.y +=
      cos(b) * w;
  }

  float t =
    uvMod.x;

  if (uMirror > 0.5) {

    t =
      1.0 -
      abs(
        1.0 -
        2.0 *
        fract(t)
      );
  }

  vec3 base =
    getGradientColor(t);

  vec2 offset =
    vec2(
      iMouse.x /
      iResolution.x,

      iMouse.y /
      iResolution.y
    );

  float d =
    length(
      uv0 -
      offset
    );

  float r =
    max(
      uSpotlightRadius,
      1e-4
    );

  float dn =
    d / r;

  float spot =
    (
      1.0 -
      2.0 *
      pow(
        dn,
        uSpotlightSoftness
      )
    ) *
    uSpotlightOpacity;

  vec3 cir =
    vec3(spot);

  float blindCount =
    max(
      uBlindCount,
      1.0
    );

  float stripePhase =
    uvMod.x *
    blindCount;

  float stripe =
    fract(
      stripePhase
    );

  float stripeAA =
    clamp(
      blindCount *
      1.25 /
      min(
        iResolution.x,
        iResolution.y
      ),
      0.001,
      0.12
    );

  float edgeDistance =
    min(
      stripe,
      1.0 - stripe
    );

  float edgeBlend =
    1.0 -
    smoothstep(
      0.0,
      stripeAA,
      edgeDistance
    );

  stripe =
    mix(
      stripe,
      0.5,
      edgeBlend
    );

  if (
    uShineFlip >
    0.5
  ) {
    stripe =
      1.0 -
      stripe;
  }

  vec3 ran =
    vec3(stripe);

  vec3 revealSignal =
    cir +
    base -
    ran;

  vec3 col;

  if (
    uLightMode >
    0.5
  ) {

    float peak =
      max(
        base.r,
        max(
          base.g,
          base.b
        )
      );

    vec3 pigment =
      base /
      max(
        peak,
        0.0001
      );

    float neutral =
      min(
        pigment.r,
        min(
          pigment.g,
          pigment.b
        )
      );

    pigment =
      max(
        pigment -
        vec3(
          neutral *
          0.72
        ),
        vec3(0.0)
      );

    pigment /=
      max(
        max(
          pigment.r,
          max(
            pigment.g,
            pigment.b
          )
        ),
        0.0001
      );

    pigment =
      mix(
        pigment,
        pigment *
        pigment,
        0.12
      ) *
      0.72;

    vec3 revealed =
      clamp(
        revealSignal,
        0.0,
        1.0
      );

    float coverage =
      max(
        revealed.r,
        max(
          revealed.g,
          revealed.b
        )
      );

    col =
      mix(
        vec3(1.0),
        pigment,
        coverage
      );

    float grain =
      max(
        rand(
          gl_FragCoord.xy +
          iTime
        ) -
        0.5,
        0.0
      );

    float grainAmount =
      grain *
      uNoise *
      mix(
        0.12,
        0.18,
        coverage
      );

    col =
      clamp(
        col -
        vec3(grainAmount),
        0.0,
        1.0
      );

  } else {

    col =
      revealSignal;

    col +=
      (
        rand(
          gl_FragCoord.xy +
          iTime
        ) -
        0.5
      ) *
      uNoise;
  }

  fragColor =
    vec4(
      col,
      1.0
    );
}

void main(){

  vec4 color;

  mainImage(
    color,
    vUv *
    iResolution.xy
  );

  gl_FragColor =
    color;
}
`;

  class GradientBlinds {
    constructor(container, options = {}) {
      this.container = container;

      this.options = {
        dpr: options.dpr ?? window.devicePixelRatio ?? 1,

        paused: options.paused ?? false,

        gradientColors: options.gradientColors ?? [
          "#233154",
          "#D7B15E",
          "#233154",
        ],

        angle: options.angle ?? 0,

        noise: options.noise ?? 0.3,

        blindCount: options.blindCount ?? 16,

        blindMinWidth: options.blindMinWidth ?? 60,

        mouseDampening: options.mouseDampening ?? 0.15,

        mirrorGradient: options.mirrorGradient ?? false,

        spotlightRadius: options.spotlightRadius ?? 0.5,

        spotlightSoftness: options.spotlightSoftness ?? 1,

        spotlightOpacity: options.spotlightOpacity ?? 1,

        distortAmount: options.distortAmount ?? 0,

        shineDirection: options.shineDirection ?? "left",

        lightMode: options.lightMode ?? false,
      };

      this.canvas = null;

      this.gl = null;

      this.program = null;

      this.positionBuffer = null;

      this.uvBuffer = null;

      this.locations = {};

      this.animationFrame = null;

      this.resizeObserver = null;

      this.pointerTarget = null;

      this.currentMouse = [0, 0];

      this.mouseTarget = [0, 0];

      this.lastTime = 0;

      this.firstResize = true;

      this.handlePointerMove = this.handlePointerMove.bind(this);

      this.render = this.render.bind(this);

      this.resize = this.resize.bind(this);

      this.init();
    }

    createShader(type, source) {
      const shader = this.gl.createShader(type);

      this.gl.shaderSource(shader, source);

      this.gl.compileShader(shader);

      if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
        console.error(
          "GradientBlinds shader error:",
          this.gl.getShaderInfoLog(shader),
        );

        this.gl.deleteShader(shader);

        return null;
      }

      return shader;
    }

    createProgram() {
      const vertexShader = this.createShader(
        this.gl.VERTEX_SHADER,
        vertexShaderSource,
      );

      const fragmentShader = this.createShader(
        this.gl.FRAGMENT_SHADER,
        fragmentShaderSource,
      );

      if (!vertexShader || !fragmentShader) {
        return null;
      }

      const program = this.gl.createProgram();

      this.gl.attachShader(program, vertexShader);

      this.gl.attachShader(program, fragmentShader);

      this.gl.linkProgram(program);

      if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
        console.error(
          "GradientBlinds program error:",
          this.gl.getProgramInfoLog(program),
        );

        return null;
      }

      this.gl.deleteShader(vertexShader);

      this.gl.deleteShader(fragmentShader);

      return program;
    }

    init() {
      if (!this.container) {
        console.error("GradientBlinds: container not found.");

        return;
      }

      this.canvas = document.createElement("canvas");

      this.canvas.style.position = "absolute";

      this.canvas.style.inset = "0";

      this.canvas.style.width = "100%";

      this.canvas.style.height = "100%";

      this.canvas.style.display = "block";

      this.canvas.style.pointerEvents = "none";

      this.container.appendChild(this.canvas);

      this.gl = this.canvas.getContext("webgl", {
        alpha: true,
        antialias: true,
        premultipliedAlpha: false,
      });

      if (!this.gl) {
        console.error("GradientBlinds: WebGL is not supported.");

        return;
      }

      this.program = this.createProgram();

      if (!this.program) {
        return;
      }

      this.gl.useProgram(this.program);

      const uniformNames = [
        "iResolution",
        "iMouse",
        "iTime",
        "uAngle",
        "uNoise",
        "uBlindCount",
        "uSpotlightRadius",
        "uSpotlightSoftness",
        "uSpotlightOpacity",
        "uMirror",
        "uDistort",
        "uShineFlip",
        "uColor0",
        "uColor1",
        "uColor2",
        "uColor3",
        "uColor4",
        "uColor5",
        "uColor6",
        "uColor7",
        "uColorCount",
        "uLightMode",
      ];

      uniformNames.forEach((name) => {
        this.locations[name] = this.gl.getUniformLocation(this.program, name);
      });

      const positions = new Float32Array([-1, -1, 3, -1, -1, 3]);

      const uvs = new Float32Array([0, 0, 2, 0, 0, 2]);

      this.positionBuffer = this.gl.createBuffer();

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

      this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);

      const positionLocation = this.gl.getAttribLocation(
        this.program,
        "position",
      );

      this.gl.enableVertexAttribArray(positionLocation);

      this.gl.vertexAttribPointer(
        positionLocation,
        2,
        this.gl.FLOAT,
        false,
        0,
        0,
      );

      this.uvBuffer = this.gl.createBuffer();

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvBuffer);

      this.gl.bufferData(this.gl.ARRAY_BUFFER, uvs, this.gl.STATIC_DRAW);

      const uvLocation = this.gl.getAttribLocation(this.program, "uv");

      this.gl.enableVertexAttribArray(uvLocation);

      this.gl.vertexAttribPointer(uvLocation, 2, this.gl.FLOAT, false, 0, 0);

      const colors = prepStops(this.options.gradientColors);

      this.gl.uniform1f(
        this.locations.uAngle,
        (this.options.angle * Math.PI) / 180,
      );

      this.gl.uniform1f(this.locations.uNoise, this.options.noise);

      this.gl.uniform1f(
        this.locations.uSpotlightRadius,
        this.options.spotlightRadius,
      );

      this.gl.uniform1f(
        this.locations.uSpotlightSoftness,
        this.options.spotlightSoftness,
      );

      this.gl.uniform1f(
        this.locations.uSpotlightOpacity,
        this.options.spotlightOpacity,
      );

      this.gl.uniform1f(
        this.locations.uMirror,
        this.options.mirrorGradient ? 1 : 0,
      );

      this.gl.uniform1f(this.locations.uDistort, this.options.distortAmount);

      this.gl.uniform1f(
        this.locations.uShineFlip,
        this.options.shineDirection === "right" ? 1 : 0,
      );

      this.gl.uniform1i(this.locations.uColorCount, colors.count);

      this.gl.uniform1f(
        this.locations.uLightMode,
        this.options.lightMode ? 1 : 0,
      );

      for (let i = 0; i < MAX_COLORS; i++) {
        this.gl.uniform3fv(this.locations[`uColor${i}`], colors.arr[i]);
      }

      this.pointerTarget =
        this.container.closest(".vision") || this.container.parentElement;

      if (this.pointerTarget) {
        this.pointerTarget.addEventListener(
          "pointermove",
          this.handlePointerMove,
          {
            passive: true,
          },
        );

        this.pointerTarget.addEventListener(
          "touchmove",
          this.handlePointerMove,
          {
            passive: true,
          },
        );
      }

      this.resizeObserver = new ResizeObserver(this.resize);

      this.resizeObserver.observe(this.container);

      this.resize();

      this.animationFrame = requestAnimationFrame(this.render);

      console.log("GradientBlinds initialized");
    }

    resize() {
      if (!this.gl) {
        return;
      }

      const rect = this.container.getBoundingClientRect();

      const dpr = this.options.dpr || 1;

      const width = Math.max(1, Math.floor(rect.width * dpr));

      const height = Math.max(1, Math.floor(rect.height * dpr));

      this.canvas.width = width;

      this.canvas.height = height;

      this.gl.viewport(0, 0, width, height);

      this.gl.uniform3f(this.locations.iResolution, width, height, 1);

      let effectiveBlindCount = this.options.blindCount;

      if (this.options.blindMinWidth > 0) {
        const maxByMinWidth = Math.max(
          1,
          Math.floor(rect.width / this.options.blindMinWidth),
        );

        effectiveBlindCount = Math.min(this.options.blindCount, maxByMinWidth);
      }

      this.gl.uniform1f(
        this.locations.uBlindCount,
        Math.max(1, effectiveBlindCount),
      );

      if (this.firstResize) {
        this.firstResize = false;

        const x = width / 2;

        const y = height / 2;

        this.currentMouse = [x, y];

        this.mouseTarget = [x, y];

        this.gl.uniform2f(this.locations.iMouse, x, y);
      }
    }

    handlePointerMove(event) {
      if (!this.pointerTarget) {
        return;
      }

      let clientX;

      let clientY;

      if (event.touches && event.touches.length) {
        clientX = event.touches[0].clientX;

        clientY = event.touches[0].clientY;
      } else {
        clientX = event.clientX;

        clientY = event.clientY;
      }

      if (typeof clientX !== "number" || typeof clientY !== "number") {
        return;
      }

      const rect = this.pointerTarget.getBoundingClientRect();

      const dpr = this.options.dpr || 1;

      const x = (clientX - rect.left) * dpr;

      const y = (rect.bottom - clientY) * dpr;

      this.mouseTarget = [x, y];

      if (this.options.mouseDampening <= 0) {
        this.currentMouse = [x, y];

        this.gl.uniform2f(this.locations.iMouse, x, y);
      }
    }

    render(time) {
      this.animationFrame = requestAnimationFrame(this.render);

      if (!this.gl) {
        return;
      }

      const gl = this.gl;

      gl.useProgram(this.program);

      gl.uniform1f(this.locations.iTime, time * 0.001);

      if (this.options.mouseDampening > 0) {
        if (!this.lastTime) {
          this.lastTime = time;
        }

        const dt = Math.max(0, time - this.lastTime) / 1000;

        this.lastTime = time;

        const tau = Math.max(0.0001, this.options.mouseDampening);

        let factor = 1 - Math.exp(-dt / tau);

        factor = Math.min(1, factor);

        this.currentMouse[0] +=
          (this.mouseTarget[0] - this.currentMouse[0]) * factor;

        this.currentMouse[1] +=
          (this.mouseTarget[1] - this.currentMouse[1]) * factor;

        gl.uniform2f(
          this.locations.iMouse,
          this.currentMouse[0],
          this.currentMouse[1],
        );
      }

      if (!this.options.paused) {
        gl.clearColor(0, 0, 0, 0);

        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
    }

    destroy() {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);

        this.animationFrame = null;
      }

      if (this.resizeObserver) {
        this.resizeObserver.disconnect();

        this.resizeObserver = null;
      }

      if (this.pointerTarget) {
        this.pointerTarget.removeEventListener(
          "pointermove",
          this.handlePointerMove,
        );

        this.pointerTarget.removeEventListener(
          "touchmove",
          this.handlePointerMove,
        );

        this.pointerTarget = null;
      }

      if (this.gl && this.program) {
        this.gl.deleteProgram(this.program);
      }

      if (this.gl && this.positionBuffer) {
        this.gl.deleteBuffer(this.positionBuffer);
      }

      if (this.gl && this.uvBuffer) {
        this.gl.deleteBuffer(this.uvBuffer);
      }

      if (this.canvas) {
        this.canvas.remove();

        this.canvas = null;
      }
    }
  }

  window.GradientBlinds = GradientBlinds;

  const init = () => {
    const container = document.getElementById("visionGradientBlinds");

    if (!container) {
      console.error("GradientBlinds: #visionGradientBlinds not found.");

      return;
    }

    if (
      window.visionGradientBlinds &&
      typeof window.visionGradientBlinds.destroy === "function"
    ) {
      window.visionGradientBlinds.destroy();
    }

    window.visionGradientBlinds = new GradientBlinds(container, {
      gradientColors: ["#233154", "#D7B15E", "#233154"],
      angle: 0,
      noise: 0.3,
      blindCount: 16,
      blindMinWidth: 60,
      mouseDampening: 0.15,
      mirrorGradient: false,
      spotlightRadius: 0.5,
      spotlightSoftness: 1,
      spotlightOpacity: 1,
      distortAmount: 0,
      shineDirection: "left",
      lightMode: false,
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {
      once: true,
    });
  } else {
    init();
  }
})();
