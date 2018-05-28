module.exports = ({ email, firstName, lastName, value,message }) => {
  return `
    <html>
      <body>
        <div style="text-align: center;">
          <h1>Hello Admins,</h1>
          <h3>New user contacted you about becoming an admin, deatils:</h3>
          <h5>Name: ${lastName} ${firstName}</h5>
          <h5>Email: ${email}</h5>
          <h5>Gender: ${value}</h5>
          <h5>Message: ${message}</h5>
         </div>
      </body>
    </html>
  `;
};
