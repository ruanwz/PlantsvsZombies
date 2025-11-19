const ASSETS = {
    peashooter: 'assets/peashooter.svg',
    sunflower: 'assets/sunflower.svg',
    wallnut: 'assets/wallnut.svg',
    cherrybomb: 'assets/cherrybomb.svg',
    snowpea: 'assets/snowpea.svg',
    potatomine: 'assets/potatomine.svg',
    chomper: 'assets/chomper.svg',
    repeater: 'assets/repeater.svg',
    zombie: 'assets/zombie.svg',
    conehead: 'assets/conehead.svg',
    buckethead: 'assets/buckethead.svg',
    flagzombie: 'assets/flagzombie.svg',
    newspaperzombie: 'assets/newspaperzombie.svg'
};

const loadedImages = {};

function loadAssets() {
    for (let key in ASSETS) {
        const img = new Image();
        img.src = ASSETS[key];
        loadedImages[key] = img;
    }
}

loadAssets();
