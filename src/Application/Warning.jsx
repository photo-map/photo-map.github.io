import React from "react";

export default function Warning() {
  return (
    <div className="website-warning">
      <p>Google API not loaded!</p>
      <p>Maybe you need to turn off the Adblock Plus for this website.</p>
      <p>
        If you still have problem, please{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/photo-map/photo-map.github.io/issues"
        >
          raise an issue
        </a>{" "}
        in the GitHub project.
      </p>
    </div>
  );
}
