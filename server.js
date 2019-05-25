const express = require('express');
const axios = require('axios');
const { JSDOM } = require('jsdom');

const token = process.env.WEATHER_BOT;

const setWebhook = url => axios.get(`https://api.telegram.org/bot${token}/setWebhook?url=${url}`);
const sendMessage = (chatId, text) => axios.get(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${text}`);
const parseWeather = async (date) => {
  const { window: { document } } = await JSDOM.fromURL('', { resources: 'usable', runScripts: 'dangerously' });
  const tabs = Array.from(document.querySelectorAll('.main'));
  const tab = tabs.filter(el => el.querySelector('.day-link').getAttribute('data-link').includes(date))[0];
  return tab ? tab.querySelector('.temperature').textContent : 'no info';
};

const app = express();
app.post('/telegram', (req, res) => {
  const { text, chat: { id } } = req.body.message;
  parseWeather(text).then(
    weather => sendMessage(id, weather),
    () => sendMessage(id, 'error'),
  );
  res.send();
});
app.get('*', (req, res) => {
  res.send('Hello from Express.js!');
});
app.listen(process.env.PORT || 3000);
setWebhook(`${process.env.APP_URL}telegram`);
