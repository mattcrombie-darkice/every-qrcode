import { EveryQRCode, type EveryQRCodeView } from "@every-qrcode/react";
import { createElement, useEffect, useRef, useState } from "react";

const PROFILE_URL = "https://crew.darkice.au/matt-crombie";

type Face = {
  readonly eyebrow: string;
  readonly id: string;
  readonly label: string;
  readonly proof: string;
  readonly statement: string;
};

const FACES: readonly Face[] = [
  {
    eyebrow: "01 / APPLIED AI",
    id: "ai",
    label: "Applied AI",
    proof: "LLM workflows, evaluation, human escalation and governed delivery.",
    statement: "AI that earns a place inside real operations.",
  },
  {
    eyebrow: "02 / ARCHITECTURE",
    id: "architecture",
    label: "Architecture",
    proof: "Connected mobile, web, cloud and enterprise systems designed end to end.",
    statement: "The whole system, not just the impressive fragment.",
  },
  {
    eyebrow: "03 / AUTOMATION",
    id: "automation",
    label: "Automation",
    proof: "Operational workflows spanning government, finance, mining and manufacturing.",
    statement: "Find the friction. Build the capability. Prove the outcome.",
  },
  {
    eyebrow: "04 / DELIVERY",
    id: "delivery",
    label: "Delivery",
    proof: "20+ years shipping software and 15+ years of founder-level ownership.",
    statement: "Senior enough to frame it. Hands-on enough to ship it.",
  },
  {
    eyebrow: "05 / SELECTED WORK",
    id: "work",
    label: "Selected work",
    proof:
      "ATO, Telstra Health, V/Line, TechnologyOne, McMillan Shakespeare and industrial field systems.",
    statement: "Complex environments. Practical systems. Real adoption.",
  },
  {
    eyebrow: "06 / CONNECT",
    id: "connect",
    label: "Connect",
    proof: "Brisbane based. Available for architecture, AI automation and delivery leadership.",
    statement: "Bring me the problem that crosses the org chart.",
  },
];

const DEFAULT_FACE = FACES[0]!;

const AR_MODEL_PROPS: Record<string, string> = {
  alt: "Dark Ice Systems Cube with cyan, lime and ice faces surrounded by a live signal orbit",
  ar: "",
  "ar-modes": "webxr scene-viewer quick-look",
  "auto-rotate": "",
  "camera-controls": "",
  "camera-orbit": "35deg 66deg 6.2m",
  "ios-src": "/systems-cube/models/dark-ice-systems-cube.usdz",
  "shadow-intensity": "1.2",
  src: "/systems-cube/models/dark-ice-systems-cube.glb",
};

function SystemsCubeAR(): React.JSX.Element {
  const shellRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "unavailable">("idle");

  useEffect(() => {
    let active = true;
    let started = false;
    const loadViewer = (): void => {
      if (started) return;
      started = true;
      setState("loading");
      void import("@google/model-viewer")
        .then(() => active && setState("ready"))
        .catch(() => active && setState("unavailable"));
    };
    const element = shellRef.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      loadViewer();
      return () => {
        active = false;
      };
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadViewer();
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(element);
    return () => {
      active = false;
      observer.disconnect();
    };
  }, []);

  return (
    <div className="ar-viewer-shell" ref={shellRef}>
      <div className="stage-chrome">
        <span>AR ASSET 01</span>
        <span>{state === "ready" ? "GLB · USDZ · READY" : "GLB · USDZ"}</span>
      </div>
      {createElement(
        "model-viewer",
        AR_MODEL_PROPS,
        <button className="ar-button" slot="ar-button" type="button">
          Place Systems Cube
        </button>,
      )}
      {state === "unavailable" ? (
        <p className="ar-caption">
          Interactive viewer unavailable. <a href={AR_MODEL_PROPS["src"]}>Download the GLB</a>.
        </p>
      ) : (
        <p className="ar-caption">
          A separate platform handoff for WebXR, Scene Viewer and Apple Quick Look.
        </p>
      )}
    </div>
  );
}

export function App(): React.JSX.Element {
  const [activeFace, setActiveFace] = useState(DEFAULT_FACE);
  const [view, setView] = useState<EveryQRCodeView>("model");
  const [rendererState, setRendererState] = useState("Signal field live");

  return (
    <main className="experience-shell">
      <div className="signal-grid" aria-hidden="true" />
      <header className="site-header">
        <a className="wordmark" href="https://darkice.au" aria-label="Dark Ice home">
          <span className="wordmark-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>
            dark<strong>ice</strong>
          </span>
        </a>
        <div className="header-status">
          <span className="pulse" aria-hidden="true" />
          Brisbane · available
        </div>
      </header>

      <section className="hero" aria-labelledby="experience-title">
        <div className="hero-copy">
          <p className="kicker">MATT CROMBIE / SYSTEMS CUBE 01</p>
          <h1 id="experience-title">
            AI systems.
            <br />
            <span>Architecture.</span>
            <br />
            Delivery that ships.
          </h1>
          <p className="hero-intro">
            I work where strategy, software and real operations meet, turning ambiguous problems
            into governed systems people can actually use.
          </p>
          <div className="hero-actions">
            <a
              className="button button-primary"
              href="mailto:matt@darkice.au?subject=Systems%20conversation"
            >
              Start a conversation
            </a>
            <a className="button button-ghost" href="/Matt-Crombie.vcf" download>
              Save contact
            </a>
          </div>
          <div className="proof-strip" aria-label="Experience summary">
            <span>
              <strong>20+</strong> years shipping
            </span>
            <span>
              <strong>15+</strong> years founder-led
            </span>
            <span>
              <strong>10</strong> sectors
            </span>
          </div>
        </div>

        <div className="cube-stage" data-view={view}>
          <div className="stage-chrome">
            <span>{view === "model" ? "LIVE SYSTEM" : "SCAN SIGNAL"}</span>
            <span>{rendererState}</span>
          </div>
          <div className="cube-frame">
            <EveryQRCode
              className="systems-cube"
              identityScope="url"
              initialZoom={0.9}
              model="systems-cube"
              onError={() => {
                setView("qr");
                setRendererState("Canonical QR fallback");
              }}
              onViewChange={(nextView) => {
                setView(nextView);
                setRendererState(
                  nextView === "qr" ? "Resolving canonical signal" : "Signal field live",
                );
              }}
              url={PROFILE_URL}
            />
            <span className="corner corner-tl" aria-hidden="true" />
            <span className="corner corner-tr" aria-hidden="true" />
            <span className="corner corner-bl" aria-hidden="true" />
            <span className="corner corner-br" aria-hidden="true" />
          </div>
          <p className="stage-instruction">
            {view === "model"
              ? "Tap the signal field to resolve the scannable contact code. Use + / − to inspect."
              : "Point a camera at the code, or tap again to rebuild the Systems Cube."}
          </p>
        </div>
      </section>

      <section className="capability-console" aria-labelledby="console-title">
        <div className="console-heading">
          <p className="kicker">AN INTERACTIVE PROFESSIONAL SIGNAL</p>
          <h2 id="console-title">One system. Six faces.</h2>
          <p>The visual changes with the URL, while the professional signal stays precise.</p>
        </div>
        <div className="face-tabs" role="tablist" aria-label="Systems Cube faces">
          {FACES.map((face) => (
            <button
              aria-controls="face-panel"
              aria-selected={activeFace.id === face.id}
              className="face-tab"
              id={`tab-${face.id}`}
              key={face.id}
              onClick={() => setActiveFace(face)}
              role="tab"
              type="button"
            >
              <span>{face.eyebrow.slice(0, 2)}</span>
              {face.label}
            </button>
          ))}
        </div>
        <article
          aria-labelledby={`tab-${activeFace.id}`}
          className="face-panel"
          id="face-panel"
          role="tabpanel"
        >
          <p className="face-eyebrow">{activeFace.eyebrow}</p>
          <h3>{activeFace.statement}</h3>
          <p>{activeFace.proof}</p>
          {activeFace.id === "connect" ? (
            <div className="connect-links">
              <a href="tel:+61419500715">+61 419 500 715</a>
              <a href="mailto:matt@darkice.au">matt@darkice.au</a>
              <a href="https://www.linkedin.com/in/matt-crombie/">LinkedIn</a>
            </div>
          ) : null}
        </article>
      </section>

      <section className="handoff" id="ar-handoff" aria-labelledby="handoff-title">
        <div className="handoff-copy">
          <p className="kicker">PHYSICAL → DIGITAL</p>
          <h2 id="handoff-title">The QR is the doorway, not the destination.</h2>
          <p>
            On paper it remains a conventional, high-reliability code. On screen it becomes a
            deterministic 3D signature, then resolves back to the exact code when someone is ready
            to connect.
          </p>
          <small>
            Use touch to inspect. Compatible iPhone and Android devices can place it in AR.
          </small>
        </div>
        <SystemsCubeAR />
      </section>

      <footer>
        <span>Matt Crombie · Founder &amp; Principal Consultant</span>
        <span>Built as an AI-assisted systems demonstration</span>
        <a href={PROFILE_URL}>crew.darkice.au/matt-crombie</a>
      </footer>
    </main>
  );
}
