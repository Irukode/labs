#version 330 core

uniform mat4 model, view, projection;

// Light properties
const vec3 WorldSpace_lightPos = vec3(2, 2, 2); // world-space light position
uniform vec3 lightColor;
uniform float lightIntensity;

// Attenuation Properties
uniform float attQuadratic;
uniform float attLinear;
uniform float attConstant;

// Material properties
uniform vec3 color;
uniform float ambientIntensity;
uniform float diffuseIntensity;
uniform float specularIntensity;
uniform float shininess;

in vec3 CameraSpace_position; // eye-space position
in vec3 CameraSpace_normal;   // eye-space normal

out vec3 fragColor;

void main(){
    // some vectors that might be helpful (all in camera space, so if you're working in world
    // space you'll need to do these differently)
    vec3 CameraSpace_toLight = (view*vec4(WorldSpace_lightPos,1)).xyz - CameraSpace_position;
    vec3 CameraSpace_toLight_n = normalize(CameraSpace_toLight); // normalized, camera-space vector to light
    vec3 CameraSpace_toEye_n = -normalize(CameraSpace_position); // normalized, camera-space vector to eye
    vec3 CameraSpace_normal_n = normalize(CameraSpace_normal);   // normalized, camera-space normal

    fragColor = color;
    // to do: phong lighting model
    fragColor = fragColor * ambientIntensity;
    // diffuse color
    float d = length(CameraSpace_toLight);
    float attenuation = lightIntensity * min(1/ (attConstant + attLinear * d + attQuadratic * pow(d, 2.f)), 1);
    float nL = max(0, dot(CameraSpace_normal_n, CameraSpace_toLight_n));
    fragColor += (color * lightColor * diffuseIntensity * nL) * attenuation;
    // specular color
    float rE = max(0, dot(CameraSpace_toEye_n, reflect(-CameraSpace_toLight_n, CameraSpace_normal_n)));
    fragColor += color * lightColor * specularIntensity * pow(rE, shininess) * attenuation;
}
