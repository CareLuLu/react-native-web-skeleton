const scrollTo = (pos, time, scroller) => scroller.scrollTo({
  x: 0,
  y: pos,
  animated: time > 0,
});

export default scrollTo;
