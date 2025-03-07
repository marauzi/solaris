module.exports = class RandomService {

    getRandomNumber(max) {
        return Math.floor(Math.random() * max);
    }

    // Note that the max is INCLUSIVE
    getRandomNumberBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    getRandomNumberBetweenEXP(min, max, P1 = 0.5) {
        // P1 is the chance that the result is below half. So if the end result is between 0 and 1, like a Math.random,
        // P1 describes the chance of the number being between 0 and 0.5, this makes P2 the chance of it being between 0.5 and 1
        let P2 = 1 - P1;
        if (P1 <= 0) {
            return max;
        } else if (P1 >= 1) {
            return min;
        }
        let t = Math.random()
        let exp = Math.log(P2) / Math.log(0.5)
        // t**exp is still a value between 0 and 1, however the odds on each range is not the same, for example, if exp = 2, the odds on t**exp > 0.5 are 75%,
        return Math.floor(t**exp * (max - min + 1) + min);
    }

    getRandomAngle() {
        return Math.random() * Math.PI * 2;
    }

    getRandomPositionInCircle(radius) {
        let angle = this.getRandomAngle();
        let radiusX = this.getRandomNumber(radius);
        let radiusY = this.getRandomNumber(radius);

        return {
            x: Math.cos(angle) * radiusX,
            y: Math.sin(angle) * radiusY
        };
    }

    getRandomPositionInCircleFromOrigin(originX, originY, radius) {
        let position = this.getRandomPositionInCircle(radius);

        position.x += originX;
        position.y += originY;

        return position;
    }
    
    generateStarNaturalResources(radius, x, y, minResources, maxResources, fuzzy = false){
        const RS_BASE = 2;
        const RS_EXPONENT = 5.8;

        let vector = Math.hypot(x, y);
        
        //How far from the outside (%) is the point
        let vectorScale = (radius - vector) / radius;

        let resourceRange = maxResources - minResources;

        let naturalResources = minResources + (resourceRange * vectorScale);

        // TODO: This is a better approach however appears to be incorrect. Seems to be returning
        // the reverse of what is intended. i.e Center of the galaxy returns max resources instead of min.
        // let naturalResources = minResources + (resourceRange * Math.pow(RS_BASE, -RS_EXPONENT * Math.pow(vectorScale, 2)));

        if (fuzzy) {
            const FUZZY_LIMIT = 10;

            let floorFuzzyNR = Math.max(minResources, naturalResources - FUZZY_LIMIT);
            let ceilFuzzyNR = Math.min(maxResources, naturalResources + FUZZY_LIMIT);

            naturalResources = this.getRandomNumberBetween(floorFuzzyNR, ceilFuzzyNR);
        }

        // Double check.
        naturalResources = Math.max(minResources, naturalResources);
        naturalResources = Math.min(maxResources, naturalResources);

        return naturalResources;
    }

};
