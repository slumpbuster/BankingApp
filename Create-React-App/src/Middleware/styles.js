const cardClasses = (bgcolor, txtcolor) => {
  const bg  = bgcolor ? ' bg-' + bgcolor : ' ';
  const txt = txtcolor ? ' text-' + txtcolor: ' text-white';
  return 'card mb-3 ' + bg + txt;
}

const hdrClasses = (headerbgcolor, headertxtcolor, bgcolor, txtcolor) => {
  const bg  = headerbgcolor ? ' bg-' + headerbgcolor : bgcolor ? ' bg-' + bgcolor : ' ';
  const txt = headertxtcolor ? ' text-' + headertxtcolor: txtcolor ? ' text-' + txtcolor: ' text-white';
  return 'card-header header ' + bg + txt;
}

export { cardClasses, hdrClasses };