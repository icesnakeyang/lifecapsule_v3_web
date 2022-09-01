export function timeLeft(triggerTimeSpan) {
    let now = new Date();
    let leftTime = triggerTimeSpan - now.getTime();
    leftTime = leftTime / 1000;
    let days = Math.floor(leftTime / (60 * 60 * 24));
    let hours = Math.floor((leftTime / (60 * 60)) % 24);
    let minutes = Math.floor((leftTime / 60) % 60);
    let seconds = Math.floor(leftTime % 60);
    return {
        days,
        hours,
        minutes,
        seconds,
    };
}
