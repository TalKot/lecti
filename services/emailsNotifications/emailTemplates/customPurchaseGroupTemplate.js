module.exports = message => {

    let val = 0;
    message = message.map(mes =>{
        ++val;
        return (`${val}. ${mes}<br />`);
    })

  return `
    <html>
      <body>
        <div style="text-align: center;">
          <h3>Here is the custom purchase group chose list:</h3>
          <p>${message.toString()}</p>
         </div>
      </body>
    </html>
  `;
};
