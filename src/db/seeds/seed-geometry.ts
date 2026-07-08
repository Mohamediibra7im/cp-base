import { sql } from "drizzle-orm";
import { templates, templateCodes } from "../schema";
import { stripMain, type Db, type CatMap } from "./helpers";

export async function seedGeometry(db: Db, catMap: CatMap) {
  const categoryId = catMap["geometry"];
  if (!categoryId) return;

  // =================== 2D GEOMETRY ===================
  const [geo2d] = await db.insert(templates).values({
    title: "2D Geometry",
    slug: "2d-geometry",
    description: "Complete 2D computational geometry: points, lines, segments, polygons, circles",
    categoryId: categoryId,
    tags: ["geometry", "2d", "computational-geometry", "polygon", "circle"],
    complexity: "O(1) per operation",
    notes: `# 2D Geometry Toolkit

Core 2D geometry primitives — dot product, cross product, orientation test (CCW/CW/collinear), point-in-polygon, line intersection. When to Use: any geometry problem needing basic operations. Complexity: O(1) per operation.

Comprehensive 2D computational geometry using \`complex<ld>\` as the underlying point representation. This provides free arithmetic, which we extend with geometric operations.

## Core Concepts

### The Coordinate System

Every point is represented as a complex number $z = x + yi$. The real part is the $x$-coordinate, the imaginary part is the $y$-coordinate. This gives us vector arithmetic for free: addition, subtraction, and scalar multiplication all work naturally.

### Dot Product

The **dot product** (scalar product) of two vectors $\vec{v}$ and $\vec{w}$ measures how much one projects onto the other:

$$\vec{v} \cdot \vec{w} = v_x w_x + v_y w_y = |\vec{v}||\vec{w}|\cos\theta$$

where $\theta$ is the angle between the vectors.

- $\vec{v} \cdot \vec{w} > 0$: angle is acute (less than $90°$)
- $\vec{v} \cdot \vec{w} = 0$: vectors are perpendicular
- $\vec{v} \cdot \vec{w} < 0$: angle is obtuse (greater than $90°$)

### Cross Product

The **cross product** of two 2D vectors $\vec{v}$ and $\vec{w}$ gives the signed area of the parallelogram they span:

$$\vec{v} \times \vec{w} = v_x w_y - v_y w_x = |\vec{v}||\vec{w}|\sin\theta$$

The sign encodes orientation:
- $\vec{v} \times \vec{w} > 0$: $\vec{w}$ is to the **left** of $\vec{v}$ (counter-clockwise turn)
- $\vec{v} \times \vec{w} = 0$: vectors are **collinear**
- $\vec{v} \times \vec{w} < 0$: $\vec{w}$ is to the **right** of $\vec{v}$ (clockwise turn)

### Orientation Test

Given three points $a, b, c$, compute $\text{orient}(a, b, c) = \text{cross}(b - a,\; c - a)$:

| Result | Meaning | Geometric Interpretation |
|--------|---------|-------------------------|
| $> 0$ | Counter-clockwise | Left turn at $b$ |
| $< 0$ | Clockwise | Right turn at $b$ |
| $= 0$ | Collinear | $a, b, c$ lie on same line |

This is the **most fundamental primitive** in computational geometry. It drives convex hull, line intersection, point-in-polygon, and more.

### Shoelace Formula (Polygon Area)

For a simple polygon with vertices $(x_0, y_0), \ldots, (x_{n-1}, y_{n-1})$ in order:

$$\text{Area} = \frac{1}{2}\left|\sum_{i=0}^{n-1}(x_i y_{i+1} - x_{i+1} y_i)\right|$$

where indices wrap modulo $n$. The signed version (without absolute value) is positive for counter-clockwise winding and negative for clockwise.

### Triangle Area from Cross Product

$$\text{Area}(\triangle ABC) = \frac{1}{2}|\text{cross}(B - A,\; C - A)|$$

## Lines

A line is represented as $\vec{v} \times p = c$ where $\vec{v}$ is the direction and $c$ is derived from a point on the line. The **side** function computes which half-plane a point lies in:

$$\text{side}(p) = \text{cross}(\vec{v}, p) - c$$

### Line-Line Intersection

Given lines $\ell_1: \vec{v_1} \times p = c_1$ and $\ell_2: \vec{v_2} \times p = c_2$, the intersection point is:

$$p = \frac{c_2 \vec{v_1} - c_1 \vec{v_2}}{\text{cross}(\vec{v_1}, \vec{v_2})}$$

If $\text{cross}(\vec{v_1}, \vec{v_2}) = 0$, the lines are parallel.

### Point-Line Distance

$$\text{dist}(p, \ell) = \frac{|\text{side}(p)|}{|\vec{v}|}$$

### Point Projection and Reflection

- **Projection**: $\text{proj}(p) = p - \vec{v}^{\perp} \cdot \text{side}(p) / |\vec{v}|^2$
- **Reflection**: $\text{refl}(p) = p - 2 \cdot \vec{v}^{\perp} \cdot \text{side}(p) / |\vec{v}|^2$

where $\vec{v}^{\perp} = (-v_y, v_x)$ is the perpendicular vector.

## Segments

### Segment-Point Intersection

Point $p$ lies on segment $\overline{AB}$ if:
1. $\text{orient}(A, B, p) = 0$ (collinear), **and**
2. $\text{dot}(A - p, B - p) \leq 0$ ($p$ is between $A$ and $B$)

### Proper Segment-Segment Intersection

Two segments $\overline{AB}$ and $\overline{CD}$ properly intersect (cross, not just touch) iff:
- $a$ and $b$ are on opposite sides of $\overline{CD}$, **and**
- $c$ and $d$ are on opposite sides of $\overline{AB}$

That is, $\text{sgn}(\text{orient}(C,D,A)) \cdot \text{sgn}(\text{orient}(C,D,B)) < 0$ and vice versa.

### Closest Point on Segment

If the projection of $p$ onto the line $\overline{AB}$ falls within the segment, return the projection distance. Otherwise, return $\min(|p - A|, |p - B|)$.

## Polygons

### Convexity Test

A polygon is **convex** if all consecutive triples have the same orientation. Check if $\text{orient}(p_i, p_{i+1}, p_{i+2})$ is non-negative for all $i$ (or non-positive, depending on winding).

### Point-in-Polygon (Ray Casting)

Count the number of upward crossings of a horizontal ray from $a$ to $+\infty$ with the polygon edges. If odd, the point is inside. Handle edge cases carefully:
- Points exactly on an edge: depends on whether you want boundary inclusion
- Points on vertices: special-case check

## When to Use This Template

| Problem Pattern | Functions Used |
|----------------|---------------|
| Check if 3 points are collinear | \`orient()\` |
| Find orientation of a turn | \`orient()\` |
| Compute polygon area | \`areaPolygon()\` |
| Check if polygon is convex | \`isConvex()\` |
| Point inside polygon test | \`inPolygon()\` |
| Line intersection | \`lineIntersect()\` |
| Segment intersection | \`properInter()\` |
| Closest point on segment | \`segPoint()\` |

## Edge Cases

1. **Degenerate triangles**: When $a, b, c$ are collinear, $\text{orient} = 0$ and area is 0.
2. **Parallel lines**: $\text{cross}(l_1.v, l_2.v) = 0$; intersection does not exist.
3. **Overlapping segments**: \`properInter\` only detects proper (crossing) intersections, not overlapping collinear segments.
4. **Floating-point precision**: Use $\text{EPS} = 10^{-9}$ for comparisons. For integer coordinates, prefer exact integer arithmetic.
5. **Vertical lines**: The line representation $\vec{v} \times p = c$ handles vertical lines naturally (no slope representation).
6. **Point equality**: Always compare with $\text{EPS}$ tolerance, never exact equality.

## Complexity

| Operation | Time |
|-----------|------|
| All primitives | $O(1)$ |
| Polygon area / convexity / point-in-polygon | $O(n)$ |
| Line intersection | $O(1)$ |
| Segment intersection | $O(1)$ |`,
  }).returning();
  if (geo2d) {
    await db.insert(templateCodes).values([{
      templateId: geo2d.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

using ll = long long;
using ld = long double;
const ld EPS = 1e-9L;

using T = ld;
using pt = complex<T>;
#define x real()
#define y imag()

/** @brief Sign function: returns -1, 0, or +1 */
int sgn(T val) {
    return (T(0) < val) - (val < T(0));
}

/** @brief Squared magnitude of a point |p|^2 */
T sq(pt p) {
    return p.x * p.x + p.y * p.y;
}

/** @brief Perpendicular vector (-y, x) -- rotates 90 degrees CCW */
pt perp(pt p) {
    return {-p.y, p.x};
}

/** @brief Dot product of vectors v and w */
T dot(pt v, pt w) {
    return v.x * w.x + v.y * w.y;
}

/** @brief 2D cross product (z-component) of vectors v and w */
T cross(pt v, pt w) {
    return v.x * w.y - v.y * w.x;
}

/** @brief Signed area of parallelogram spanned by (b-a) and (c-a). Positive = CCW */
T orient(pt a, pt b, pt c) {
    return cross(b - a, c - a);
}

// =================== LINES ===================

struct line {
    pt v;  ///< direction vector
    T c;   ///< cross(v, any_point_on_line)

    /** @brief Construct line from direction vector and constant */
    line(pt v, T c) : v(v), c(c) {}

    /** @brief Construct line from equation ax + by = c */
    line(T a, T b, T _c) { v = {b, -a}; c = _c; }

    /** @brief Construct line through points p and q */
    line(pt p, pt q) { v = q - p; c = cross(v, p); }

    /** @brief Signed side test: > 0 left, < 0 right, = 0 on line */
    T side(pt p) { return cross(v, p) - c; }

    /** @brief Perpendicular distance from point p to line */
    ld dist(pt p) { return fabsl(side(p)) / abs(v); }

    /** @brief Orthogonal projection of point p onto line */
    pt proj(pt p) { return p - perp(v) * side(p) / sq(v); }

    /** @brief Reflection of point p across line */
    pt refl(pt p) { return p - perp(v) * (T)2.0L * side(p) / sq(v); }
};

/** @brief Intersect two lines. Returns false if parallel */
bool lineIntersect(line l1, line l2, pt &out) {
    T d = cross(l1.v, l2.v);
    if (fabsl(d) <= EPS) return false;
    out = (l2.v * l1.c - l1.v * l2.c) / d;
    return true;
}

// =================== SEGMENTS ===================

/** @brief Check if point p lies on segment ab (inclusive) */
bool onSegment(pt a, pt b, pt p) {
    return fabsl(orient(a, b, p)) <= EPS && dot(a - p, b - p) <= EPS;
}

/** @brief Proper intersection of segments ab and cd (they cross, not just touch) */
bool properInter(pt a, pt b, pt c, pt d, pt &out) {
    T oa = orient(c, d, a), ob = orient(c, d, b);
    T oc = orient(a, b, c), od = orient(a, b, d);
    if (sgn(oa) * sgn(ob) < 0 && sgn(oc) * sgn(od) < 0) {
        out = (a * ob - b * oa) / (ob - oa);
        return true;
    }
    return false;
}

/** @brief Minimum distance from point p to segment ab */
ld segPoint(pt a, pt b, pt p) {
    if (a != b) {
        if (dot(p - a, b - a) >= 0 && dot(p - b, a - b) >= 0) {
            line l(a, b);
            return l.dist(p);
        }
    }
    return min(abs(p - a), abs(p - b));
}

// =================== POLYGONS ===================

/** @brief Check if polygon is convex (all turns same orientation) */
bool isConvex(vector<pt> p) {
    bool hasPos = false, hasNeg = false;
    int n = (int)p.size();
    for (int i = 0; i < n; i++) {
        int o = sgn(orient(p[i], p[(i + 1) % n], p[(i + 2) % n]));
        if (o > 0) hasPos = true;
        if (o < 0) hasNeg = true;
    }
    return !(hasPos && hasNeg);
}

/** @brief Area of triangle with vertices a, b, c */
ld areaTriangle(pt a, pt b, pt c) {
    return fabsl(cross(b - a, c - a)) / 2.0L;
}

/** @brief Signed area of simple polygon via shoelace formula */
ld areaPolygon(vector<pt> p) {
    ld area = 0.0L;
    int n = (int)p.size();
    for (int i = 0; i < n; i++)
        area += cross(p[i], p[(i + 1) % n]);
    return fabsl(area) / 2.0L;
}

/** @brief Point-in-polygon test via ray casting. strict=true excludes boundary */
bool inPolygon(vector<pt> p, pt a, bool strict = true) {
    int numCrossings = 0;
    int n = (int)p.size();
    for (int i = 0; i < n; i++) {
        if (onSegment(p[i], p[(i + 1) % n], a))
            return !strict;
        bool aboveA = (p[(i + 1) % n].y >= a.y) - (p[i].y >= a.y);
        numCrossings += aboveA * orient(a, p[i], p[(i + 1) % n]) > 0;
    }
    return numCrossings & 1;
}`),
    }]);
  }

  // =================== GEOMETRY POINTS ===================
  const [geomPts] = await db.insert(templates).values({
    title: "Geometry Points",
    slug: "geometry-points",
    description: "Generic 2D point with full operator support: dot, cross, distance, rotation, unit, normal",
    categoryId: categoryId,
    tags: ["geometry", "point", "2d", "vector"],
    complexity: "O(1) per operation",
    notes: `# Geometry Points

Point struct with operator overloads for vector arithmetic (add, subtract, scale), cross/dot product methods, rotation, polar angle. When to Use: when you need a reusable Point class for geometry problems.

A fully-featured 2D point template with arithmetic operators and geometric operations. Parameterized by coordinate type -- use \`int\` or \`ll\` for exact integer arithmetic, \`long double\` for floating-point geometry.

## Mathematical Foundation

### Vectors as Points

In 2D computational geometry, a point $P = (x, y)$ is treated as a position vector from the origin. Operations on points are vector operations:

- **Addition**: $P + Q = (P_x + Q_x,\; P_y + Q_y)$ -- translation
- **Subtraction**: $P - Q = (P_x - Q_x,\; P_y - Q_y)$ -- displacement vector
- **Scalar multiply**: $P \cdot c = (P_x \cdot c,\; P_y \cdot c)$ -- scaling

### Dot Product

$$\text{dot}(P, Q) = P_x Q_x + P_y Q_y = |P||Q|\cos\theta$$

Measures projection length. Zero when perpendicular.

### Cross Product

$$\text{cross}(P, Q) = P_x Q_y - P_y Q_x = |P||Q|\sin\theta$$

Signed area of the parallelogram. Sign determines CCW vs CW orientation.

### Angle Between Vectors

The angle from $P$ to $Q$ (signed, in radians) is:

$$\theta = \text{atan2}(\text{cross}(P, Q),\; \text{dot}(P, Q))$$

This correctly handles all quadrants and gives $\theta \in (-\pi, \pi]$.

### Rotation

Rotation of point $P$ by angle $\theta$ around the origin:

$$P' = \begin{pmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{pmatrix} \begin{pmatrix} P_x \\ P_y \end{pmatrix}$$

To rotate around an arbitrary center $C$: translate so $C$ is at origin, rotate, translate back.

## Methods Reference

| Method | Description | Formula |
|--------|-------------|---------|
| \`dot(Q)\` | Dot product | $P_x Q_x + P_y Q_y$ |
| \`cross(Q)\` | Cross product | $P_x Q_y - P_y Q_x$ |
| \`cross(A, B)\` | Cross of vectors $(A-P) \times (B-P)$ | $(A-P) \times (B-P)$ |
| \`dist()\` / \`dist(Q)\` | Squared distance | $P_x^2 + P_y^2$ or $|P-Q|^2$ |
| \`distance()\` / \`distance(Q)\` | Euclidean distance | $\sqrt{\text{dist}()}$ |
| \`angle()\` / \`angle(Q)\` | Polar angle / signed angle | $\text{atan2}(y, x)$ |
| \`unit()\` | Unit vector | $P / |P|$ |
| \`perp()\` | Perpendicular $(-y, x)$ | Rotate $90°$ CCW |
| \`rotate(\theta)\` | Rotate by $\theta$ radians | Rotation matrix |
| \`rotate(C, \theta)\` | Rotate around $C$ | Translate, rotate, translate back |
| \`normal()\` | Unit normal vector | $\text{perp}().\text{unit}()$ |

## When to Use This Template

| Problem Pattern | Key Methods |
|----------------|-------------|
| Distance between points | \`distance(Q)\` |
| Angle between vectors | \`angle(Q)\` |
| Rotate a point | \`rotate(\theta)\` |
| Check perpendicularity | \`dot(Q) == 0\` |
| Check collinearity | \`cross(Q) == 0\` |
| Find unit vector | \`unit()\` |
| Rotate 90 degrees | \`perp()\` |

## Edge Cases

1. **Zero vector**: \`unit()\` returns $(0, 0)$ -- handle division-by-zero gracefully.
2. **Integer overflow**: When using \`int\` or \`ll\`, the cross product $P_x Q_y - P_y Q_x$ can overflow if coordinates are near $10^9$. Use \`__int128\` or double-check constraints.
3. **Floating-point precision**: For \`double\`, EPS $= 10^{-9}$. For \`long double\`, EPS $= 10^{-12}$. Never use exact equality for floating-point comparisons.
4. **Angle precision**: \`atan2\` can return $\pm\pi$ for the same direction -- normalize angles to $(-\pi, \pi]$ or $[0, 2\pi)$ as needed.

## Complexity

Every operation is $O(1)$.

## Example

\`\`\`cpp
Point<ll> a(3, 4), b(1, 2);
cout << a.distance(b);        // 2.82843
cout << a.cross(b);           // -2  (3*2 - 4*1)
cout << a.dot(b);             // 11  (3*1 + 4*2)
cout << a.perp();             // (-4, 3)
cout << a.unit();             // (0.6, 0.8)
\`\`\``,
  }).returning();
  if (geomPts) {
    await db.insert(templateCodes).values([{
      templateId: geomPts.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

using ll = long long;
using ld = long double;

/**
 * @brief Generic 2D point with full arithmetic and geometric operations.
 * @tparam T Coordinate type (int, ll, double, long double)
 *
 * Supports: +, -, *, /, ==, !=, <, >>, <<
 * Geometry: dot, cross, distance, angle, unit, perp, rotate, normal
 */
template <typename T = int>
struct Point {
    T x, y;

    Point(T _x = 0, T _y = 0) : x(_x), y(_y) {}
    Point(const Point &p) : x(p.x), y(p.y) {}

    Point operator+(const Point &p) const { return Point(x + p.x, y + p.y); }
    Point operator-(const Point &p) const { return Point(x - p.x, y - p.y); }
    Point operator*(T c) const { return Point(x * c, y * c); }
    Point operator/(T c) const { return Point(x / c, y / c); }
    bool operator==(const Point &p) const { return x == p.x && y == p.y; }
    bool operator!=(const Point &p) const { return x != p.x || y != p.y; }
    bool operator<(const Point &p) const { return make_pair(y, x) < make_pair(p.y, p.x); }
    bool operator>(const Point &p) const { return make_pair(y, x) > make_pair(p.y, p.x); }
    bool operator<=(const Point &p) const { return make_pair(y, x) <= make_pair(p.y, p.x); }
    bool operator>=(const Point &p) const { return make_pair(y, x) >= make_pair(p.y, p.x); }

    friend istream& operator>>(istream &in, Point &p) { return in >> p.x >> p.y; }
    friend ostream& operator<<(ostream &out, const Point &p) { return out << p.x << ' ' << p.y; }

    /** @brief Dot product with point p */
    T dot(const Point &p) const { return x * p.x + y * p.y; }

    /** @brief 2D cross product (z-component) with point p */
    T cross(const Point &p) const { return x * p.y - y * p.x; }

    /** @brief Cross product of vectors (a-this) and (b-this) */
    T cross(const Point &a, const Point &b) const { return (a - *this).cross(b - *this); }

    /** @brief Squared distance from origin */
    T dist() const { return x * x + y * y; }

    /** @brief Squared distance to point p */
    T dist(const Point &p) const { return (*this - p).dist(); }

    /** @brief Euclidean distance from origin */
    ld distance() const { return sqrtl((ld)dist()); }

    /** @brief Euclidean distance to point p */
    ld distance(const Point &p) const { return sqrtl((ld)dist(p)); }

    /** @brief Polar angle in radians (-pi, pi] */
    ld angle() const { return atan2l((ld)y, (ld)x); }

    /** @brief Signed angle from this vector to p in radians */
    ld angle(const Point &p) const { return atan2l((ld)cross(p), (ld)dot(p)); }

    /** @brief Unit vector (returns zero vector if magnitude is zero) */
    Point unit() const {
        T d = dist();
        return d ? *this / d : Point();
    }

    /** @brief Perpendicular vector (-y, x) -- 90 degree CCW rotation */
    Point perp() const { return Point(-y, x); }

    /** @brief Rotate by angle a (radians) around origin */
    Point rotate(ld a) const {
        return Point(x * cosl(a) - y * sinl(a),
                     x * sinl(a) + y * cosl(a));
    }

    /** @brief Rotate by angle a (radians) around point p */
    Point rotate(const Point &p, ld a) const { return (*this - p).rotate(a) + p; }

    /** @brief Unit normal vector (perp().unit()) */
    Point normal() const { return perp().unit(); }
};`),
    }]);
  }

  // =================== CONVEX HULL (ANDREW'S) ===================
  const [convHull] = await db.insert(templates).values({
    title: "Convex Hull (Andrew's)",
    slug: "convex-hull-andrew",
    description: "Andrew's monotone chain algorithm for convex hull in O(n log n)",
    categoryId: categoryId,
    tags: ["geometry", "convex-hull", "andrew", "graham-scan"],
    complexity: "O(n log n)",
    notes: `# Convex Hull -- Andrew's Monotone Chain

Andrew's monotone chain computes the **convex hull** of 2D points in $O(n \log n)$.

## Algorithm

Sort points lexicographically by $(x, y)$. Build the **lower hull** left-to-right: for each point, pop while the last two points and the new point form a non-left turn. Build the **upper hull** right-to-left the same way. Concatenate both halves (removing duplicate endpoints).

Core orientation test:

$$\text{orient}(a, b, c) = \text{cross}(b - a,\; c - a)$$

| Return | Meaning |
|--------|---------|
| $> 0$ | Counter-clockwise (left turn) |
| $= 0$ | Collinear |
| $< 0$ | Clockwise (right turn) |

The \`include_collinear\` flag keeps points on hull edges (reverses collinear at the end for correct order).

## When to Use

| Problem | Description |
|---------|-------------|
| Smallest enclosing polygon | Hull vertices |
| Diameter of point set | Hull + rotating calipers |
| Point containment | Build hull, test query inside |
| Perimeter / area | Iterate hull vertices |

## Complexity

- **Time**: $O(n \log n)$ (sort dominates)
- **Space**: $O(n)$`,
  }).returning();
  if (convHull) {
    await db.insert(templateCodes).values([{
      templateId: convHull.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

using ll = long long;
using ld = long double;

/**
 * @brief Generic 2D point with full arithmetic and geometric operations.
 * @tparam T Coordinate type (int, ll, double, long double)
 */
template <typename T = int>
struct Point {
    T x, y;

    Point(T _x = 0, T _y = 0) : x(_x), y(_y) {}
    Point(const Point &p) : x(p.x), y(p.y) {}

    Point operator+(const Point &p) const { return Point(x + p.x, y + p.y); }
    Point operator-(const Point &p) const { return Point(x - p.x, y - p.y); }
    Point operator*(T c) const { return Point(x * c, y * c); }
    Point operator/(T c) const { return Point(x / c, y / c); }
    bool operator==(const Point &p) const { return x == p.x && y == p.y; }
    bool operator!=(const Point &p) const { return x != p.x || y != p.y; }
    bool operator<(const Point &p) const { return make_pair(y, x) < make_pair(p.y, p.x); }

    friend istream& operator>>(istream &in, Point &p) { return in >> p.x >> p.y; }
    friend ostream& operator<<(ostream &out, const Point &p) { return out << p.x << ' ' << p.y; }

    /** @brief Dot product with point p */
    T dot(const Point &p) const { return x * p.x + y * p.y; }

    /** @brief 2D cross product (z-component) with point p */
    T cross(const Point &p) const { return x * p.y - y * p.x; }

    /** @brief Squared distance from origin */
    T dist() const { return x * x + y * y; }

    /** @brief Squared distance to point p */
    T dist(const Point &p) const { return (*this - p).dist(); }

    /** @brief Euclidean distance from origin */
    ld distance() const { return sqrtl((ld)dist()); }

    /** @brief Perpendicular vector (-y, x) -- 90 degree CCW rotation */
    Point perp() const { return Point(-y, x); }
};

/**
 * @brief Convex hull using Andrew's monotone chain algorithm.
 * @tparam T Coordinate type (int, ll, double, long double)
 *
 * Computes the convex hull of a set of 2D points in O(n log n).
 * Hull vertices are stored in counter-clockwise order.
 */
template <typename T = int>
struct ConvexHull {
    using point = Point<T>;

    vector<point> hull;  ///< Convex hull vertices in CCW order

    /**
     * @brief Compute orientation of ordered triple (a, b, c)
     * @return -1 (CW), 0 (collinear), 1 (CCW)
     */
    int orientation(const point &a, const point &b, const point &c) {
        T val = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
        if (val < 0) return -1;
        if (val > 0) return 1;
        return 0;
    }

    /**
     * @brief Check if turn a->b->c is clockwise (or collinear when allowed)
     * @param include_collinear If true, collinear points are kept on hull
     */
    bool isCw(const point &a, const point &b, const point &c, bool include_collinear) {
        int o = orientation(a, b, c);
        return o < 0 || (include_collinear && o == 0);
    }

    /**
     * @brief Check if three points are collinear
     */
    bool isCollinear(const point &a, const point &b, const point &c) {
        return orientation(a, b, c) == 0;
    }

    /**
     * @brief Compute convex hull of given points
     * @param points Input points (will be sorted in-place)
     * @param include_collinear Include points on hull edges
     *
     * Handles degenerate cases:
     * - 0 points: empty hull
     * - 1 point: single vertex
     * - 2 points: line segment
     * - All collinear: depends on include_collinear flag
     */
    ConvexHull(vector<point> &points, bool include_collinear = false) {
        int n = (int)points.size();
        if (n <= 2) {
            hull = points;
            return;
        }

        // Sort by (x, y) lexicographically
        point p0 = *min_element(points.begin(), points.end());
        sort(points.begin(), points.end(), [&](const point &a, const point &b) {
            int o = orientation(p0, a, b);
            if (o == 0) return p0.dist(a) < p0.dist(b);
            return o < 0;
        });

        // Remove duplicates
        points.erase(unique(points.begin(), points.end()), points.end());
        n = (int)points.size();

        // Handle collinear case
        if (include_collinear) {
            int idx = n - 1;
            while (idx > 0 && isCollinear(p0, points[idx], points.back()))
                idx--;
            reverse(points.begin() + idx + 1, points.end());
        }

        // Build hull
        for (const point &p : points) {
            while ((int)hull.size() > 1 &&
                   !isCw(hull[(int)hull.size() - 2], hull.back(), p, include_collinear))
                hull.pop_back();
            hull.push_back(p);
        }
    }
};`),
    }]);
  }
}
