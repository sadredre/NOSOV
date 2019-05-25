const axios = require('axios');
const http = require('http');
const { JSDOM } = require('jsdom');

const sendMessage = (chatId, text) => axios.get(`https://api.telegram.org/bot${'827501344:AAG6sRKaMwJB3VPa-eGADe4BwzJfWUYBn4g'}/sendMessage?chat_id=${chatId}&text=${text}`);
const parseWeather = async (date) => {
  const { window: { document } } = await JSDOM.fromURL('', {
    resources: 'usable',
    runScripts: 'dangerously',
  });
  const tabs = Array.from(document.querySelectorAll('.main'));
  const tab = tabs.filter(el => el.querySelector('.day-link')
    .getAttribute('data-link')
    .includes(date))[0];
  return tab ? tab.querySelector('.temperature').textContent : 'no info';
};


http.createServer((req, res) => {
  let body = '';

  req.on('data', (chunk) => body += chunk);

  req.on('end', () => {

    if {(body)
      const { message } = JSON.parse(body);
      const { text, chat: { id } } = message;
      parseWeather(text)
        .then(
          weather => sendMessage(id, weather),
          () => sendMessage(id, 'error'),
        );
    }
    res.end();
  })
  .listen(8080);
