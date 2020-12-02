export let chartConfig = {
    type: 'line',
    data: {
        labels: [ "angry",
                  "disgust",
                  "fear",
                  "happy",
                  "sad",
                  "surprise",
                  "neutral"]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false
        },
        title: {
            display: false
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: false,
                gridLines: {
                    color: "#363d45"
                },
                scaleLabel: {
                    display: false
                }
            }],
            yAxes: [{
                display: true,
                gridLines: {
                    color: "#363d45"
                },
                scaleLabel: {
                    display: false
                },
                ticks: {
                    reverse: false,
                    display: true,
                    max: 100,
                    min: 1
                }
            }]
        },
        animation: {
            duration: 1000
        },
        // annotation: {
        //     annotations: [{
        //         type: 'line',
        //         mode: 'horizontal',
        //         scaleID: 'y-axis-0',
        //         value: divAve,
        //         borderColor: '#72dba4',
        //         borderWidth: 2
        //     }],
        //     drawTime: "afterDraw" // (default)
        // }
    }
}

const _grapefruit = "#ED5565";
const _sunflower = "#FFCE54"
const _mint = "#48CFAD"
const _aqua = "#4FC1E9"
const _lavander = "#AC92EC"
const _bluejeans = "#5D9CEC"
const _pinkrose = "#EC87C0"

export let emotionDataset = [{
    label: 'Angry',
    lineTension: 0.4,
    backgroundColor: 'transparent',
    borderColor: _grapefruit,
    borderWidth: 1,
    pointBackgroundColor: '#ffffff',
    pointBorderColor: _grapefruit,
    pointBorderWidth: 3,
    pointRadius: 3,
    pointHoverRadius: 5,
    data: [],
    fill: "start",
},
{
    label: 'Disgust',
    lineTension: 0.4,
    backgroundColor: 'transparent',
    borderColor: _bluejeans,
    borderWidth: 1,
    pointBackgroundColor: '#ffffff',
    pointBorderColor: _bluejeans,
    pointBorderWidth: 3,
    pointRadius: 3,
    pointHoverRadius: 5,
    data: [],
    fill: "start",
},
{
    label: 'Fear',
    lineTension: 0.4,
    backgroundColor: 'transparent',
    borderColor: _lavander,
    borderWidth: 1,
    pointBackgroundColor: '#ffffff',
    pointBorderColor: _lavander,
    pointBorderWidth: 3,
    pointRadius: 3,
    pointHoverRadius: 5,
    data: [],
    fill: "start",
},
{
    label: 'Happy',
    lineTension: 0.4,
    backgroundColor: 'transparent',
    borderColor: _pinkrose,
    borderWidth: 1,
    pointBackgroundColor: '#ffffff',
    pointBorderColor: _pinkrose,
    pointBorderWidth: 3,
    pointRadius: 3,
    pointHoverRadius: 5,
    data: [],
    fill: "start",
},
{
    label: 'Sad',
    lineTension: 0.4,
    backgroundColor: 'transparent',
    borderColor: _aqua,
    borderWidth: 1,
    pointBackgroundColor: '#ffffff',
    pointBorderColor: _aqua,
    pointBorderWidth: 3,
    pointRadius: 3,
    pointHoverRadius: 5,
    data: [],
    fill: "start",
},
{
    label: 'Surprise',
    lineTension: 0.4,
    backgroundColor: 'transparent',
    borderColor: _sunflower,
    borderWidth: 1,
    pointBackgroundColor: '#ffffff',
    pointBorderColor: _sunflower,
    pointBorderWidth: 3,
    pointRadius: 3,
    pointHoverRadius: 5,
    data: [],
    fill: "start",
},
{
    label: 'Neutral',
    lineTension: 0.4,
    backgroundColor: 'transparent',
    borderColor: _mint,
    borderWidth: 1,
    pointBackgroundColor: '#ffffff',
    pointBorderColor: _mint,
    pointBorderWidth: 3,
    pointRadius: 3,
    pointHoverRadius: 5,
    data: [],
    fill: "start",
}]