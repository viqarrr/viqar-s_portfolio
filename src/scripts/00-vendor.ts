import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

(window as any).gsap = gsap;
(window as any).ScrollTrigger = ScrollTrigger;
(window as any).Lenis = Lenis;
