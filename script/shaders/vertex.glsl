attribute float aDelay;
varying float vDelay;
varying vec2 vUv;
uniform float progress;

void main() {
 vUv = uv;
 vDelay = aDelay;
 gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}