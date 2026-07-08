import { sql } from "drizzle-orm";
import { templates, templateCodes } from "../schema";
import { stripMain, type Db, type CatMap } from "./helpers";

export async function seedGeometry(db: Db, catMap: CatMap) {
  const categoryId = catMap["geometry"];
  if (!categoryId) return;

  const [geo2d] = await db.insert(templates).values({
    title: "2D Geometry",
    slug: "2d-geometry",
    description: "Complete 2D computational geometry: points, lines, segments, polygons, circles",
    categoryId: categoryId,
    tags: ["geometry", "2d", "computational-geometry", "polygon", "circle"],
    complexity: "O(1) per operation",
    notes: `# Basic Geometry

## Linear Operations

Points in 2D maintain linear space: sum and scalar multiplication are defined. Using \`complex<T>\` from STL is convenient.

## Key Concepts

**Dot product**: $v \\cdot w = v_x w_x + v_y w_y$ — measures projection.
**Cross product**: $v \\times w = v_x w_y - v_y w_x$ — measures signed area.

## Orientation

orient(a, b, c) = cross(b - a, c - a):
- > 0: counter-clockwise (left turn)
- < 0: clockwise (right turn)
- = 0: collinear

## Polygon Area

Shoelace formula: $\\text{area} = \\frac{1}{2}\\left|\\sum_{i=0}^{n-1} (x_i y_{i+1} - x_{i+1} y_i)\\right|$`,
  }).returning();
  if (geo2d) {
    await db.insert(templateCodes).values([{
      templateId: geo2d.id, language: "cpp", code: stripMain(`#include<bits/stdc++.h>
using namespace std;
typedef double ld;
typedef long long ll;
const ld EPS = 1e-9;

typedef ld T;
typedef complex<T> pt;
#define x real()
#define y imag()

// --- Basics ---
bool operator==(pt a, pt b) { return fabs(a.x - b.x) < EPS && fabs(a.y - b.y) < EPS; }
int sgn(T val) { return (T(0) < val) - (val < T(0)); }
T sq(pt p) { return p.x * p.x + p.y * p.y; }
ld abs(pt p) { return sqrt(sq(p)); }
pt perp(pt p) { return {-p.y, p.x}; }
T dot(pt v, pt w) { return v.x * w.x + v.y * w.y; }
T cross(pt v, pt w) { return v.x * w.y - v.y * w.x; }

// --- Orientation ---
T orient(pt a, pt b, pt c) { return cross(b - a, c - a); }

// --- Lines ---
struct line {
    pt v; T c;
    line(pt v, T c) : v(v), c(c) {}
    line(T a, T b, T _c) { v = {b, -a}; c = _c; }
    line(pt p, pt q) { v = q - p; c = cross(v, p); }
    T side(pt p) { return cross(v, p) - c; }
    double dist(pt p) { return abs(side(p)) / abs(v); }
    pt proj(pt p) { return p - perp(v) * side(p) / sq(v); }
    pt refl(pt p) { return p - perp(v) * (T)2.0 * side(p) / sq(v); }
};

bool inter(line l1, line l2, pt &out) {
    T d = cross(l1.v, l2.v);
    if (fabs(d) <= EPS) return false;
    out = (l2.v * l1.c - l1.v * l2.c) / d;
    return true;
}

// --- Segments ---
bool onSegment(pt a, pt b, pt p) {
    return fabsl(orient(a, b, p)) <= EPS && dot(a - p, b - p) <= EPS;
}

bool properInter(pt a, pt b, pt c, pt d, pt &out) {
    T oa = orient(c, d, a), ob = orient(c, d, b);
    T oc = orient(a, b, c), od = orient(a, b, d);
    if (sgn(oa) * sgn(ob) < 0 && sgn(oc) * sgn(od) < 0) {
        out = (a * ob - b * oa) / (ob - oa);
        return true;
    }
    return false;
}

ld segPoint(pt a, pt b, pt p) {
    if (a != b) {
        if (dot(p - a, b - a) >= 0 && dot(p - b, a - b) >= 0) {
            line l(a, b);
            return l.dist(p);
        }
    }
    return min(abs(p - a), abs(p - b));
}

// --- Polygons ---
bool isConvex(vector<pt> p) {
    bool hasPos = false, hasNeg = false;
    for (int i = 0, n = p.size(); i < n; i++) {
        int o = orient(p[i], p[(i + 1) % n], p[(i + 2) % n]);
        if (o > 0) hasPos = true;
        if (o < 0) hasNeg = true;
    }
    return !(hasPos && hasNeg);
}

ld areaTriangle(pt a, pt b, pt c) {
    return abs(cross(b - a, c - a)) / 2.0;
}

ld areaPolygon(vector<pt> p) {
    ld area = 0.0;
    for (int i = 0, n = p.size(); i < n; i++)
        area += cross(p[i], p[(i + 1) % n]);
    return abs(area) / 2.0;
}

bool inPolygon(vector<pt> p, pt a, bool strict = true) {
    int numCrossings = 0;
    for (int i = 0, n = p.size(); i < n; i++) {
        if (onSegment(p[i], p[(i + 1) % n], a))
            return !strict;
        bool aboveA = (p[(i + 1) % n].y >= a.y) - (p[i].y >= a.y);
        numCrossings += aboveA * orient(a, p[i], p[(i + 1) % n]) > 0;
    }
    return numCrossings & 1;
}`)
    }]);
  }
  // =================== GEOMETRY POINTS ===================
  const [geomPts] = await db.insert(templates).values({
    title: "Geometry Points",
    slug: "geometry-points",
    description: "2D point with full operator support: dot, cross, distance, rotation, unit, normal",
    categoryId: categoryId,
    tags: ["geometry", "point", "2d", "vector"],
    complexity: "O(1) per operation",
    notes: `# Geometry Points

Generic 2D point template with full arithmetic and geometric operations.

## Example
\`\`\`cpp
Point<ll> a(3, 4), b(1, 2);
cout << a.distance(b);        // 2.828
cout << a.cross(b);           // 2
cout << a.perp();             // -4 3
\`\`\`

## Methods
| Method | Description |
|--------|-------------|
| +, -, *, / | Arithmetic with point or scalar |
| dot(p) | Dot product |
| cross(p) | Cross product (2D z-component) |
| cross(a, b) | Cross of vectors (a-this) \u00d7 (b-this) |
| dist() / dist(p) | Squared distance |
| distance() / distance(p) | Euclidean distance |
| angle() / angle(p) | Polar angle / angle between vectors |
| unit() | Unit vector |
| perp() | Perpendicular (-y, x) |
| rotate(a) / rotate(p, a) | Rotation by angle a (radians) |
| normal() | Unit normal (perp().unit()) |`,
  }).returning();
  if (geomPts) {
    await db.insert(templateCodes).values([{
      templateId: geomPts.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define sz(x) int(x.size())
#define all(vec) vec.begin(), vec.end()
#define ll long long

template < typename T = int > struct Point {
    T x, y;
    Point(T _x = 0, T _y = 0) : x(_x), y(_y) {}
    Point(const Point &p) : x(p.x), y(p.y) {}
    Point operator + (const Point &p) const { return Point(x + p.x, y + p.y); }
    Point operator - (const Point &p) const { return Point(x - p.x, y - p.y); }
    Point operator * (T c) const { return Point(x * c, y * c); }
    Point operator / (T c) const { return Point(x / c, y / c); }
    bool operator == (const Point &p) const { return x == p.x && y == p.y; }
    bool operator != (const Point &p) const { return x != p.x || y != p.y; }
    bool operator < (const Point &p) const { return make_pair(y, x) < make_pair(p.y, p.x); }
    bool operator > (const Point &p) const { return make_pair(y, x) > make_pair(p.y, p.x); }
    bool operator <= (const Point &p) const { return make_pair(y, x) <= make_pair(p.y, p.x); }
    bool operator >= (const Point &p) const { return make_pair(y, x) >= make_pair(p.y, p.x); }
    friend istream& operator >> (istream &in, Point &p) { return in >> p.x >> p.y; }
    friend ostream& operator << (ostream &out, const Point &p) { return out << p.x << ' ' << p.y; }
    T dot(const Point &p) const { return x * p.x + y * p.y; }
    T cross(const Point &p) const { return x * p.y - y * p.x; }
    T cross(const Point &a, const Point &b) const { return (a - *this).cross(b - *this); }
    T dist() const { return x * x + y * y; }
    T dist(const Point &p) const { return (*this - p).dist(); }
    double distance() const { return sqrt(1.0 * dist()); }
    double distance(const Point &p) const { return sqrt(1.0 * dist(p)); }
    double angle() const { return atan2(y, x); }
    double angle(const Point &p) const { return atan2(cross(p), dot(p)); }
    Point unit() const { T d = dist(); return d ? *this / d : Point(); }
    Point perp() const { return Point(-y, x); }
    Point rotate(double a) const { return Point(x * cos(a) - y * sin(a), x * sin(a) + y * cos(a)); }
    Point rotate(const Point &p, double a) const { return (*this - p).rotate(a) + p; }
    Point normal() const { return perp().unit(); }
};`)
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
    notes: `# Convex Hull — Andrew's Monotone Chain

Andrew's monotone chain computes the convex hull of a set of 2D points in O(n log n).

## Algorithm
1. Sort points by (x, y)
2. Build lower hull left-to-right
3. Build upper hull right-to-left
4. Combine, removing duplicate endpoints

## Methods
| Method | Description |
|--------|-------------|
| Convex_Hull(points, include_collinear) | Constructor, computes hull |
| orientation(a, b, c) | Returns -1 (CW), 0 (collinear), 1 (CCW) |
| Convex_Points | vector<Point>, hull vertices in CCW order |

## Usage
\`\`\`cpp
vector<Point<int>> pts = {{0,0},{4,0},{2,3},{1,1}};
Convex_Hull<int> ch(pts);
for(auto& p : ch.Convex_Points) cout << p << "\n";
\`\`\``,
  }).returning();
  if (convHull) {
    await db.insert(templateCodes).values([{
      templateId: convHull.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define sz(x) int(x.size())
#define all(vec) vec.begin(), vec.end()
#define ll long long

template < typename T = int > struct Point {
    T x, y;
    Point(T _x = 0, T _y = 0) : x(_x), y(_y) {}
    Point(const Point &p) : x(p.x), y(p.y) {}
    Point operator + (const Point &p) const { return Point(x + p.x, y + p.y); }
    Point operator - (const Point &p) const { return Point(x - p.x, y - p.y); }
    Point operator * (T c) const { return Point(x * c, y * c); }
    Point operator / (T c) const { return Point(x / c, y / c); }
    bool operator == (const Point &p) const { return x == p.x && y == p.y; }
    bool operator != (const Point &p) const { return x != p.x || y != p.y; }
    bool operator < (const Point &p) const { return make_pair(y, x) < make_pair(p.y, p.x); }
    friend istream& operator >> (istream &in, Point &p) { return in >> p.x >> p.y; }
    friend ostream& operator << (ostream &out, const Point &p) { return out << p.x << ' ' << p.y; }
    T dot(const Point &p) const { return x * p.x + y * p.y; }
    T cross(const Point &p) const { return x * p.y - y * p.x; }
    T dist() const { return x * x + y * y; }
    T dist(const Point &p) const { return (*this - p).dist(); }
    double distance() const { return sqrt(1.0 * dist()); }
    double distance(const Point &p) const { return sqrt(1.0 * dist(p)); }
    Point perp() const { return Point(-y, x); }
};

template < typename T = int > struct Convex_Hull {

    typedef Point < T > point;

    int orientation(const point& a, const point& b, const point& c) {
        T val = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
        if(val < 0) return -1;
        if(val > 0) return 1;
        return 0;
    }

    bool cw(const point& a, const point& b, const point& c, bool include_collinear) {
        int o = orientation(a, b, c);
        return o < 0 || (include_collinear && o == 0);
    }

    bool is_collinear(const point& a, const point& b, const point& c) {
        return orientation(a, b, c) == 0;
    }

    vector < point > Convex_Points;

    Convex_Hull(vector < point > &points, bool include_collinear = false) {
        point p0 = *min_element(all(points));
        sort(all(points), [&](const point& a, const point& b) {
            int o = orientation(p0, a, b);
            if(o == 0) return p0.dist(a) < p0.dist(b);
            return o < 0;
        });
        points.erase(unique(all(points)), points.end());

        if(include_collinear){
            int idx = sz(points) - 1;
            while(idx > 0 && is_collinear(p0, points[idx], points.back())) idx--;
            reverse(points.begin() + idx + 1, points.end());
        }

        for(const point& p : points) {
            while(sz(Convex_Points) > 1 && !cw(Convex_Points[sz(Convex_Points) - 2], Convex_Points.back(), p, include_collinear))
                Convex_Points.pop_back();
            Convex_Points.push_back(p);
        }
    }
};`)
    }]);
  }
}