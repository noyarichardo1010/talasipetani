export const replaceAt = (text, index, replacement) => {
  return (
    text?.substring(0, index) +
    replacement +
    text?.substring(index + replacement.length)
  );
};

export const getGradeStyle = (i = 0) => {
  // console.log('i', i);
  const gradeStyles = ['gradeA', 'gradeB', 'gradeC'];
  // let index;
  // if (i) {
  //   index = i;
  // } else {
  //   index = Math.floor(Math.random() * gradeStyles.length);
  // }

  const randomValue = gradeStyles[i];
  // console.log('randomValue', randomValue);
  return randomValue;
};
