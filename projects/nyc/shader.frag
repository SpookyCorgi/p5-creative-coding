precision mediump float;

// this is the same variable we declared in the vertex shader
// we need to declare it here too!
varying vec4 vWorldPosition;

//box height from our js code
uniform float uBaseHeight;

//from https://www.shadertoy.com/view/4dsSzr
vec3 heatmapGradient(float t) {
  if(t<=0.02){
    return vec3(0.2,0.2,0.2);
  }else if(t>0.02&&t<0.15){
    return vec3(0,0,0);
  }else{
    return clamp((pow(t, 1.5) * 0.8 + 0.2) * vec3(smoothstep(0.0, 0.35, t) + t * 0.5, smoothstep(0.5, 1.0, t), max(1.0 - t * 1.7, t * 7.0 - 6.0)), 0.0, 1.0);
  }
}

void main() { 

  float zPosition = vWorldPosition.z;

  gl_FragColor = vec4(heatmapGradient(1.-(zPosition/uBaseHeight)), 1);
}