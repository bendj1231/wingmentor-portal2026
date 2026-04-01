import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

type GraphicsPerformancePreset = 'low' | 'mid' | 'high';

const fragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uSunColor;
uniform vec3 uAmbientColor;
uniform vec3 uShadowColor;
uniform vec3 uSkyZenith;
uniform vec3 uSkyHorizon;

// 3D Hash
float hash(vec3 p) {
    p = fract(p * vec3(0.1031, 0.1030, 0.0973));
    p += dot(p, p.yxz + 33.33);
    return -1.0 + 2.0 * fract((p.x + p.y) * p.z);
}

// 3D Noise
float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(
            mix(hash(i + vec3(0.0, 0.0, 0.0)), hash(i + vec3(1.0, 0.0, 0.0)), u.x),
            mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), u.x),
            u.y
        ),
        mix(
            mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), u.x),
            mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), u.x),
            u.y
        ),
        u.z
    );
}

// 3D FBM for zooming clouds
float fbm(vec3 p) {
    float f = 0.0;
    float w = 0.5;
    for (int i = 0; i < 5; i++) {
        f += w * noise(p);
        p *= 2.0;
        w *= 0.5;
    }
    return f * 0.5 + 0.5; // Map to [0, 1]
}

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= uResolution.x / uResolution.y;

    float t = uTime * 0.35; // Speed of flying into the clouds
    vec2 wind = vec2(uTime * 0.01, uTime * 0.015);
    
    // Background Sky
    vec3 sky = mix(uSkyHorizon, uSkyZenith, uv.y);
    vec3 col = sky;

    // Sun config for volumetric shading is now passed via uniforms
    vec2 sunPos = vec2(1.0, 2.0); // Light coming from top right

    // Render 4 massive layers of overlapping parallax cumulus clouds
    for(float i = 1.0; i <= 4.0; i++) {
        // Zooming forward into the clouds by progressing the Z-axis of the 3D noise
        vec2 cp2d = (p + wind * (0.6 + i * 0.2)) * (0.8 + i * 0.4); // Scale decreases for foreground
        cp2d.y -= i * 0.15 - 0.5;      // Shift layers vertically
        
        vec3 cp = vec3(cp2d, -t * (0.5 + i * 0.25)); // Move forward through the noise

        // Generate cloud density map using 3D FBM
        float d = fbm(cp);
        
        // Threshold for puffiness. Lower threshold = larger clouds.
        float threshold = 0.45 - i * 0.04; 
        
        // This smoothstep creates the hard, rounded puffy edges characteristics of cumulus
        float cloudAlpha = smoothstep(threshold, threshold + 0.15, d);
        
        if (cloudAlpha > 0.0) {
            // Fake volumetric lighting: sample the density slightly closer to the sun.
            vec3 lightDir = normalize(vec3(sunPos - p, 0.5));
            float shadowSample = fbm(cp + lightDir * 0.15);

            // "thickness" measures how much cloud is between us and the light.
            float thickness = smoothstep(threshold - 0.1, threshold + 0.3, shadowSample);

            // Mix between ambient, shadow and sunlit color based on exposure to 'sun'
            vec3 cloudCol = mix(uSunColor, uAmbientColor, thickness * 1.2);
            cloudCol = mix(uShadowColor, cloudCol, clamp(uv.y + 0.1, 0.0, 1.0));

            // Add delicate subsurface scattering / silver lining rim light at the very edges
            float rimLight = smoothstep(threshold + 0.05, threshold, d);
            cloudCol += uSunColor * rimLight * 0.6;

            // Blend this layer over the sky/previous clouds
            col = mix(col, cloudCol, cloudAlpha * 0.95);
        }
    }

    // Add wispy high-altitude haze for cinematic depth
    vec2 highAltitudeDrift = wind * 2.5;
    float wispDensity = fbm(vec3(p * 3.5 + highAltitudeDrift, t * 0.2 + 2.0));
    float wisps = smoothstep(0.55, 0.85, wispDensity) * 0.25;
    col += vec3(0.9, 0.95, 1.0) * wisps;

    // Fake light shafts
    float ray = max(dot(normalize(vec3(p, 0.2)), normalize(vec3(0.5, 0.8, 0.2))), 0.0);
    float godRay = pow(ray, 8.0) * 0.4;
    col += uSunColor * godRay;

    // Very subtle beautiful vignette to frame the scene
    float dist = length(uv - 0.5);
    float vignette = 1.0 - smoothstep(0.4, 1.0, dist);
    col = mix(col, col * vignette, 0.4); // Light vignette effect

    gl_FragColor = vec4(col, 1.0);
}
`;

const vertexShader = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

const ShaderPlane = ({ variant, speedMultiplier }: { variant: 'light' | 'dark'; speedMultiplier: number }) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const { size } = useThree();

    const uniforms = useMemo(() => {
        // Light mode (Platform): Bright, clean, white clouds with light blue/grey shadows
        const lightModeUniforms = {
            uSunColor: new THREE.Color(1.0, 0.95, 0.88),
            uAmbientColor: new THREE.Color(0.85, 0.92, 1.05), // Bright clouds
            uShadowColor: new THREE.Color(0.68, 0.78, 0.92),
            uSkyZenith: new THREE.Color(0.78, 0.9, 1.0),      // Very pale sky
            uSkyHorizon: new THREE.Color(0.92, 0.97, 1.0),
        };

        // Dark mode (Loading): Moody, deep blue skies with heavy dark shadows
        const darkModeUniforms = {
            uSunColor: new THREE.Color(0.95, 0.9, 0.85),
            uAmbientColor: new THREE.Color(0.35, 0.48, 0.62),   // Dark heavy clouds
            uShadowColor: new THREE.Color(0.18, 0.25, 0.38),
            uSkyZenith: new THREE.Color(0.26, 0.46, 0.72),     // Deep sky blue
            uSkyHorizon: new THREE.Color(0.48, 0.66, 0.85),
        };

        const activeConfig = variant === 'light' ? lightModeUniforms : darkModeUniforms;

        return {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(size.width, size.height) },
            uSunColor: { value: activeConfig.uSunColor },
            uAmbientColor: { value: activeConfig.uAmbientColor },
            uShadowColor: { value: activeConfig.uShadowColor },
            uSkyZenith: { value: activeConfig.uSkyZenith },
            uSkyHorizon: { value: activeConfig.uSkyHorizon },
        };
    }, [size, variant]);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * speedMultiplier;
            materialRef.current.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
        }
    });

    return (
        <mesh>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                ref={materialRef}
                fragmentShader={fragmentShader}
                vertexShader={vertexShader}
                uniforms={uniforms}
                depthWrite={false}
                depthTest={false}
            />
        </mesh>
    );
};

export const CloudBackground = ({ variant = 'light', performancePreset = 'mid', children }: { variant?: 'light' | 'dark'; performancePreset?: GraphicsPerformancePreset; children?: React.ReactNode }) => {
    const shouldUseStaticBackground = performancePreset === 'low';
    const dpr: [number, number] = performancePreset === 'high'
        ? [1, 1.5]
        : performancePreset === 'mid'
            ? [1, 1.2]
            : [0.75, 1];
    const speedMultiplier = performancePreset === 'high'
        ? 1
        : performancePreset === 'mid'
            ? 0.85
            : 0.4;
    const frameLoop = performancePreset === 'high' ? 'always' : 'demand';

    return (
        <>
        <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
            {shouldUseStaticBackground ? (
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: variant === 'light'
                            ? 'linear-gradient(180deg, #dbeafe 0%, #eff6ff 42%, #f8fafc 100%)'
                            : 'linear-gradient(180deg, #27466f 0%, #47688b 48%, #6d8ead 100%)'
                    }}
                />
            ) : (
                <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 1 }} dpr={dpr} frameloop={frameLoop}>
                    <ShaderPlane variant={variant} speedMultiplier={speedMultiplier} />
                </Canvas>
            )}
        </div>
        {children}
        </>
    );
};
