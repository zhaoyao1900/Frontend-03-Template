const images = require('images');

/**
 * 渲染成图片
 * @param {*} viewport 
 * @param {*} element 
 */
function render(viewport, element) {
    if (element.style) {
        let img = images(element.style.width, element.style.height);

        if (element.style['background-color']) {
            let color = element.style['background-color'] || 'rgb(0, 255, 255)';
            color.match(/rgb\((\d+),(\d+),(\d+)\)/);
            img.fillColor(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3));
            viewport.draw(img, element.style.left || 0 ,element.style.top || 0);
        }


    }

}


module.exports = render;