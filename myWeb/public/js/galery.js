$(document).ready(() => {
    var images = [];
    for(var i=0; i < 100; i++) 
        images.push({img: $(`#img-${i}`), imgPopup: $(`#img-popup-${i}`)});
    
    images.forEach(image => {
        image.img.click(() => {
            $('.black-modal').fadeIn(500);
            image.imgPopup.fadeIn(500);
        })
    })

    $('.black-modal').click(() => {
        for (let i = 0; i < images.length; i++) {
            images[i].imgPopup.hide();
        }
        $('.black-modal').hide();
    })
})