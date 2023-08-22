uniform float colorR;
uniform float colorG;
uniform float colorB;
uniform float alpha;
uniform float progress;

varying vec2 vUv;
varying float vDelay;

void main() {
 gl_FragColor = vec4(colorR, colorG, colorB, progress);
}