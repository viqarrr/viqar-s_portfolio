/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare var gsap: any;
declare var ScrollTrigger: any;
declare var Lenis: any;
declare var lenis: any;
declare var queueMotion: (setup: () => void | (() => void), options?: { first?: boolean; near?: Element; id?: string }) => void;
declare var adjacent: (a: string, b: string) => boolean;
declare var refreshScroll: () => void;
declare var motionReady: Promise<any>;

interface Window {
  gsap: any;
  ScrollTrigger: any;
  Lenis: any;
  lenis: any;
  queueMotion: (setup: () => void | (() => void), options?: { first?: boolean; near?: Element; id?: string }) => void;
  adjacent: (a: string, b: string) => boolean;
  refreshScroll: () => void;
  motionReady: Promise<any>;
}
