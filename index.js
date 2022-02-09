// Imports
require('dotenv').config()
const got = require('got');
const { ToadScheduler, SimpleIntervalJob, AsyncTask } = require('toad-scheduler')

const getAvailableAppointments = require('./get-available-appointments');
const getBookingPageHtml = require('./get-booking-page-html');
const sendTelegramNotification = require('./send-telegram-notification');
require('./logger');

// Setup simple scheduler
const scheduler = new ToadScheduler()
const checkForAppointmentsTask = new AsyncTask('checkForAppointments', checkForAppointments, handleErrors)
const job = new SimpleIntervalJob({ minutes: process.env.CHECK_INTERVAL_MINUTES, runImmediately: true }, checkForAppointmentsTask)
scheduler.addSimpleIntervalJob(job)

async function checkForAppointments() {

  console.log("checking for appointments...");
  let bookingPageHtml = await getBookingPageHtml();
  const dates = getAvailableAppointments(bookingPageHtml);

  if (dates.length > 0) {
    const message = `Buergeramt appointments are available now! Check ${process.env.BOOKING_URL}`
    await sendTelegramNotification(message)
    console.log(message);
  } else {
    console.log("no new appointments available.");
  }

  // Ping healthchecks.io
  if (process.env.HEALTHCHECKS_IO_TOKEN) {
    await got(`https://hc-ping.com/${process.env.HEALTHCHECKS_IO_TOKEN}`)
  }
};

async function handleErrors(err) {
  console.error(err);
  await sendTelegramNotification(JSON.stringify(err));
}
