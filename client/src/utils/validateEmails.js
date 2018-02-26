//from emailregex.com
const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export default emails => {
    const invalidEmails = emails
        .split(',')
        .map(email => email.trim())
        .filter(email => !emailRegex.test(email));

    if (invalidEmails.length) {
        return `Invalid Emails: ${invalidEmails}`;
    }

    return;
};
