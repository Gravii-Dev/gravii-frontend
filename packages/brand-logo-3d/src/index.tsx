"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	type CSSProperties,
	type MutableRefObject,
} from "react";
import {
	CanvasTexture,
	CatmullRomCurve3,
	ExtrudeGeometry,
	Path,
	RepeatWrapping,
	Shape,
	TubeGeometry,
	Vector3,
	type Group,
} from "three";

type PointerState = {
	active: boolean;
	spinNonce: number;
	spinRotations: SpinRotations;
};

export type SpinRotations = 1 | 2;

type LogoSpinAnimation = {
	elapsed: number;
	duration: number;
	startRingY: number;
	startSmilePhase: number;
	targetRingY: number;
	targetSmilePhase: number;
};

export type LogoVariant = "default" | "nav";
export type LogoTone = "dark" | "light";

export type GraviiLogo3DProps = {
	animated?: boolean;
	className?: string | undefined;
	interactive?: boolean;
	spinSignal?: number | undefined;
	spinSignalRotations?: SpinRotations | undefined;
	tone?: LogoTone;
	variant?: LogoVariant;
};

type LogoSceneProps = {
	animated: boolean;
	isNavVariant: boolean;
	pointerRef: MutableRefObject<PointerState>;
	reducedMotion: boolean;
	showFloorShadow: boolean;
	surfaceTexture: CanvasTexture | null;
	tone: LogoTone;
};

const RING_OUTER_RADIUS = 1;
const RING_INNER_RADIUS = 0.6;
const SMILE_CENTERLINE_RADIUS = 1.4;
const SMILE_HALF_CHORD = 1.25;
const SMILE_TUBE_RADIUS = 0.2;
const INTRO_DURATION_SECONDS = 1.08;
const SMILE_DELAY_SECONDS = 0.24;
const FULL_SPIN_RADIANS = Math.PI * 2;
const HOVER_SPIN_DURATION_SECONDS = 0.42;
const CLICK_SPIN_DURATION_SECONDS = 0.62;
const SMILE_EDGE_ON_SCALE = 0.04;
const LOGO_BASE_POSITION_Y = -0.05;
const NAV_LOGO_BASE_POSITION_Y = 0.14;
const LOGO_BASE_ROTATION_X = 0.18;
const IDLE_BREATH_SPEED = 1.68;
const IDLE_BREATH_LIFT = 0.035;
const NAV_IDLE_BREATH_LIFT = 0.02;
const IDLE_BREATH_SCALE = 0.026;
const NAV_IDLE_BREATH_SCALE = 0.016;
const IDLE_BREATH_TILT = 0.018;
const NAV_IDLE_BREATH_TILT = 0.012;
const IDLE_WEIGHT_RESPONSE = 3.4;
const ROOT_STYLE_BASE: CSSProperties = {
	background: "transparent",
	display: "block",
	overflow: "visible",
	position: "relative",
};
const CANVAS_STYLE_BASE: CSSProperties = {
	background: "transparent",
	display: "block",
	height: "100%",
	inset: 0,
	position: "absolute",
	transition: "opacity 120ms ease-out",
	width: "100%",
	zIndex: 1,
};

function clamp01(value: number) {
	return Math.min(1, Math.max(0, value));
}

function easeOutCubic(value: number) {
	const t = clamp01(value);
	return 1 - (1 - t) ** 3;
}

function positiveModulo(value: number, modulo: number) {
	return ((value % modulo) + modulo) % modulo;
}

function getClockwiseFrontFacingTarget(
	startRotation: number,
	rotations: SpinRotations,
) {
	const returnToFront =
		(FULL_SPIN_RADIANS - positiveModulo(startRotation, FULL_SPIN_RADIANS)) %
		FULL_SPIN_RADIANS;

	return startRotation + FULL_SPIN_RADIANS * rotations + returnToFront;
}

function getCounterClockwiseFrontFacingTarget(
	startRotation: number,
	rotations: SpinRotations,
) {
	const returnToFront =
		(FULL_SPIN_RADIANS - positiveModulo(-startRotation, FULL_SPIN_RADIANS)) %
		FULL_SPIN_RADIANS;

	return startRotation - FULL_SPIN_RADIANS * rotations - returnToFront;
}

function createRingGeometry() {
	const shape = new Shape();
	shape.absellipse(
		0,
		0,
		RING_OUTER_RADIUS,
		RING_OUTER_RADIUS,
		0,
		Math.PI * 2,
		false,
		0,
	);

	const hole = new Path();
	hole.absellipse(
		0,
		0,
		RING_INNER_RADIUS,
		RING_INNER_RADIUS,
		0,
		Math.PI * 2,
		true,
		0,
	);
	shape.holes.push(hole);

	const geometry = new ExtrudeGeometry(shape, {
		bevelEnabled: true,
		bevelSegments: 12,
		bevelSize: 0.035,
		bevelThickness: 0.035,
		curveSegments: 128,
		depth: 0.22,
	});
	geometry.center();
	geometry.computeVertexNormals();
	return geometry;
}

function createSmilePoints() {
	const points: Vector3[] = [];
	const pointCount = 80;

	for (let index = 0; index <= pointCount; index += 1) {
		const progress = index / pointCount;
		const x = -SMILE_HALF_CHORD + SMILE_HALF_CHORD * 2 * progress;
		const y = -Math.sqrt(SMILE_CENTERLINE_RADIUS ** 2 - x ** 2);
		points.push(new Vector3(x, y, 0));
	}

	return points;
}

function createSmileGeometry(points: Vector3[]) {
	const curve = new CatmullRomCurve3(points);
	const geometry = new TubeGeometry(curve, 128, SMILE_TUBE_RADIUS, 32, false);
	geometry.computeVertexNormals();
	return geometry;
}

function usePrefersReducedMotion() {
	const [reducedMotion, setReducedMotion] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		const syncPreference = () => setReducedMotion(mediaQuery.matches);

		syncPreference();
		mediaQuery.addEventListener("change", syncPreference);

		return () => {
			mediaQuery.removeEventListener("change", syncPreference);
		};
	}, []);

	return reducedMotion;
}

function useProceduralSurfaceTexture() {
	const texture = useMemo(() => {
		if (typeof document === "undefined") {
			return null;
		}

		const size = 96;
		const canvas = document.createElement("canvas");
		canvas.width = size;
		canvas.height = size;

		const context = canvas.getContext("2d");
		if (!context) {
			return null;
		}

		const imageData = context.createImageData(size, size);

		for (let y = 0; y < size; y += 1) {
			for (let x = 0; x < size; x += 1) {
				const offset = (y * size + x) * 4;
				const rawNoise = Math.sin((x * 12.9898 + y * 78.233) * 43758.5453);
				const grain = rawNoise - Math.floor(rawNoise);
				const value = 118 + Math.round(grain * 44);

				imageData.data[offset] = value;
				imageData.data[offset + 1] = value;
				imageData.data[offset + 2] = value;
				imageData.data[offset + 3] = 255;
			}
		}

		context.putImageData(imageData, 0, 0);

		const nextTexture = new CanvasTexture(canvas);
		nextTexture.wrapS = RepeatWrapping;
		nextTexture.wrapT = RepeatWrapping;
		nextTexture.repeat.set(5, 5);
		nextTexture.needsUpdate = true;

		return nextTexture;
	}, []);

	useEffect(() => {
		return () => {
			texture?.dispose();
		};
	}, [texture]);

	return texture;
}

function LogoScene({
	animated,
	isNavVariant,
	pointerRef,
	reducedMotion,
	showFloorShadow,
	surfaceTexture,
	tone,
}: LogoSceneProps) {
	const logoRef = useRef<Group>(null);
	const ringSpinRef = useRef<Group>(null);
	const smileSpinRef = useRef<Group>(null);
	const smileRevealRef = useRef<Group>(null);
	const smileSpinPhaseRef = useRef(0);
	const idleWeightRef = useRef(0);
	const activeSpinRef = useRef<LogoSpinAnimation | null>(null);
	const lastSpinNonceRef = useRef(0);
	const ringGeometry = useMemo(() => createRingGeometry(), []);
	const smilePoints = useMemo(() => createSmilePoints(), []);
	const smileGeometry = useMemo(
		() => createSmileGeometry(smilePoints),
		[smilePoints],
	);
	const leftCapPosition = smilePoints[0] ?? new Vector3();
	const rightCapPosition = smilePoints[smilePoints.length - 1] ?? new Vector3();
	const materialColor = tone === "light" ? "#f7f1e4" : "#17140f";

	useEffect(() => {
		return () => {
			ringGeometry.dispose();
			smileGeometry.dispose();
		};
	}, [ringGeometry, smileGeometry]);

	useFrame((state, delta) => {
		const logo = logoRef.current;
		const ringSpin = ringSpinRef.current;
		const smileSpin = smileSpinRef.current;
		const smileReveal = smileRevealRef.current;

		if (!(logo && ringSpin && smileSpin && smileReveal)) {
			return;
		}

		const time = state.clock.getElapsedTime();
		const clampedDelta = Math.min(0.05, Math.max(1 / 240, delta));
		const canIntroAnimate = animated && !reducedMotion;
		const canIdleAnimate = !reducedMotion;
		const introProgress = canIntroAnimate
			? easeOutCubic(time / INTRO_DURATION_SECONDS)
			: 1;
		const smileProgress = canIntroAnimate
			? easeOutCubic((time - SMILE_DELAY_SECONDS) / INTRO_DURATION_SECONDS)
			: 1;
		const pointer = pointerRef.current;

		if (reducedMotion) {
			lastSpinNonceRef.current = pointer.spinNonce;
			activeSpinRef.current = null;
		} else if (pointer.spinNonce !== lastSpinNonceRef.current) {
			lastSpinNonceRef.current = pointer.spinNonce;
			activeSpinRef.current = {
				elapsed: 0,
				duration:
					pointer.spinRotations === 2
						? CLICK_SPIN_DURATION_SECONDS
						: HOVER_SPIN_DURATION_SECONDS,
				startRingY: ringSpin.rotation.y,
				startSmilePhase: smileSpinPhaseRef.current,
				targetRingY: getClockwiseFrontFacingTarget(
					ringSpin.rotation.y,
					pointer.spinRotations,
				),
				targetSmilePhase: getCounterClockwiseFrontFacingTarget(
					smileSpinPhaseRef.current,
					pointer.spinRotations,
				),
			};
		}

		const activeSpin = activeSpinRef.current;

		if (activeSpin) {
			activeSpin.elapsed += clampedDelta;

			const spinProgress = clamp01(activeSpin.elapsed / activeSpin.duration);
			const easedSpinProgress = easeOutCubic(spinProgress);

			ringSpin.rotation.y =
				activeSpin.startRingY +
				(activeSpin.targetRingY - activeSpin.startRingY) * easedSpinProgress;

			const smilePhase =
				activeSpin.startSmilePhase +
				(activeSpin.targetSmilePhase - activeSpin.startSmilePhase) *
					easedSpinProgress;

			smileSpinPhaseRef.current = smilePhase;
			smileSpin.rotation.y = 0;
			smileSpin.scale.x = Math.max(
				SMILE_EDGE_ON_SCALE,
				Math.abs(Math.cos(smilePhase)),
			);

			if (spinProgress >= 1) {
				ringSpin.rotation.y = 0;
				smileSpinPhaseRef.current = 0;
				smileSpin.rotation.y = 0;
				smileSpin.scale.x = 1;
				activeSpinRef.current = null;
			}
		}

		const idleWeightTarget =
			canIdleAnimate && !pointer.active && activeSpinRef.current === null ? 1 : 0;
		idleWeightRef.current +=
			(idleWeightTarget - idleWeightRef.current) *
			Math.min(1, clampedDelta * IDLE_WEIGHT_RESPONSE);

		const idleWeight = idleWeightRef.current;
		const introFloatY = canIntroAnimate ? Math.sin(time * 1.42) * 0.02 : 0;
		const breath = Math.sin(time * IDLE_BREATH_SPEED);
		const breathLift = isNavVariant ? NAV_IDLE_BREATH_LIFT : IDLE_BREATH_LIFT;
		const breathScale = isNavVariant ? NAV_IDLE_BREATH_SCALE : IDLE_BREATH_SCALE;
		const breathTilt = isNavVariant ? NAV_IDLE_BREATH_TILT : IDLE_BREATH_TILT;
		const logoBasePositionY = isNavVariant
			? NAV_LOGO_BASE_POSITION_Y
			: LOGO_BASE_POSITION_Y;
		const idleLift = breath * breathLift * idleWeight;
		const idleScale =
			1 +
			Math.sin(time * IDLE_BREATH_SPEED - 0.42) *
				breathScale *
				idleWeight;
		const idleTilt =
			Math.sin(time * (IDLE_BREATH_SPEED * 0.72) + 0.6) *
			breathTilt *
			idleWeight;

		logo.position.y = logoBasePositionY + introFloatY + idleLift;
		logo.rotation.x = LOGO_BASE_ROTATION_X + idleTilt;
		logo.scale.setScalar((0.82 + introProgress * 0.18) * idleScale);
		smileReveal.scale.x = Math.max(0.001, smileProgress);
	});

	return (
		<group
			ref={logoRef}
			position={[0, 0.18, 0]}
			rotation={[LOGO_BASE_ROTATION_X, 0, 0]}
		>
			<group ref={ringSpinRef}>
				<mesh castShadow geometry={ringGeometry}>
					<meshPhysicalMaterial
						bumpMap={surfaceTexture}
						bumpScale={0.012}
						clearcoat={0.48}
						clearcoatRoughness={0.24}
						color={materialColor}
						metalness={0.16}
						roughness={0.42}
						roughnessMap={surfaceTexture}
					/>
				</mesh>
			</group>
			<group ref={smileSpinRef}>
				<group ref={smileRevealRef}>
					<mesh castShadow geometry={smileGeometry}>
						<meshPhysicalMaterial
							bumpMap={surfaceTexture}
							bumpScale={0.012}
							clearcoat={0.52}
							clearcoatRoughness={0.22}
							color={materialColor}
							metalness={0.14}
							roughness={0.44}
							roughnessMap={surfaceTexture}
						/>
					</mesh>
					<mesh castShadow position={leftCapPosition}>
						<sphereGeometry args={[SMILE_TUBE_RADIUS, 32, 24]} />
						<meshPhysicalMaterial
							bumpMap={surfaceTexture}
							bumpScale={0.012}
							clearcoat={0.52}
							clearcoatRoughness={0.22}
							color={materialColor}
							metalness={0.14}
							roughness={0.44}
							roughnessMap={surfaceTexture}
						/>
					</mesh>
					<mesh castShadow position={rightCapPosition}>
						<sphereGeometry args={[SMILE_TUBE_RADIUS, 32, 24]} />
						<meshPhysicalMaterial
							bumpMap={surfaceTexture}
							bumpScale={0.012}
							clearcoat={0.52}
							clearcoatRoughness={0.22}
							color={materialColor}
							metalness={0.14}
							roughness={0.44}
							roughnessMap={surfaceTexture}
						/>
					</mesh>
				</group>
			</group>
			{showFloorShadow ? (
				<mesh
					position={[0, -1.6, -0.34]}
					receiveShadow
					rotation={[-Math.PI / 2, 0, 0]}
				>
					<circleGeometry args={[1.65, 80]} />
					<shadowMaterial opacity={0.16} transparent />
				</mesh>
			) : null}
		</group>
	);
}

export function GraviiLogo3D({
	animated = true,
	className,
	interactive = true,
	spinSignal,
	spinSignalRotations = 1,
	tone = "dark",
	variant = "default",
}: GraviiLogo3DProps) {
	const reducedMotion = usePrefersReducedMotion();
	const surfaceTexture = useProceduralSurfaceTexture();
	const [canvasReady, setCanvasReady] = useState(false);
	const pointerRef = useRef<PointerState>({
		active: false,
		spinNonce: 0,
		spinRotations: 1,
	});
	const lastSpinSignalRef = useRef(
		spinSignal !== undefined && spinSignal > 0 ? undefined : spinSignal,
	);
	const isNavVariant = variant === "nav";
	const rootStyle = useMemo<CSSProperties>(
		() => ({
			...ROOT_STYLE_BASE,
			...(className ? {} : { height: "100%", width: "100%" }),
			minHeight: isNavVariant ? 0 : "7rem",
			touchAction: isNavVariant || reducedMotion ? "auto" : "none",
		}),
		[className, isNavVariant, reducedMotion],
	);
	const canvasStyle = useMemo<CSSProperties>(
		() => ({
			...CANVAS_STYLE_BASE,
			opacity: canvasReady ? 1 : 0,
		}),
		[canvasReady],
	);

	const requestSpin = useCallback(
		(spinRotations: SpinRotations) => {
			if (reducedMotion) {
				return;
			}

			pointerRef.current.spinRotations = spinRotations;
			pointerRef.current.spinNonce += 1;
		},
		[reducedMotion],
	);

	useEffect(() => {
		if (spinSignal === undefined || lastSpinSignalRef.current === spinSignal) {
			return;
		}

		lastSpinSignalRef.current = spinSignal;
		requestSpin(spinSignalRotations);
	}, [requestSpin, spinSignal, spinSignalRotations]);

	const handlePointerEnter = useCallback(() => {
		if (!interactive) {
			return;
		}

		const wasActive = pointerRef.current.active;
		pointerRef.current.active = true;

		if (!wasActive) {
			requestSpin(1);
		}
	}, [interactive, requestSpin]);

	const handlePointerLeave = useCallback(() => {
		pointerRef.current.active = false;
	}, []);

	const handlePointerDown = useCallback(() => {
		if (!interactive) {
			return;
		}

		requestSpin(2);
	}, [interactive, requestSpin]);

	return (
		<div
			aria-hidden="true"
			className={className}
			data-ready={canvasReady ? "true" : undefined}
			onPointerDownCapture={interactive ? handlePointerDown : undefined}
			onPointerEnter={interactive ? handlePointerEnter : undefined}
			onPointerLeave={interactive ? handlePointerLeave : undefined}
			style={rootStyle}
		>
			<Canvas
				camera={{
					far: 18,
					fov: isNavVariant ? 34 : 34,
					near: 0.1,
					position: isNavVariant ? [0, 0.04, 5.35] : [0, -0.02, 5.4],
				}}
				dpr={[1, 1.65]}
				gl={{
					alpha: true,
					antialias: true,
					powerPreference: "high-performance",
				}}
					resize={{ debounce: 120, scroll: false }}
					shadows
					onCreated={({ gl }) => {
						gl.setClearColor(0x000000, 0);
						gl.clear(true, true, true);
						setCanvasReady(true);
					}}
					style={canvasStyle}
				>
				<ambientLight color="#fff7e8" intensity={1.15} />
				<directionalLight
					castShadow
					color="#fff0d6"
					intensity={2.65}
					position={[2.9, 3.8, 4.8]}
				/>
				<directionalLight
					color="#9eb4d9"
					intensity={0.42}
					position={[-2.8, -1.2, 2.2]}
				/>
				<pointLight
					color="#f5c45a"
					intensity={0.55}
					position={[0, -1.9, 2.1]}
				/>
				<LogoScene
					animated={animated}
					isNavVariant={isNavVariant}
					pointerRef={pointerRef}
					reducedMotion={reducedMotion}
					showFloorShadow={!isNavVariant}
					surfaceTexture={surfaceTexture}
					tone={tone}
				/>
			</Canvas>
		</div>
	);
}

export default GraviiLogo3D;
