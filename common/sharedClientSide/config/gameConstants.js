var gameConstants = {
    stepDelta: 1000/25, // 25fps
    snapshotDelta: 1000/10, // ~10fps
    playerSpawnRate: 10000 // 10s
};


// derived properties to avoid recalculations

// approx framerate / nu
gameConstants.numberOfTimesPerFrameToInterpolate = 4;

module.exports = gameConstants;