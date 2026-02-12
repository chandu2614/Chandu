// 3D Villa Generator using Babylon.js

class VillaGenerator {
    constructor(scene) {
        this.scene = scene;
        this.rooms = [];
        this.walls = [];
        this.materials = this.createMaterials();
    }

    createMaterials() {
        const materials = {};

        // Wall material
        materials.wall = new BABYLON.StandardMaterial('wallMat', this.scene);
        materials.wall.diffuse = new BABYLON.Color3(0.9, 0.9, 0.9);
        materials.wall.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);

        // Floor material
        materials.floor = new BABYLON.StandardMaterial('floorMat', this.scene);
        materials.floor.diffuse = new BABYLON.Color3(0.8, 0.8, 0.8);

        // Ceiling material
        materials.ceiling = new BABYLON.StandardMaterial('ceilingMat', this.scene);
        materials.ceiling.diffuse = new BABYLON.Color3(0.95, 0.95, 0.95);

        // Pool material
        materials.pool = new BABYLON.StandardMaterial('poolMat', this.scene);
        materials.pool.diffuse = new BABYLON.Color3(0.2, 0.6, 0.9);
        materials.pool.alpha = 0.7;

        return materials;
    }

    // Convert feet and inches to units
    parseDistance(distStr) {
        const parts = distStr.match(/(\d+)\'\s*-\s*(\d+)"/);
        if (parts) {
            return parseFloat(parts[1]) + parseFloat(parts[2]) / 12;
        }
        return 0;
    }

    // Create a room box
    createRoom(name, width, depth, height, posX, posY, posZ, material) {
        const room = BABYLON.MeshBuilder.CreateBox(name, {
            width: width,
            depth: depth,
            height: height
        }, this.scene);

        room.position = new BABYLON.Vector3(posX, posY, posZ);
        room.material = material;
        room.name = name;

        return room;
    }

    // Create walls around a room
    createWalls(roomName, width, depth, height, posX, posY, posZ, wallThickness = 0.5) {
        const walls = [];

        const frontWall = BABYLON.MeshBuilder.CreateBox(`${roomName}_wallFront`, {
            width: width + wallThickness * 2,
            height: height,
            depth: wallThickness
        }, this.scene);
        frontWall.position = new BABYLON.Vector3(posX, posY, posZ - depth / 2 - wallThickness / 2);
        frontWall.material = this.materials.wall;
        walls.push(frontWall);

        const backWall = BABYLON.MeshBuilder.CreateBox(`${roomName}_wallBack`, {
            width: width + wallThickness * 2,
            height: height,
            depth: wallThickness
        }, this.scene);
        backWall.position = new BABYLON.Vector3(posX, posY, posZ + depth / 2 + wallThickness / 2);
        backWall.material = this.materials.wall;
        walls.push(backWall);

        const leftWall = BABYLON.MeshBuilder.CreateBox(`${roomName}_wallLeft`, {
            width: wallThickness,
            height: height,
            depth: depth
        }, this.scene);
        leftWall.position = new BABYLON.Vector3(posX - width / 2 - wallThickness / 2, posY, posZ);
        leftWall.material = this.materials.wall;
        walls.push(leftWall);

        const rightWall = BABYLON.MeshBuilder.CreateBox(`${roomName}_wallRight`, {
            width: wallThickness,
            height: height,
            depth: depth
        }, this.scene);
        rightWall.position = new BABYLON.Vector3(posX + width / 2 + wallThickness / 2, posY, posZ);
        rightWall.material = this.materials.wall;
        walls.push(rightWall);

        return walls;
    }

    // Create floor
    createFloor(width, depth, posX, posY, posZ) {
        const floor = BABYLON.MeshBuilder.CreateBox('floor', {
            width: width,
            depth: depth,
            height: 0.2
        }, this.scene);

        floor.position = new BABYLON.Vector3(posX, posY, posZ);
        floor.material = this.materials.floor;

        return floor;
    }

    // Create ceiling
    createCeiling(width, depth, posX, posY, posZ, height) {
        const ceiling = BABYLON.MeshBuilder.CreateBox('ceiling', {
            width: width,
            depth: depth,
            height: 0.2
        }, this.scene);

        ceiling.position = new BABYLON.Vector3(posX, posY + height / 2, posZ);
        ceiling.material = this.materials.ceiling;

        return ceiling;
    }

    // Create swimming pool
    createPool(width, depth, posX, posY, posZ, poolDepth = 5) {
        const pool = BABYLON.MeshBuilder.CreateBox('swimmingPool', {
            width: width,
            depth: depth,
            height: poolDepth
        }, this.scene);

        pool.position = new BABYLON.Vector3(posX, posY - poolDepth / 2, posZ);
        pool.material = this.materials.pool;

        return pool;
    }

    // Generate ground floor
    generateGroundFloor() {
        const floorHeight = 10;
        const floorY = 0;

        this.createWalls('foyer', 15, 20, floorHeight, 0, floorHeight / 2, 0);
        this.createFloor(15, 20, 0, 0, 0);
        this.createCeiling(15, 20, 0, floorHeight, 0, floorHeight);

        const drawingWidth = this.parseDistance("17'-9"");
        const drawingDepth = this.parseDistance("12'-0"");
        this.createWalls('drawingRoom', drawingWidth, drawingDepth, floorHeight * 2, 20, floorHeight, 0);
        this.createFloor(drawingWidth, drawingDepth, 20, 0, 0);
        this.createCeiling(drawingWidth, drawingDepth, 20, floorHeight * 2, 0, floorHeight * 2);

        const kitchenWidth = this.parseDistance("14'-9"");
        const kitchenDepth = this.parseDistance("10'-4.5"");
        this.createWalls('kitchenDining', kitchenWidth, kitchenDepth, floorHeight, 10, floorHeight / 2, -25);
        this.createFloor(kitchenWidth, kitchenDepth, 10, 0, -25);
        this.createCeiling(kitchenWidth, kitchenDepth, 10, floorHeight, 0, -25);

        const poolWidth = this.parseDistance("9'-0"");
        const poolDepth = this.parseDistance("18'-0"");
        this.createPool(poolWidth, poolDepth, 35, 0, 5, 5);

        const deckWidth = this.parseDistance("8'-3"");
        const deckDepth = this.parseDistance("12'-4.5"");
        this.createWalls('poolDeck', deckWidth, deckDepth, floorHeight, 30, floorHeight / 2, -5);
        this.createFloor(deckWidth, deckDepth, 30, 0, -5);
    }

    // Generate second floor
    generateSecondFloor() {
        const floorHeight = 10;
        const floorY = floorHeight;

        const masterWidth = this.parseDistance("21'-9"");
        const masterDepth = this.parseDistance("14'-0"");
        this.createWalls('masterBedroom', masterWidth, masterDepth, floorHeight, 0, floorY + floorHeight / 2, 0);
        this.createFloor(masterWidth, masterDepth, 0, floorY, 0);
        this.createCeiling(masterWidth, masterDepth, 0, floorY + floorHeight, 0, floorHeight);

        const secondWidth = this.parseDistance("16'-0"");
        const secondDepth = this.parseDistance("12'-1.5"");
        this.createWalls('secondBedroom', secondWidth, secondDepth, floorHeight, -20, floorY + floorHeight / 2, 0);
        this.createFloor(secondWidth, secondDepth, -20, floorY, 0);
        this.createCeiling(secondWidth, secondDepth, -20, floorY + floorHeight, 0, floorHeight);

        const livingWidth = this.parseDistance("21'-9"");
        const livingDepth = this.parseDistance("12'-0"");
        this.createWalls('livingRoom', livingWidth, livingDepth, floorHeight, 20, floorY + floorHeight / 2, 0);
        this.createFloor(livingWidth, livingDepth, 20, floorY, 0);
        this.createCeiling(livingWidth, livingDepth, 20, floorY + floorHeight, 0, floorHeight);

        const terraceWidth = this.parseDistance("9'-0"");
        const terraceDepth = this.parseDistance("12'-0"");
        this.createFloor(terraceWidth, terraceDepth, 15, floorY, -30);
    }

    // Generate complete villa
    generateVilla() {
        console.log('Generating 3D Villa...');
        this.generateGroundFloor();
        this.generateSecondFloor();
        console.log('Villa generation complete!');
    }
}

export default VillaGenerator;