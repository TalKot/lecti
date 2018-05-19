module.exports = (message, purcahseGroups) => {

  let val = 0;
  message = message.map(mes => {
    ++val;
    return (`${val}. ${mes}<br />`);
  })

  returnValus = () => {
    if (!purcahseGroups) {
      return (
        'There are no new purchase groups right now!'
      )
    } else {
      return Object.keys(purcahseGroups).map(key => {
        return (
          `${key} - purcahse groups amount of - ${purcahseGroups[key].length}`
        )
      })
    }
  }
  return `
    <html>
      <body>
        <div style="text-align: center;">
          <h3>Here are teh new purcahse groups created:</h3>
          <p>${returnValus()}</p>
          <h3>Here is the custom purchase group chose list:</h3>
          <p>${message.toString()}</p>
         </div>
      </body>
    </html>
  `;
};
