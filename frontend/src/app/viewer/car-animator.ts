import * as mapboxgl from 'mapbox-gl';

/* This script is vibecoded, but works very well. */

/**
 * Smoothly animates a Mapbox GeoJSON symbol source (the car icon) between
 * successive GPS positions using requestAnimationFrame.
 *
 * Usage:
 *   const animator = new CarAnimator(map.getSource('car-arrow') as GeoJSONSource);
 *   // Call moveTo() every time a new location arrives (e.g. from WebSocket).
 *   animator.moveTo([lng, lat], heading);
 *   // Call cancel() when the component is destroyed to avoid dangling RAF callbacks.
 *   animator.cancel();
 */
export class CarAnimator {
    // Handle returned by requestAnimationFrame — null when no animation is running.
    private _rafHandle: number | null = null

    // Timestamp (from the rAF callback) at which the current animation segment started.
    // Null until the first tick of the current segment fires.
    private _segmentStartTime: number | null = null

    // The interpolated position and heading at the START of the current animation segment.
    // Updated each time moveTo() is called so mid-flight interruptions are seamless.
    private _segmentFromCoords: [number, number] = [0, 0]
    private _segmentFromHeading: number = 0

    // The target position and heading for the current animation segment.
    private _segmentToCoords: [number, number] = [0, 0]
    private _segmentToHeading: number = 0

    // True after the first moveTo() call. The very first position is snapped instantly
    // (no animation) because there is no meaningful "previous" location to animate from.
    private _hasInitialPosition: boolean = false

    constructor(
        /** The Mapbox GeoJSON source that drives the car symbol layer. */
        private readonly source: mapboxgl.GeoJSONSource,
        /** Total duration of each position-to-position animation in milliseconds. */
        private readonly durationMs: number = 900
    ) { }

    /**
     * Animate the car icon to a new [longitude, latitude] and heading.
     * - First call: snaps the icon to the position immediately (no animation).
     * - Subsequent calls: smoothly interpolates from the current visual position,
     *   even if a previous animation is still mid-flight.
     */
    moveTo(coords: [number, number], heading: number): void {
        if (!this._hasInitialPosition) {
            this._snapToPosition(coords, heading)
            return
        }

        // Sample where the car visually IS right now (may be mid-animation).
        // Using this as the new segment start prevents the icon from jumping backwards
        // when a new GPS update arrives before the previous animation finishes.
        const visualProgress = this._currentProgress()
        const currentVisualCoords: [number, number] = [
            this._lerp(this._segmentFromCoords[0], this._segmentToCoords[0], visualProgress),
            this._lerp(this._segmentFromCoords[1], this._segmentToCoords[1], visualProgress)
        ]
        const currentVisualHeading = this._lerpAngle(this._segmentFromHeading, this._segmentToHeading, visualProgress)

        this._startAnimationSegment(currentVisualCoords, coords, currentVisualHeading, heading)
    }

    /**
     * Cancel any running animation and release the RAF callback.
     * Should be called from the component's ngOnDestroy.
     */
    cancel(): void {
        if (this._rafHandle !== null) {
            cancelAnimationFrame(this._rafHandle)
            this._rafHandle = null
        }
    }

    // ---------------------------------------------------------------------------
    // Private helpers
    // ---------------------------------------------------------------------------

    /** Place the icon at the given position immediately, without any animation. */
    private _snapToPosition(coords: [number, number], heading: number): void {
        this._hasInitialPosition = true
        this._segmentFromCoords = coords
        this._segmentToCoords = coords
        this._segmentFromHeading = heading
        this._segmentToHeading = heading
        this._updateSource(coords, heading)
    }

    /** Begin a new animation segment from `fromCoords` to `toCoords`. */
    private _startAnimationSegment(
        fromCoords: [number, number],
        toCoords: [number, number],
        fromHeading: number,
        toHeading: number
    ): void {
        // Cancel the previous segment before starting a new one.
        this.cancel()

        this._segmentFromCoords = fromCoords
        this._segmentToCoords = toCoords
        this._segmentFromHeading = fromHeading
        this._segmentToHeading = toHeading
        this._segmentStartTime = null  // will be set on the first tick

        const tick = (timestamp: number) => {
            // Record the start time on the very first tick of this segment.
            if (this._segmentStartTime === null) {
                this._segmentStartTime = timestamp
            }

            const progress = Math.min((timestamp - this._segmentStartTime) / this.durationMs, 1)

            const interpolatedLng = this._lerp(this._segmentFromCoords[0], this._segmentToCoords[0], progress)
            const interpolatedLat = this._lerp(this._segmentFromCoords[1], this._segmentToCoords[1], progress)
            const interpolatedHeading = this._lerpAngle(this._segmentFromHeading, this._segmentToHeading, progress)

            this._updateSource([interpolatedLng, interpolatedLat], interpolatedHeading)

            if (progress < 1) {
                // Animation still in progress — schedule the next frame.
                this._rafHandle = requestAnimationFrame(tick)
            } else {
                // Animation complete.
                this._rafHandle = null
            }
        }

        this._rafHandle = requestAnimationFrame(tick)
    }

    /**
     * Returns how far through the current animation segment we are, as a
     * value in [0, 1]. Returns 1 when no animation is running (fully arrived).
     */
    private _currentProgress(): number {
        if (this._segmentStartTime === null) return 1
        return Math.min((performance.now() - this._segmentStartTime) / this.durationMs, 1)
    }

    /** Push the current interpolated position to the Mapbox GeoJSON source. */
    private _updateSource(coords: [number, number], heading: number): void {
        this.source.setData({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: coords },
            properties: { heading }
        } as GeoJSON.Feature<GeoJSON.Geometry>)
    }

    /** Linear interpolation: returns the value `t` fraction of the way from `a` to `b`. */
    private _lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t
    }

    /**
     * Interpolates between two compass headings (in degrees) along the shortest arc.
     * For example, going from 350° to 10° rotates 20° clockwise instead of 340° anti-clockwise.
     */
    private _lerpAngle(fromDeg: number, toDeg: number, t: number): number {
        let delta = toDeg - fromDeg
        // Normalise delta to the range (-180°, +180°] to always take the short arc.
        while (delta > 180) delta -= 360
        while (delta < -180) delta += 360
        return fromDeg + delta * t
    }
}
