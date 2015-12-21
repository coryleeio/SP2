var gameConstants = {
    stepDelta: 1000/25, // 25fps
    snapshotDelta: 1000/10, // ~10fps
    playerSpawnRate: 10000, // 10s
    starFieldPosXMinimum: -50,
    starFieldPosXMaximum: 50,
    starFieldPosZMinimum: -50,
    starFieldPosZMaximum: 50,
    starFieldPosYMinimum: -50,
    starFieldPosYMaximum: 50,
    numberOfDustParticles: 12000,
    dustSize: 0.05
};


module.exports = gameConstants;