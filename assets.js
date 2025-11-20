const ASSETS = {
    peashooter: 'assets/peashooter.svg',
    sunflower: 'assets/sunflower.svg',
    wallnut: 'assets/wallnut.svg',
    cherrybomb: 'assets/cherrybomb.svg',
    snowpea: 'assets/snowpea.svg',
    potatomine: 'assets/potatomine.svg',
    chomper: 'assets/chomper.svg',
    repeater: 'assets/repeater.svg',
    jalapeno: 'assets/jalapeno.svg',
    squash: 'assets/squash.svg',
    spikeweed: 'assets/spikeweed.svg',
    threepeater: 'assets/threepeater.svg',
    torchwood: 'assets/torchwood.svg',
    tallnut: 'assets/tallnut.svg',
    puffshroom: 'assets/puffshroom.svg',
    sunshroom: 'assets/sunshroom.svg',
    fumeshroom: 'assets/fumeshroom.svg',
    hypnoshroom: 'assets/hypnoshroom.svg',
    scaredyshroom: 'assets/scaredyshroom.svg',
    iceshroom: 'assets/iceshroom.svg',
    doomshroom: 'assets/doomshroom.svg',
    splitpea: 'assets/splitpea.svg',
    starfruit: 'assets/starfruit.svg',
    magnetshroom: 'assets/magnetshroom.svg',
    cabbagepult: 'assets/cabbagepult.svg',
    melonpult: 'assets/melonpult.svg',
    'normal': 'assets/zombie.svg',
    'conehead': 'assets/conehead.svg',
    'buckethead': 'assets/buckethead.svg',
    'newspaper': 'assets/newspaper_zombie.svg',
    'balloon': 'assets/balloon_zombie.svg',
    'allstar': 'assets/allstar_zombie.svg',
    'miner': 'assets/miner_zombie.svg',
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
