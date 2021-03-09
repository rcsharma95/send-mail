// var nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
// var toCsv = require("to-csv");
// const ObjectsToCsv = require('objects-to-csv');
const { convertArrayToCSV } = require('convert-array-to-csv');

module.exports = async function (
  email,
  verify,
  report = undefined,
  ws_data = undefined
) {

  sgMail.setApiKey(
    process.env.SENDGRID_KEY
  );

let header=ws_data ? ws_data.splice( 0, 1 ):[]
const csvFromArrayOfArrays =ws_data ? convertArrayToCSV(ws_data, {
  header,
  separator: ','
}):[]

  let data_base64 = ws_data
    ? Buffer.from(csvFromArrayOfArrays).toString('base64')
    : "nothing";

  // console.log(data_base64);

  const msg = {
    to: email,
    from: "info@mbillapp.com",
    subject: "M BILL",
    text: verify,

    attachments: ws_data
      ? [
          {
            content: data_base64,
            filename: report + ".csv",
            type: "text/csv",
            disposition: "attachment",
          },
        ]
      : undefined,
  };
  // sgMail.send(msg);
  sgMail.send(msg).then(
    (data) => {
      //   console.log("1>>>>", data);
    },
    (error) => {
      console.error("2>>>>", error);

      if (error.response) {
        console.error("3", error.response.body);
      }
    }
  );
};
