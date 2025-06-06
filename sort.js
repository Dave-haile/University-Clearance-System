const simpleSort = (list) => {
    const n = list.length;
  for (let i = 0; i <= n - 2; i++) {
    console.log('i', i);
    for (let j = i + 1; j <= n - 1; j++) {
        console.log('j', j);
      if (list[i] > list[j]) {
        let temp;
        temp = list[i];
        list[i] = list[j];
        list[j] = temp;
        console.log('temp', temp);
        console.log('list', list);
      }
    }
  }
};

simpleSort([11,3,0,4,56,78,48])