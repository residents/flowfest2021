
$(function() {
    
});
var bndCompromiso = false;
const cenefa = io.connect(location.origin + ':8081/cenefa');
const separator = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
var cenefas, stats;
var pilares = [
    { length: 0 },
]
var finishCompromiso = function(that){
    console.log(that);
    $(that).remove();
    init();
}
cenefa.on('compromiso', function(data) {
    bndCompromiso = true;
    $('.marquee').stop().remove();
    let marquee = $('<span class="marquee">').html(data.mi_compromiso_es);
    $('.pilar[data-pilar='+data.id_pilar+']').html(marquee);
    let widthMarquee = marquee.css("width");
    widthMarquee = widthMarquee.split('.');
    widthMarquee = parseInt(widthMarquee[0])+10;
    let time = widthMarquee*20;
    marquee.animate({left: '-'+widthMarquee}, time, 'linear', function(){
        finishCompromiso(marquee);
    });
});

cenefa.on('reset', function(data) {
    location.reload();
});

cenefa.on('cenefa', function(cenefas) {
    if(!bndCompromiso){
        let marquee = $('<span class="marquee">').html(cenefas.texto);
        $('.pilar[data-pilar='+cenefas.id_pilar+']').html(marquee);
        let widthMarquee = marquee.css("width");
	console.log(widthMarquee);
        widthMarquee = widthMarquee.split('.');
	console.log(widthMarquee);
        widthMarquee = parseInt(widthMarquee[0])+10;
	console.log(widthMarquee);
        let time = widthMarquee*30;
        marquee.animate({left: '-'+widthMarquee}, time, 'linear', function(){
            finishCenefa(marquee);
        });
    }
});

cenefa.on('stats', function(stats) {
    if(!bndCompromiso){
        let marquee = $('<span class="marquee">').html(stats.cantidad+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +stats.texto);
        $('.pilar[data-pilar='+stats.id_pilar+']').html(marquee);
        let widthMarquee = marquee.css("width");
        widthMarquee = widthMarquee.split('.');
        widthMarquee = parseInt(widthMarquee[0])+10;
        let time = widthMarquee*40;
        marquee.animate({left: '-'+widthMarquee}, time, 'linear', function(){
            finishStats(marquee);
        });
    }
});

var finishCenefa = function(that=""){
    cenefa.emit('getStats', $(that).parent().attr('data-pilar'));
    $(that).remove();
    console.log('finishCenefa');
}
var finishStats = function(that=""){
    cenefa.emit('getCenefas', $(that).parent().attr('data-pilar'));
    $(that).remove();
    console.log('finishStats');
}
var init = function(){
    bndCompromiso = false;
    cenefa.emit('getCenefas', 1);
    setTimeout(function(){
        cenefa.emit('getCenefas', 3);
    }, 1000);
    setTimeout(function(){
        cenefa.emit('getCenefas', 2);
    }, 3000);
    setTimeout(function(){
        cenefa.emit('getCenefas', 4);
    }, 4000);
}
setTimeout(init, 1000);
