precision mediump float;

// this is the same variable we declared in the vertex shader
// we need to declare it here too!
varying vec3 vPosition;
uniform float uBaseHeight;

void main() {

  // copy the vTexCoord
  // vTexCoord is a value that goes from 0.0 - 1.0 depending on the pixels location
  // we can use it to access every pixel on the screen
  vec3 pos = vPosition;
  
  // lets use the texcoords as a mask for the mix function
  // what happens if you choose coord.y instead?
  // what about length(coord) ?
  float zPosition = pos.z;

  // honestly stolen from https://www.shadertoy.com/view/4dsSzr
  vec3 heatmapGradient(float t) {
    if(t==0.){
      return vec3(0.2,0.2,0.2);
    }else if(t>0.&&t<0.15){
      return vec3(0,0,0);
    }else{
      return clamp((pow(t, 1.5) * 0.8 + 0.2) * vec3(smoothstep(0.0, 0.35, t) + t * 0.5, smoothstep(0.5, 1.0, t), max(1.0 - t * 1.7, t * 7.0 - 6.0)), 0.0, 1.0);
    }
  }

  void main() {
    gl_FragColor = vec4(heatmapGradient(zPosition/baseHeight), 1);
  }
  //gl_FragColor = vec4(gradient, 1.0 );
}