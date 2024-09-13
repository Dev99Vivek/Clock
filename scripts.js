document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-button');
    const contents = document.querySelectorAll('.tab-content');
    const clockDisplay = document.getElementById('clockDisplay');
    const stopwatchDisplay = document.getElementById('stopwatchDisplay');
    const timerDisplay = document.getElementById('timerDisplay');
    const toggleFormatButton = document.getElementById('toggleFormat');
    let is24HourFormat = false;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            contents.forEach(content => {
                content.classList.remove('active');
                content.style.display = 'none';
            });
            const targetContent = document.getElementById(tab.dataset.target);
            setTimeout(() => {
                targetContent.style.display = 'block';
                targetContent.classList.add('active');
            }, 10);
        });
    });

    // Clock
    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = String(now.getMinutes()).padStart(2, '0');
        let seconds = String(now.getSeconds()).padStart(2, '0');
        let milliseconds = String(now.getMilliseconds()).padStart(3, '0');
        let period = '';

        if (!is24HourFormat) {
            period = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
        }

        clockDisplay.innerHTML = `
            <div class="clock-face">
                ${hours}:${minutes}:${seconds}<span id="clockMilliseconds">:${milliseconds}</span> ${period}
            </div>
        `;
    }

    setInterval(updateClock, 10);

    toggleFormatButton.addEventListener('click', () => {
        is24HourFormat = !is24HourFormat;
        toggleFormatButton.textContent = is24HourFormat ? 'Switch to 12-Hour' : 'Switch to 24-Hour';
    });

    // Stopwatch
    let stopwatchTime = 0;
    let stopwatchMilliseconds = 0;
    let stopwatchInterval;

    document.getElementById('startStopwatch').addEventListener('click', () => {
        clearInterval(stopwatchInterval);
        stopwatchInterval = setInterval(() => {
            stopwatchMilliseconds += 10;
            if (stopwatchMilliseconds >= 1000) {
                stopwatchTime++;
                stopwatchMilliseconds = 0;
            }
            let hours = String(Math.floor(stopwatchTime / 3600)).padStart(2, '0');
            let minutes = String(Math.floor((stopwatchTime % 3600) / 60)).padStart(2, '0');
            let seconds = String(stopwatchTime % 60).padStart(2, '0');
            let milliseconds = String(Math.floor(stopwatchMilliseconds / 10)).padStart(2, '0');
            stopwatchDisplay.innerHTML = `
                <div class="stopwatch-face">
                    ${hours}:${minutes}:${seconds}<span id="stopwatchMilliseconds">:${milliseconds}</span>
                </div>
            `;
        }, 10);
    });

    document.getElementById('stopStopwatch').addEventListener('click', () => {
        clearInterval(stopwatchInterval);
    });

    document.getElementById('resetStopwatch').addEventListener('click', () => {
        clearInterval(stopwatchInterval);
        stopwatchTime = 0;
        stopwatchMilliseconds = 0;
        stopwatchDisplay.innerHTML = `
            <div class="stopwatch-face">
                00:00:00<span id="stopwatchMilliseconds">:000</span>
            </div>
        `;
    });

    // Timer
    let timerInterval;

    function getTimerTime() {
        const hours = parseInt(document.getElementById('hoursInput').value, 10) || 0;
        const minutes = parseInt(document.getElementById('minutesInput').value, 10) || 0;
        const seconds = parseInt(document.getElementById('secondsInput').value, 10) || 0;
        const milliseconds = parseInt(document.getElementById('millisecondsInput').value, 10) || 0;
        return (hours * 3600) + (minutes * 60) + seconds + (milliseconds / 1000);
    }

    document.getElementById('startTimer').addEventListener('click', () => {
        clearInterval(timerInterval);
        const totalTime = getTimerTime();
        if (totalTime <= 0) {
            alert('Please enter a valid time.');
            return;
        }
        let remainingTime = totalTime;
        timerDisplay.classList.add('countdown');
        timerInterval = setInterval(() => {
            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                timerDisplay.classList.remove('countdown');
                alert('Time is up!');
                return;
            }
            remainingTime -= 0.01; // Decrement by 10 milliseconds
            let hours = String(Math.floor(remainingTime / 3600)).padStart(2, '0');
            let minutes = String(Math.floor((remainingTime % 3600) / 60)).padStart(2, '0');
            let seconds = String(Math.floor(remainingTime % 60)).padStart(2, '0');
            let milliseconds = String(Math.floor((remainingTime % 1) * 1000)).padStart(3, '0');
            timerDisplay.innerHTML = `
                ${hours}:${minutes}:${seconds}<span id="timerMilliseconds">:${milliseconds}</span>
            `;
        }, 10);
    });

    document.getElementById('stopTimer').addEventListener('click', () => {
        clearInterval(timerInterval);
    });

    document.getElementById('resetTimer').addEventListener('click', () => {
        clearInterval(timerInterval);
        timerDisplay.innerHTML = `
            00:00:00<span id="timerMilliseconds">:000</span>
        `;
    });
});
