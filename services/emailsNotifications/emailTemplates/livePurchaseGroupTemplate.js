module.exports = (message,name,id) => {
  return `
    <html>
      <body>
        <div style="text-align: center;">
          <h1>${message}</h1>
          <h3>${name}, ${id} - purchase group is now live!</h3>
          <h5>Access your account for more details.</h5>
         </div>
      </body>
    </html>
  `;
};
