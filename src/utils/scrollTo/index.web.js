import { Screen } from 'react-native-web-ui-components';

const scrollToSmoothly = (pos, element, maxTime) => {
  /* Time is exact amount of time the scrolling will take (in milliseconds) */
  /* Pos is the y-position to scroll to (in pixels) */
  /* Code written by hev1 */
  if (typeof pos !== 'number') {
    pos = parseFloat(pos); // eslint-disable-line
  }
  if (Number.isNaN(pos)) {
    throw new Error('Position must be a number');
  }
  if (pos < 0) {
    return;
  }
  const currentPos = element.scrollTop();

  const time = Math.min(maxTime || 500, Math.abs(currentPos - pos));

  let start = null;
  window.requestAnimationFrame(function step(currentTime) {
    start = !start ? currentTime : start;
    let progress;
    if (currentPos < pos) {
      progress = currentTime - start;
      element.scrollTo(0, ((pos - currentPos) * progress / time) + currentPos);
      if (progress < time) {
        window.requestAnimationFrame(step);
      } else {
        element.scrollTo(0, pos);
      }
    } else {
      progress = currentTime - start;
      element.scrollTo(0, currentPos - ((currentPos - pos) * progress / time));
      if (progress < time) {
        window.requestAnimationFrame(step);
      } else {
        element.scrollTo(0, pos);
      }
    }
  });
};

const scrollTo = (pos, time) => {
  const element = Screen.getScrollElement();
  if (time === 0) {
    element.scrollTo(0, pos);
  } else {
    scrollToSmoothly(pos, element, time);
  }
};

export default scrollTo;
