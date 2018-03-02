const keys = require('../../../config/keys');
//TODO - NEED TO CHANGE THIS
module.exports = becomeSeller => {
  return `
    <html>
      <body>
        <div style="text-align: center;">
          <h3>I'd like your confirmation about becoming a seller!</h3>
          <p>${survey.body}</p>
          <div>
            <a href="${keys.redirectedDomain}/api/surveys/${survey.id}/yes">Yes</a>
          </div>
          <div>
            <a href="${keys.redirectedDomain}/api/surveys/${survey.id}/no">No</a>
          </div>
        </div>
      </body>
    </html>
  `;
};
