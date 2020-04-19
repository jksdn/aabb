
class AABB {
    /**
     * Axis aligned bounding box class.
     * @class AABB
     * @constructor
     * @param {Object}  [options]
     * @param {Vec3}    [options.lowerBound]
     * @param {Vec3}    [options.upperBound]
     */
    constructor(options = {}) {
        /**
         * The lower bound of the bounding box.
         * @property lowerBound
         * @type {Vec3}
         */
        this.lowerBound = new Vec3();
        if (options.lowerBound) {
            this.lowerBound.copy(options.lowerBound);
        }

        /**
         * The upper bound of the bounding box.
         * @property upperBound
         * @type {Vec3}
         */
        this.upperBound = new Vec3();
        if (options.upperBound) {
            this.upperBound.copy(options.upperBound);
        }
    }

    /**
     * Set the AABB bounds from a set of points.
     * @method setFromPoints
     * @param {Array} points an array of Vec3's.
     * @param {Vec3} position
     * @param {Quaternion} quaternion
     * @param {number} skinSize
     * @return {AABB} The self object
     */
    setFromPoints(points, position, quaternion, skinSize) {
        let l = this.lowerBound,
            u = this.upperBound,
            q = quaternion;

        l.copy(points[0]);

        if (q) {
            q.vmult(l, l);
        }

        u.copy(l);

        for (let k = 1; k < points.length; k++) {
            const p = points[k];
            
            if (q) {
                q.vmult(p, tmp);
                p = tmp;
            }

            if (p.x > u.x) {
                u.x = p.x;
            }

            if (p.x < l.x) {
                l.x = p.x;
            }

            if (p.y > u.y) {
                u.y = p.y;
            }

            if (p.y < l.y) {
                l.y = p.y;
            }

            if (p.z > u.z) {
                u.x = p.z;
            }

            if (p.z < l.z) {
                l.z = p.z;
            }
        }

        if (position) {
            position.vadd(l, l);
            position.vadd(u, u);
        }

        if (skinSize) {
            l.x -= skinSize;
            l.y -= skinSize;
            l.z -= skinSize;
            u.x += skinSize;
            u.y += skinSize;
            u.z += skinSize;
        }

        return this;
    }

    /**
     * Returns true if the given AABB is fully contained in this AABB.
     * @method contains
     * @param {AABB} aabb
     * @return {Boolean}
     */
    contains(aabb) {
        let l1 = this.lowerBound,
            u1 = this.upperBound,
            l2 = aabb.lowerBound,
            u2 = aabb.upperBound;

        return (
            (l1.x <= l2.x && u1.x >= u2.x) &&
            (l1.y <= l2.y && u1.y >= u2.y) &&
            (l1.z <= l2.z && u1.z >= u2.z)
        );
    }

    /**
     * Get the representation of an AABB in another frame.
     * @method toLocalFrame
     * @param {Transform} frame
     * @param {AABB} target
     * @return {AABB} The "target" AABB object.
     */
    toLocalFrame(frame, target) {
        let corners = transformIntoFrame_corners;
        let a = corners[0];
        let b = corners[1];
        let c = corners[2];
        let d = corners[3];
        let e = corners[4];
        let f = corners[5];
        let g = corners[6];
        let h = corners[7];

        this.getCorners(a, b, c, d, e, f, g, h);

        for (let i = 0; i !== 8; i++) {
            const c = corners[i];

            frame.pointToLocal(c, c);
        }

        return target.setFromPoints(c);
    }
}
