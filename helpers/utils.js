export const setNewTime = (delay) => {
    let date = new Date();
    return date.setMinutes(date.getMinutes() + delay);
}