"use client"

export default function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 mx-auto hidden w-[90vw] lg:flex">
        <div className="animated-line" style={{ left: "0%" }} />
        {/* <div className="animated-line" style={{ left: "10%" }} /> */}
        <div className="animated-line" style={{ left: "15%" }} />
        {/* <div className="animated-line" style={{ left: "30%" }} />
        <div className="animated-line" style={{ left: "40%" }} />
        <div className="animated-line" style={{ left: "50%" }} />
        <div className="animated-line" style={{ left: "60%" }} />
        <div className="animated-line" style={{ left: "70%" }} /> */}
        <div className="animated-line" style={{ left: "85%" }} />
        {/* <div className="animated-line" style={{ left: "90%" }} /> */}
        <div className="animated-line" style={{ left: "100%" }} />
      </div>

      <style jsx>{`
        .animated-line {
          position: absolute;
          width: 1px;
          height: 100%;
          top: 0;
          background: var(--line-color, rgba(255, 255, 255, 0.06));
          overflow: hidden;
        }

        :global(.dark) .animated-line {
          --line-color: rgba(255, 255, 255, 0.06);
          --drop-color: rgba(255, 255, 255, 0.25);
        }

        :global(:root:not(.dark)) .animated-line {
          --line-color: rgba(0, 0, 0, 0.04);
          --drop-color: rgba(0, 0, 0, 0.12);
        }

        .animated-line::after {
          content: "";
          display: block;
          position: absolute;
          height: 15vh;
          width: 100%;
          top: -50%;
          left: 0;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            var(--drop-color, rgba(255, 255, 255, 0.25)) 75%,
            var(--drop-color, rgba(255, 255, 255, 0.25)) 100%
          );
          animation: drop 7s infinite;
          animation-fill-mode: forwards;
          animation-timing-function: cubic-bezier(0.4, 0.26, 0, 0.97);
        }

        .animated-line:nth-child(1)::after {
          animation-delay: 0s;
        }

        .animated-line:nth-child(2)::after {
          animation-delay: 2s;
        }

        .animated-line:nth-child(3)::after {
          animation-delay: 3.5s;
        }

        .animated-line:nth-child(4)::after {
          animation-delay: 1s;
        }

        .animated-line:nth-child(5)::after {
          animation-delay: 4.5s;
        }

        @keyframes drop {
          0% {
            top: -50%;
          }
          100% {
            top: 110%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animated-line::after {
            animation: none;
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
