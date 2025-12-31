declare module 'canvas-confetti' {
    interface Options {
        particleCount?: number;
        angle?: number;
        spread?: number;
        startVelocity?: number;
        decay?: number;
        gravity?: number;
        drift?: number;
        ticks?: number;
        origin?: {
            x?: number;
            y?: number;
        };
        colors?: string[];
        shapes?: ('circle' | 'square')[];
        scalar?: number;
        zIndex?: number;
        disableForReducedMotion?: boolean;
        useWorker?: boolean;
        resize?: boolean;
        canvas?: HTMLCanvasElement;
    }

    function confetti(options?: Options): void | Promise<void>;

    export default confetti;
}
