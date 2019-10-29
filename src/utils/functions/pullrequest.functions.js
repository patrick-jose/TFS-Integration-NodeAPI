module.exports.calcQuantityPRsByDay = (closedDates, creationDate, item) => {
    {
        let length = closedDates.length;
        for (let index = 0; index < closedDates.length; index++) {
            if (creationDate > closedDates[index]['closedDate']) {
                length--;
            }
        }
        return length - item;
    }
}

module.exports.formataStringData = (date) => {
    if (date != undefined) {
        date = date.toISOString().substring(0, 10).replace() + ' 00:00';
        year = date.substring(0, 4);
        month = date.substring(5, 7);
        day = date.substring(8, 10);

        return day + '/' + month + '/' + year + ' 00:00';
    }
    return null;
}

module.exports.orderList = (list) => {
    function compare( a, b ) {
        if ( a.name < b.name ){
          return -1;
        }
        if ( a.name > b.name ){
          return 1;
        }
        return 0;
      }
      
    return list.sort( compare );
}