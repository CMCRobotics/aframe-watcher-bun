import { expect, test, describe } from "bun:test";
import { updateFile } from "./watcher";

describe("watcher", () => {
  test("updates single attribute", () => {
    const html = '<a-entity id="box" position="0 0 0"></a-entity>';
    const changes = {
      box: {
        position: "1 2 3"
      }
    };
    const updated = updateFile("test.html", html, changes);
    expect(updated).toContain('position="1 2 3"');
  });

  test("adds new attribute", () => {
    const html = '<a-entity id="box"></a-entity>';
    const changes = {
      box: {
        rotation: "0 90 0"
      }
    };
    const updated = updateFile("test.html", html, changes);
    expect(updated).toContain('rotation="0 90 0"');
  });

  test("updates multi-property attribute", () => {
    const html = '<a-entity id="box" material="color: red; metalness: 0"></a-entity>';
    const changes = {
      box: {
        material: {
          color: "blue",
          metalness: "0.5"
        }
      }
    };
    const updated = updateFile("test.html", html, changes);
    expect(updated).toContain('color: blue');
    expect(updated).toContain('metalness: 0.5');
  });

  test("adds property to multi-property attribute", () => {
    const html = '<a-entity id="box" material="color: red"></a-entity>';
    const changes = {
      box: {
        material: {
          roughness: "1"
        }
      }
    };
    const updated = updateFile("test.html", html, changes);
    expect(updated).toContain('color: red');
    expect(updated).toContain('roughness: 1');
  });
});
