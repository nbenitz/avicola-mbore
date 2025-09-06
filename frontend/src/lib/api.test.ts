// src/lib/api.test.ts
import { describe, it, expect } from "vitest";
import { __test__ } from "./api";

describe("api headers", () => {
  it("agrega x-api-key si existe", () => {
    const h = __test__.headers();
    if (__test__.API_KEY) {
      expect(h).toHaveProperty("x-api-key");
    } else {
      expect(h).not.toHaveProperty("x-api-key");
    }
  });
});
