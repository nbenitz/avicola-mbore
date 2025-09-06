import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import Planner from "../../layout/Planner";

describe("Planner basic", () => {
  it("renders title controls", () => {
    const { container } = render(<Planner />);
    const inputs = container.querySelectorAll("input[type='number']");
    expect(inputs.length).toBeGreaterThan(0);
  });

  it("has access label with newline", () => {
    const { container } = render(<Planner />);
    const svgText = container.querySelector("svg")?.textContent || "";
    expect(svgText).toContain("Acceso / Control sanitario");
  });
});
