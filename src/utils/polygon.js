// 判断点是否在三角形内部
import { tesselate, WINDING_ODD, POLYGONS } from "tess2";
import Vector2D from "./vector2d.js";
import earcut from "earcut";

export function inTriangle(p1, p2, p3, point) {
    const a = p2.copy().minus(p1);
    const b = p3.copy().minus(p2);
    const c = p1.copy().minus(p3);

    const u1 = point.copy().minus(p1);
    const u2 = point.copy().minus(p2);
    const u3 = point.copy().minus(p3);

    const s1 = Math.sign(a.cross(u1));
    let p = a.dot(u1) / a.length ** 2;
    if (s1 === 0 && p >= 0 && p <= 1) return true;
    const s2 = Math.sign(b.cross(u2));
    p = b.dot(u2) / b.length ** 2;
    if (s2 === 0 && p >= 0 && p <= 1) return true;
    const s3 = Math.sign(c.cross(u3));
    p = c.dot(u3) / c.length ** 2;
    if(s3 === 0 && p >= 0 && p <= 1) return true;

    return s1 === s2 && s2 === s3;
}

// 判断点是否在多边形内部
// 将多边形进行三角剖分，然后判断点是否在其中某个三角形内部
export function isPointInPath({vertices, cells}, point) {
    let ret = false;
    for(let i = 0; i < cells.length; i += 3) {
        const p1 = new Vector2D(...vertices[cells[i]]);
        const p2 = new Vector2D(...vertices[cells[i + 1]]);
        const p3 = new Vector2D(...vertices[cells[i + 2]]);
        if (inTriangle(p1, p2, p3, point)) {
            ret = true;
            break;
        }
    }
    return ret;
}

export function earcutTriangulation(points) {
    return earcut(points);
}

// 使用TESS2进行三角剖分
export function tess2Triangulation(points, rule = WINDING_ODD) {
    const res = tesselate({
        contours: [points.flat()],
        windingRule: rule,
        elementType: POLYGONS,
        polySize: 3,
        vertexSize: 2,
        strict: false
    });
    const triangles = [];
    for (let i = 0; i < res.elements.length; i += 3) {
        const a = res.elements[i];
        const b = res.elements[i + 1];
        const c = res.elements[i + 2];
        triangles.push([
            [res.vertices[a * 2], res.vertices[a * 2 + 1]],
            [res.vertices[b * 2], res.vertices[b * 2 + 1]],
            [res.vertices[c * 2], res.vertices[c * 2 + 1]],
        ])
    }
    return triangles;
}
