// const control = io.connect('http://localhost:8081/', {path: '/'});

function changeStep(step){
    control.emit('changeStep', step);
}

function setReward(reward){
    control.emit('setReward', reward);
}
