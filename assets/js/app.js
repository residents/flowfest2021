// let width = window.innerWidth;
// let height = window.innerHeight; 
var url_ws = 'https://flowfest2021.cinteractivo.mx';
var idDevice = 'DV1';
var step = 1;
var subStep = null;
var indexesPractice = ['', 'E_ExpReto', 'E_DemoRe', 'E_PPasos1R', 'E_PPasos2R'];
var indexesRewards = ['', 'H_GanBol_', 'I_GenMech_', 'J_NoGan_'];
var difficulty = null;
var reward = null;
var width = 1920;
var height = 1080;
// damos altura y anchura que a los videos, camara y video secundario
var video = {
	x: 0,
	y: 0,
	w: width,
	h: height
}
var videoSecondary = {
	x: parseInt(width / 2),
	y: parseInt(height / 2),
	w: width / 2,
	h: height / 2
}
var cameraData = {
	x: parseInt(0 - (width / 4)),
	y: 0,
	w: width,
	h: height
}
//inicializa los canvas
var canvas = document.getElementById("canvas");
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext("2d");

var canvasCam = document.getElementById("canvasCam");
canvasCam.width = width / 2;
canvasCam.height = height;
var ctxCam = canvasCam.getContext("2d");
ctxCam.scale(-1, 1);
ctxCam.translate(cameraData.x * 2, 0);

var arrVideos = {};
var videos = document.getElementsByClassName('video');

var currentVideo = null;
var currentVideoSecondary = null;

var notEventVideo = null;

var codeQr = null;
var qrcodecontainer = document.getElementById("qrcodecontainer");

var bndSendReward = true;

for(element of videos){
	element.width = width;
	element.height = height;
	// element.load();
	//si el video se esta reproduciendo
	element.addEventListener("play", (event)=> {
		if(event.srcElement.id == notEventVideo){
			return;
		}
    	showVideo(element, ctx, video.w, video.h);
  	}, false);
  	element.addEventListener('ended', (event) => {
  		// console.log(this, event);
  		if(step == 5 && reward){
			step = 6;
		}else if(step == 6){
  			showQr();
  		}else if(event.srcElement.id == notEventVideo){
  			console.log('notEventVideo: ' + notEventVideo);
  			notEventVideo = null;
  			currentVideo.currentTime = currentVideo.duration;
  			return;
  		}
  		resetVars();
		nextVideo();
	});

	arrVideos[element.id] = element;

};


let camera = document.getElementById("camera");
// captura las imágenes del webcam
navigator.mediaDevices.getUserMedia({video: true, audio: false}).then((stream)=> {
	camera.srcObject = stream;
	camera.play();
});
function hideCam(){
	canvasCam.classList.remove("sendToFront");
}
function showCam() {
	canvasCam.classList.add("sendToFront");
	loopCam();
}

function loopCam(){
	// si el video esta parado o se ha acabado no hagas nada y sal de aquí
	if (camera.paused || camera.ended){
		return;
	}
	requestAnimationFrame(loopCam);
	ctxCam.drawImage(camera, cameraData.x, cameraData.y, cameraData.w, cameraData.h);
}

function showVideo(){
	ctx.fillStyle = "#270002";
    ctx.fillRect(video.x, video.y, video.w, video.h);
	// si el video esta parado o se ha acabado no hagas nada y sal de aquí
	requestAnimationFrame(showVideo);
	if(currentVideo === null){return;}
	if(currentVideo === undefined){return;}
	if (currentVideo.paused || currentVideo.ended){return;}
	// pinta el video en el canvas
	ctx.drawImage(currentVideo, video.x, video.y, video.w, video.h);
}
function showVideoSecondary(){
	ctx.fillStyle = "#270002";
    ctx.fillRect(videoSecondary.x, videoSecondary.y, videoSecondary.w, videoSecondary.h);
	// si el video esta parado o se ha acabado no hagas nada y sal de aquí
	requestAnimationFrame(showVideoSecondary);
	if(currentVideoSecondary === null){return;}
	if(currentVideoSecondary === undefined){return;}
	if (currentVideoSecondary.paused || currentVideoSecondary.ended){return;}
	// pinta el video en el canvas
	ctx.drawImage(currentVideoSecondary, videoSecondary.x, videoSecondary.y, videoSecondary.w, videoSecondary.h);
}
function showOnlyZoneClean(){
	ctx.fillStyle = "#270002";
    ctx.fillRect(videoSecondary.x, videoSecondary.y, videoSecondary.w, videoSecondary.h);
    requestAnimationFrame(showOnlyZoneClean);
}
function showQr(){
	createQr();
	qrcodecontainer.classList.add("sendToFront");
	currentVideo.muted = true;
}
function hideQr(){
	qrcodecontainer.classList.remove("sendToFront");
}


function invitation(){  // step 1
	let number = getRandomNumber(1,3);
	console.log('step: ' + step + ', invitation: ' + number);
	currentVideo = arrVideos['A_Inv_' + number];
	playCurrentVideo();
}
function instructions(){ //step 2
	codeQr = idDevice + '_' + Date.now();
	reward = null;
	let number = getRandomNumber(1,3);
	console.log('step: ' + step + ', instructions: ' + number);
	currentVideo = arrVideos['B_Inst_' + number];
	playCurrentVideo();
	step = 3;	
}

function practice(){ // step 3
	subStep = subStep >= 4 || subStep === null ? 1 : subStep + 1;
	difficulty = subStep == 1 ? getRandomNumber(1,3) : difficulty;
	console.log('step: ' + step + ', practice: ' + subStep + ', difficulty: ' + difficulty);
	let index = indexesPractice[subStep];
	currentVideo = arrVideos[index + difficulty];
	if(subStep >= 3){ //practice
		video.x = width / 2;
		video.w = width / 2;
		video.h = height / 2;
		showCam();
		let id = 'D_RReto' + difficulty;
		notEventVideo = id;
		currentVideoSecondary = document.getElementById(id);
		currentVideoSecondary.muted = true;
		currentVideoSecondary.play();
		showVideoSecondary();
	}
	playCurrentVideo();
	step = subStep == 4 ? 4 : step;
}

function challenge(){ // step 4
	console.log('step: ' + step + ', challenge difficulty: ' + difficulty);
	video.x = width / 4;
	currentVideo = arrVideos['D_RReto' + difficulty];
	showCam();
	showOnlyZoneClean();
	playCurrentVideo();
	takePhotos(3);
	step = 5;
}

function decision(){ // step 5
	hideCam();
	console.log('step: ' + step + ', decision difficulty: ' + difficulty);
	currentVideo = arrVideos['C_Dec_' + difficulty];
	playCurrentVideo();
}

function result(){ // step 6
	let index = indexesRewards[reward];
	let number = getRandomNumber(1, (reward == 1 ? 3 : 2));
	console.log('step: ' + step + ', result: ' + number + ', reward: ' + reward);
	currentVideo = arrVideos[index + number];
	playCurrentVideo();
	if(bndSendReward){
		sendRewardWithCode();
	}
}

function goodbye(){ // step 7
	bndSendReward = true;
	hideQr();
	let number = getRandomNumber(1,3);
	console.log('step: ' + step + ', goodbye: ' + number);
	currentVideo = arrVideos['K_Desp_' + number];
	playCurrentVideo();
	step = 1;	
}

function nextVideo(){
	switch(step){
		case 1:
			invitation();
		break;
		case 2:
			instructions();
		break;
		case 3:
			practice();
		break;
		case 4:
			challenge();
		break;
		case 5:
			decision();
		break;
		case 6:
			result();
		break;
		case 7:
			goodbye();
		break;
		default:
			console.error('Error, no step defined');
		break;
	}
}

function playCurrentVideo(){
	if(typeof(currentVideo) == undefined || currentVideo == null){
		console.log(currentVideo, 'Error al asignar el video');
		return;
	}
	currentVideo.muted = false;
	currentVideo.play();
}

function takePhotos(cantidad){
	if(cantidad > 0){
		setTimeout(() => {
			let uri = canvasCam.toDataURL("image/png");
			console.log('Photo ' + cantidad + ' tomada' );
			$.ajax({
			    type: "POST", // la variable type guarda el tipo de la peticion GET,POST,..
			    url: url_ws, //url guarda la ruta hacia donde se hace la peticion
			    data:{
			    	code:codeQr,
			    	image: uri
			    }, // data recive un objeto con la informacion que se enviara al servidor
			    success:function(datos){ //success es una funcion que se utiliza si el servidor retorna informacion
			         console.log('Photo ' + cantidad + ' enviada', datos);
			     },
			    dataType: "json" // El tipo de datos esperados del servidor. Valor predeterminado: Intelligent Guess (xml, json, script, text, html).
			})
			takePhotos(cantidad - 1);
		}, 4000);
	}
}

function getRandomNumber(min, max) {
	return parseInt(Math.random() * ((max + 1) - min) + min);
}

function resetVars(){
	video = {
		x: 0,
		y: 0,
		w: width,
		h: height
	};
	videoSecondary = {
		x: parseInt(width / 2),
		y: parseInt(height / 2),
		w: width / 2,
		h: height / 2
	};
	cameraData = {
		x: parseInt(0 - (width / 4)),
		y: 0,
		w: width,
		h: height
	};
}

function createQr(){
	qrcodecontainer.innerHTML = '';
	let qrcode = new QRCode(qrcodecontainer, {
		text: url_ws + "/show/?code=" + codeQr,
		width: 256,
		height: 256,
		colorDark : "#5868bf",
		colorLight : "#ffffff",
		correctLevel : QRCode.CorrectLevel.H
	});
	$('#qrcodecontainer').append($('<p>').addClass('code').text(codeQr));
	$('#qrcodecontainer').append($('<p>').addClass('legend').text("Escanea el código QR para ver tus fotos."));
}


var socket = io();

socket.on('setStep', function(data) {
	console.log('setStep: ' + data);
	if(step == (data - 1)){
		step = data;
	}
});

socket.on('setReward', function(data) {
	console.log('setReward: ' + data);
	reward = data;
});

function sendRewardWithCode(){
	bndSendReward = false;
	socket.emit('sendRewardWithCode', {reward: reward, code: codeQr});
}


setTimeout(invitation, 5000);