const animeData = [
    { name: 'The World Finest Assassin', img: 'https://images3.alphacoders.com/118/1183945.jpg', pos: 'center 60%' },
    { name: 'That Time I Got Reincarnated as a Slime', img: 'https://images.alphacoders.com/136/thumb-1920-1362052.png', pos: 'center 40%' },       
    { name: "Frieren: Beyond Journey's End", img: 'https://images2.alphacoders.com/135/thumb-1920-1356501.jpeg', pos: 'center 18%' },
    { name: 'The Eminence In Shadow', img: 'https://images2.alphacoders.com/133/thumb-1920-1337180.png', pos: 'center 50%' }, 
    { name: 'Seirei Gensouki', img: 'https://images7.alphacoders.com/123/thumb-1920-1237805.jpg', pos: 'center 35%' }
];

const shuffle = (array) => array.sort(() => Math.random() - 0.5);
let shuffledData = shuffle([...animeData]);
let zenIndex = 0;
let zenIsDragging = false;
let zenStartX = 0;
const dragThreshold = 50;

const refreshZenUI = (index) => {
    const zenPoster = document.getElementById('anitv-poster-view');
    zenPoster.style.opacity = 0;
    
    setTimeout(() => {
        const item = shuffledData[index];
        zenPoster.src = item.img;
        zenPoster.style.objectPosition = item.pos;
        zenPoster.onload = () => { zenPoster.style.opacity = 1; };
    }, 400); 
};

const zenShift = (dir) => {
    zenIndex = (zenIndex + dir + shuffledData.length) % shuffledData.length;
    if (zenIndex === 0 && dir > 0) shuffledData = shuffle([...animeData]);
    refreshZenUI(zenIndex);
};

let zenTimer = setInterval(() => zenShift(1), 6000);

const trigger = document.getElementById('anitv-trigger');
const handleDown = (x) => { zenIsDragging = true; zenStartX = x; clearInterval(zenTimer); };
const handleUp = (x) => {
    if (!zenIsDragging) return;
    const diff = zenStartX - x;
    if (Math.abs(diff) > dragThreshold) zenShift(diff > 0 ? 1 : -1);
    zenIsDragging = false;
    zenTimer = setInterval(() => zenShift(1), 6000);
};

trigger.addEventListener('mousedown', (e) => handleDown(e.clientX));
window.addEventListener('mouseup', (e) => handleUp(e.clientX));
trigger.addEventListener('touchstart', (e) => handleDown(e.touches[0].clientX));
window.addEventListener('touchend', (e) => handleUp(e.changedTouches[0].clientX));

document.addEventListener('DOMContentLoaded', () => refreshZenUI(0));