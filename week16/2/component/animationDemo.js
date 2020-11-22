import { Timeline, Animation } from './animation.js';
import { ease, easeIn, easeInOut, easeOut } from './ease.js';


let tl = new Timeline();
tl.start();
tl.add(new Animation(document.querySelector('#el').style, "transform", 0, 1000, 2000, 0, easeIn, x => `translateX(${x}px)`));
document.getElementById('pause').addEventListener('click', () => {
    tl.pause()
})
document.getElementById('resume').addEventListener('click', () => {
    tl.resume()
})


document.getElementById('el2').style.transition = `transform ease-in 2s`;
document.getElementById('el2').style.transform = `translateX(1000px)`;