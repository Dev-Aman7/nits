/**
 * Route B — the procedural cell field.
 *
 * Every particle position is solved in the vertex shader from its index. No
 * baked geometry, no position atlas: payload is the shader itself. The gyroid
 * scaffold is found by Newton-projecting a pseudo-random point onto the
 * iso-surface, four steps per particle per frame.
 *
 * Beats:
 *   0 vat            cell-laden hydrogel in suspension
 *   1 exposure       first layer wetted out
 *   2 crosslink      exposed region gels to the gyroid cross-section
 *   3 z-stage        scaffold accumulates
 *   4 self-assembly  spheroids nucleate on the struts
 *   5 construct      scaffold plus a bifurcating vascular channel
 */

export const CELL_RESOLUTION = 160;
export const CELL_COUNT = CELL_RESOLUTION * CELL_RESOLUTION;

/**
 * Per-particle seed — deterministic, NOT Math.random().
 *
 * Approach and Scale render the same cloud at the moment one hands over to the
 * other. With random seeds the two clouds are different arrangements of the
 * same shape, so the handoff reads as a flicker no matter how the fades are
 * tuned. Seeding from the index makes them pixel-identical, and the handoff
 * becomes invisible.
 */
export function seedFor(i: number): number {
  let x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  x -= Math.floor(x);
  return x;
}

/**
 * Shared clock. Both fields must agree on time or their ambient rotation
 * drifts apart and the handoff jumps.
 */
export function sharedTime(reduced: boolean): number {
  return reduced ? 0 : performance.now() / 1000;
}

/** Camera the two fields meet at — Approach ends here, Scale starts here. */
export const HANDOFF = {
  dist: 4.55,
  ele: 0.42,
  lookY: -0.06,
  lateral: -1.12,
} as const;

export const CELL_VERTEX_SHADER = /* glsl */ `
attribute float aIdx;
attribute float aSeed;

uniform float uBeatA;       // morph source beat
uniform float uBeatB;       // morph target beat
uniform float uMix;         // 0..1 between them
uniform float uDisperse;    // 1 = scattered far out, 0 = settled on the beat
uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;

varying float vState;
varying float vGel;
varying float vEdge;

const float RES = ${CELL_RESOLUTION}.0;
const float YLO = -0.80;
const float YHI =  0.80;
const float RV  =  0.92;
const float TAU = 6.2831853;

float hash11(float p){ p = fract(p*0.1031); p *= p+33.33; p *= p+p; return fract(p); }
vec3  hash31(float p){ return vec3(hash11(p), hash11(p+37.1), hash11(p+91.7)); }

/* gyroid triply-periodic minimal surface — the topology actually printed
   for perfusable constructs: open porosity, high surface-to-volume */
float gyro(vec3 p, float f){
  p *= f;
  return sin(p.x)*cos(p.y) + sin(p.y)*cos(p.z) + sin(p.z)*cos(p.x);
}
vec3 gyroGrad(vec3 p, float f){
  vec3 q = p*f;
  return f*vec3(
    cos(q.x)*cos(q.y) - sin(q.z)*sin(q.x),
    cos(q.y)*cos(q.z) - sin(q.x)*sin(q.y),
    cos(q.z)*cos(q.x) - sin(q.y)*sin(q.z));
}
vec3 projGyro(vec3 p, float f){
  for(int i=0;i<4;i++){
    float v = gyro(p,f);
    vec3  g = gyroGrad(p,f);
    p -= g * (v / (dot(g,g) + 1e-3));
  }
  return p;
}

vec3 inCyl(vec3 h, float ylo, float yhi){
  float a = h.x * TAU;
  /* Uniform disk out to RV, plus a long thinning tail past it — the outer
     half of the disk (by h.y, which already skews outward under sqrt)
     drifts well beyond RV, so density fades out gradually over a wide
     distance instead of stopping at a wall. Paired with the radial alpha
     falloff below, this is what actually reads as flowing into the
     background rather than being cut off. */
  float r = RV * sqrt(h.y) + RV * 1.3 * pow(h.y, 2.2);
  return vec3(r*cos(a), mix(ylo, yhi, h.z), r*sin(a));
}

vec3 solve(float id, float b){
  vec3 h = hash31(id*1.7 + 3.1);
  float frac = id / (RES*RES);

  if(b < 0.5){
    return inCyl(h, YLO, YHI);
  } else if(b < 1.5){
    if(frac < 0.34) return inCyl(h, YLO+0.01, YLO+0.01);
    return inCyl(h, YLO+0.10, YHI);
  } else if(b < 2.5){
    if(frac < 0.34){
      vec3 d = inCyl(h, YLO+0.01, YLO+0.01);
      vec3 g = projGyro(d, 6.2);
      return vec3(g.x, YLO+0.01, g.z);
    }
    return inCyl(h, YLO+0.10, YHI);
  } else if(b < 3.5){
    if(frac < 0.76) return projGyro(inCyl(h, YLO, 0.30), 6.2);
    return inCyl(h, 0.38, YHI);
  } else if(b < 4.5){
    float cl = floor(id / (RES*RES/44.0));
    vec3 c = projGyro(inCyl(hash31(cl*13.7+5.0), YLO+0.05, YHI-0.05), 6.2);
    vec3 v = normalize(hash31(id*2.3+11.0)*2.0 - 1.0 + 0.0001);
    return c + v * (0.055 + 0.05*hash11(id*0.7));
  }

  if(frac < 0.70) return projGyro(inCyl(h, YLO, YHI), 6.2);
  float t = hash11(id*3.3);
  float br = floor(hash11(id*5.1)*4.0);
  float ang = br * 1.5707963;
  float y = mix(YLO, YHI, t);
  float spread = smoothstep(0.15, 1.0, t) * 0.62;
  vec3 axis = vec3(cos(ang)*spread, y, sin(ang)*spread);
  float rad = 0.085 * (1.0 - 0.55*t);
  float th = hash11(id*7.9)*TAU;
  return axis + vec3(cos(th)*rad, 0.0, sin(th)*rad);
}

vec3 drift(vec3 p, float t){
  return vec3(
    sin(p.y*3.1 + t*0.7) + sin(p.z*2.3 - t*0.5),
    sin(p.z*2.7 + t*0.6) + sin(p.x*3.3 - t*0.4),
    sin(p.x*2.9 + t*0.5) + sin(p.y*2.1 - t*0.6)) * 0.5;
}

void main(){
  float b0 = uBeatA;
  float b1 = uBeatB;
  float f  = uMix;
  f = f*f*(3.0 - 2.0*f);

  /* what the field is effectively showing, for colour and settling */
  float beatEff = mix(uBeatA, uBeatB, f);

  /* stagger per particle so material arrives in waves, not all at once */
  float lead = aSeed * 0.34;
  float fp = clamp((f - lead) / (1.0 - lead + 1e-3), 0.0, 1.0);
  fp = fp*fp*(3.0 - 2.0*fp);

  vec3 p = mix(solve(aIdx, b0), solve(aIdx, b1), fp);

  vState = hash11(aIdx*1.3);

  float gel = smoothstep(0.9, 2.1, beatEff);
  float above = smoothstep(-0.1, 0.5, p.y - mix(0.9, -0.8 + beatEff*0.42, step(0.5, beatEff)));
  float fluid = clamp((1.0 - gel) + above*0.7, 0.0, 1.0);
  vGel = 1.0 - fluid;

  p += drift(p*1.4, uTime) * (0.016 * fluid + 0.0035);

  /* Scatter: each particle is pushed out along its own axis by its own
     distance, so they arrive at different times and from every direction
     rather than as one shrinking ball. */
  if(uDisperse > 0.0005){
    vec3 dir = normalize(p + vec3(0.0011, 0.0007, 0.0013));
    float reach = 1.1 + 4.2 * hash11(aIdx * 0.37 + 5.0);
    float lag = 0.55 + 0.45 * hash11(aIdx * 0.91 + 17.0);
    p += dir * uDisperse * lag * reach;
  }

  /* a slow breath once the construct is alive */
  p *= 1.0 + sin(uTime*0.55 + vState*TAU) * 0.004 * smoothstep(3.4, 4.6, beatEff);

  /* Brightness fades with radial distance from the core, on top of the
     tail thinning out in solve()/inCyl above — density and brightness
     taper together, so the field flows into the background rather than
     reading as an edge. */
  float rad = length(p.xz);
  vEdge = 1.0 - smoothstep(0.75, 2.3, rad);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float sz = uSize * (0.55 + 0.9*vState) * (1.0 + 0.55*vGel);
  gl_PointSize = clamp(sz * uPixelRatio * (7.0 / -mv.z), 1.0, 26.0);
  gl_Position = projectionMatrix * mv;
}
`;

export const CELL_FRAGMENT_SHADER = /* glsl */ `
precision mediump float;

uniform vec3  uCell;
uniform vec3  uHot;
uniform float uAlpha;

varying float vState;
varying float vGel;
varying float vEdge;

void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.08, d);
  if(a < 0.01) discard;
  vec3 c = mix(uCell, uHot, vGel * (0.35 + 0.65*vState));
  gl_FragColor = vec4(c, a * uAlpha * (0.34 + 0.66*vGel) * vEdge);
}
`;
