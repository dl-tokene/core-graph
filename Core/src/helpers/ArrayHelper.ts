export function extendArray<T>(array: Array<T>, elements: Array<T>): Array<T> {
  for (let i = 0; i < elements.length; i++) {
    if (!array.includes(elements[i])) {
      array.push(elements[i]);
    }
  }
  return array;
}

export function reduceArray<T>(array: Array<T>, elements: Array<T>): Array<T> {
  for (let i = 0; i < elements.length; i++) {
    if (array.includes(elements[i])) {
      let index = array.indexOf(elements[i]);

      let tmp = array[array.length - 1];
      array[array.length - 1] = array[index];
      array[index] = tmp;

      array.pop();
    }
  }
  return array;
}

export function upcastCopy<T extends V, V>(array: Array<T>): Array<V> {
  let newArr = new Array<V>();

  for (let i = 0; i < array.length; i++) {
    newArr.push(array[i]);
  }

  return newArr;
}
